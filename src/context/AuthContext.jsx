import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../lib/api';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'ican-auth';

const defaultAuthState = {
  user: null,
  tenant: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState(defaultAuthState);

  // Save auth state to localStorage
  const saveAuthState = useCallback((user, tenant) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
      user,
      tenant,
      lastSync: Date.now()
    }));
  }, []);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        const token = localStorage.getItem('ican-token');
        
        if (stored && token) {
          const parsed = JSON.parse(stored);
          
          // Verify token is still valid by fetching current user
          try {
            const response = await authAPI.getCurrentUser();
            setState(prev => ({
              ...prev,
              user: response.user,
              tenant: response.tenant,
              isAuthenticated: true,
              isLoading: false
            }));
          } catch (error) {
            // Token invalid, clear auth state
            console.log('Token validation failed, clearing auth state');
            localStorage.removeItem(AUTH_STORAGE_KEY);
            localStorage.removeItem('ican-token');
            setState(prev => ({ ...prev, isLoading: false }));
          }
        } else {
          // Clear inconsistent state
          if (!token && stored) {
            localStorage.removeItem(AUTH_STORAGE_KEY);
          }
          if (token && !stored) {
            localStorage.removeItem('ican-token');
          }
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Error loading auth state:', error);
        setState(prev => ({ ...prev, error: 'Failed to load auth state', isLoading: false }));
      }
    };

    loadAuthState();
  }, []);

  // Register user
  const register = useCallback(async (userData, tenantData) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await authAPI.register(userData, tenantData);
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          user: response.user,
          tenant: response.tenant,
          isAuthenticated: true,
          isLoading: false,
          error: null
        }));

        saveAuthState(response.user, response.tenant);

        // Trigger data reload for the new tenant
        window.dispatchEvent(new Event('storage'));

        return { success: true, user: response.user, tenant: response.tenant, requiresVerification: response.requiresVerification };
      } else {
        throw new Error(response.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error in AuthContext:', error);
      setState(prev => ({ ...prev, error: error.message, isLoading: false }));
      return { success: false, error: error.message };
    }
  }, [saveAuthState]);

  // Login user
  const login = useCallback(async (email, password) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await authAPI.login(email, password);
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          user: response.user,
          tenant: response.tenant,
          isAuthenticated: true,
          isLoading: false,
          error: null
        }));

        saveAuthState(response.user, response.tenant);

        // Trigger data reload for the new tenant
        window.dispatchEvent(new Event('storage'));

        return { success: true, user: response.user, tenant: response.tenant };
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      setState(prev => ({ ...prev, error: error.message, isLoading: false }));
      return { success: false, error: error.message };
    }
  }, [saveAuthState]);

  // Logout user
  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setState(defaultAuthState);
      // Navigate to landing page
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setState(defaultAuthState);
      window.location.href = '/';
    }
  }, []);

  // Verify email
  const verifyEmail = useCallback(async (token) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await authAPI.verifyEmail(token);
      
      if (response.success) {
        // Update local state
        if (state.user) {
          setState(prev => ({
            ...prev,
            user: { ...prev.user, emailVerified: true },
            isLoading: false
          }));
          saveAuthState({ ...state.user, emailVerified: true }, state.tenant);
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }

        return { success: true };
      } else {
        throw new Error(response.error || 'Email verification failed');
      }
    } catch (error) {
      setState(prev => ({ ...prev, error: error.message, isLoading: false }));
      return { success: false, error: error.message };
    }
  }, [state.user, state.tenant, saveAuthState]);

  // Resend verification email
  const resendVerificationEmail = useCallback(async () => {
    try {
      if (!state.user) {
        throw new Error('No user logged in');
      }

      // For now, this is a placeholder as the API doesn't have this endpoint yet
      console.log('📧 Verification email resend requested for:', state.user.email);
      
      return { success: true };
    } catch (error) {
      setState(prev => ({ ...prev, error: error.message }));
      return { success: false, error: error.message };
    }
  }, [state.user]);

  // Update user profile
  const updateUserProfile = useCallback(async (updates) => {
    try {
      if (!state.user) {
        throw new Error('No user logged in');
      }

      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await authAPI.updateProfile(updates);
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          user: response.user,
          isLoading: false
        }));
        saveAuthState(response.user, state.tenant);

        return { success: true, user: response.user };
      } else {
        throw new Error(response.error || 'Profile update failed');
      }
    } catch (error) {
      setState(prev => ({ ...prev, error: error.message, isLoading: false }));
      return { success: false, error: error.message };
    }
  }, [state.user, state.tenant, saveAuthState]);

  // Delete account
  const deleteAccount = useCallback(async (password) => {
    try {
      if (!state.user) {
        throw new Error('No user logged in');
      }

      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await authAPI.deleteAccount(password);
      
      if (response.success) {
        // Clear auth state
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setState(defaultAuthState);

        return { success: true };
      } else {
        throw new Error(response.error || 'Account deletion failed');
      }
    } catch (error) {
      setState(prev => ({ ...prev, error: error.message, isLoading: false }));
      return { success: false, error: error.message };
    }
  }, [state.user]);

  const value = {
    ...state,
    register,
    login,
    logout,
    verifyEmail,
    resendVerificationEmail,
    updateUserProfile,
    deleteAccount
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};