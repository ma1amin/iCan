import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AdminAuthContext = createContext(null);

const ADMIN_STORAGE_KEY = 'ican-admin-auth';

const defaultAdminAuthState = {
  admin: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

export const AdminAuthProvider = ({ children }) => {
  const [state, setState] = useState(defaultAdminAuthState);

  // Save admin auth state to localStorage
  const saveAdminAuthState = useCallback((admin, token) => {
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify({
      admin,
      token,
      lastSync: Date.now()
    }));
  }, []);

  // Load admin auth state from localStorage on mount
  useEffect(() => {
    const loadAdminAuthState = async () => {
      try {
        const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
        const token = localStorage.getItem('ican-admin-token');
        
        if (stored && token) {
          const parsed = JSON.parse(stored);
          
          // Verify token is still valid by fetching current admin
          try {
            const response = await fetch('http://localhost:3001/api/admin/verify', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (response.ok) {
              const data = await response.json();
              setState(prev => ({
                ...prev,
                admin: data.admin,
                isAuthenticated: true,
                isLoading: false
              }));
            } else if (response.status === 401) {
              // Token invalid, clear auth state
              localStorage.removeItem(ADMIN_STORAGE_KEY);
              localStorage.removeItem('ican-admin-token');
              setState(prev => ({
                ...prev,
                admin: null,
                isAuthenticated: false,
                isLoading: false
              }));
            } else {
              // Other error, keep user logged in but show error
              console.error('Admin verification failed:', response.status);
              setState(prev => ({
                ...prev,
                admin: parsed.admin,
                isAuthenticated: true,
                isLoading: false
              }));
            }
          } catch (error) {
            console.log('Admin token validation failed, using cached data');
            // Network error, keep user logged in with cached data
            setState(prev => ({
              ...prev,
              admin: parsed.admin,
              isAuthenticated: true,
              isLoading: false
            }));
          }
        } else {
          setState(prev => ({
            ...prev,
            isLoading: false
          }));
        }
      } catch (error) {
        console.error('Error loading admin auth state:', error);
        setState(prev => ({
          ...prev,
          isLoading: false
        }));
      }
    };

    loadAdminAuthState();
  }, []);

  const adminLogin = useCallback(async (username, password) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await fetch('http://localhost:3001/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('ican-admin-token', data.token);
        saveAdminAuthState(data.admin, data.token);
        
        setState(prev => ({
          ...prev,
          admin: data.admin,
          isAuthenticated: true,
          isLoading: false,
          error: null
        }));
        
        return { success: true };
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: data.error || 'Admin login failed'
        }));
        
        return { success: false, error: data.error || 'Admin login failed' };
      }
    } catch (error) {
      console.error('Admin login error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Network error during admin login'
      }));
      
      return { success: false, error: 'Network error during admin login' };
    }
  }, [saveAdminAuthState]);

  const adminLogout = useCallback(() => {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    localStorage.removeItem('ican-admin-token');
    setState(defaultAdminAuthState);
  }, []);

  const value = {
    ...state,
    adminLogin,
    adminLogout
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuthContext = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuthContext must be used within AdminAuthProvider');
  }
  return context;
};

export default AdminAuthContext;
