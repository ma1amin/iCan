import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createUser, validateUser, ROLES } from '../types/users';
import { createTenant, generateSlug, TENANT_PLANS } from '../types/tenants';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'ican-auth';
const VERIFICATION_TOKEN_STORAGE_KEY = 'ican-verification-tokens';

const defaultAuthState = {
  user: null,
  tenant: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState(defaultAuthState);

  // Load auth state from localStorage
  useEffect(() => {
    const loadAuthState = () => {
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setState(prev => ({
            ...prev,
            user: parsed.user,
            tenant: parsed.tenant,
            isAuthenticated: !!parsed.user,
            isLoading: false
          }));
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Error loading auth state:', error);
        setState(prev => ({ ...prev, isLoading: false, error: 'Failed to load auth state' }));
      }
    };

    loadAuthState();
  }, []);

  // Save auth state to localStorage
  const saveAuthState = useCallback((user, tenant) => {
    try {
      const dataToSave = {
        user,
        tenant,
        lastSync: Date.now()
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving auth state:', error);
    }
  }, []);

  // Generate verification token
  const generateVerificationToken = useCallback(() => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }, []);

  // Register user
  const register = useCallback(async (userData, tenantData) => {
    try {
      // Validate user data
      const userValidation = validateUser(userData);
      if (!userValidation.isValid) {
        throw new Error(userValidation.errors.join(', '));
      }

      // Create tenant
      const tenant = createTenant({
        name: tenantData.name || userData.name + "'s Organization",
        plan: TENANT_PLANS.FREE,
        createdBy: userData.email
      });

      // Create user
      const user = createUser({
        ...userData,
        tenantId: tenant.id,
        role: ROLES.ADMIN,
        emailVerified: false
      });

      // Generate verification token
      const token = generateVerificationToken();
      const verificationToken = {
        id: Date.now().toString(36),
        userId: user.id,
        token,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        usedAt: null
      };

      // Store verification token
      const existingTokens = JSON.parse(localStorage.getItem(VERIFICATION_TOKEN_STORAGE_KEY) || '[]');
      localStorage.setItem(VERIFICATION_TOKEN_STORAGE_KEY, JSON.stringify([...existingTokens, verificationToken]));

      // Mock email sending (in production, this would be an API call)
      console.log('📧 Verification Email Sent:', {
        to: user.email,
        subject: 'Verify your iCan account',
        verificationLink: `${window.location.origin}/verify-email?token=${token}`,
        token
      });

      // Save user and tenant to localStorage (in production, this would be API calls)
      const existingUsers = JSON.parse(localStorage.getItem('ican-users') || '[]');
      const existingTenants = JSON.parse(localStorage.getItem('ican-tenants') || '[]');
      
      localStorage.setItem('ican-users', JSON.stringify([...existingUsers, user]));
      localStorage.setItem('ican-tenants', JSON.stringify([...existingTenants, tenant]));

      setState(prev => ({
        ...prev,
        user,
        tenant,
        isAuthenticated: true,
        isLoading: false,
        error: null
      }));

      saveAuthState(user, tenant);

      return { success: true, user, tenant, requiresVerification: true };
    } catch (error) {
      setState(prev => ({ ...prev, error: error.message }));
      return { success: false, error: error.message };
    }
  }, [generateVerificationToken, saveAuthState]);

  // Login user
  const login = useCallback(async (email, password) => {
    try {
      const existingUsers = JSON.parse(localStorage.getItem('ican-users') || '[]');
      const existingTenants = JSON.parse(localStorage.getItem('ican-tenants') || '[]');

      const user = existingUsers.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }

      const tenant = existingTenants.find(t => t.id === user.tenantId);
      
      if (!tenant) {
        throw new Error('Tenant not found');
      }

      setState(prev => ({
        ...prev,
        user,
        tenant,
        isAuthenticated: true,
        isLoading: false,
        error: null
      }));

      saveAuthState(user, tenant);

      return { success: true, user, tenant };
    } catch (error) {
      setState(prev => ({ ...prev, error: error.message }));
      return { success: false, error: error.message };
    }
  }, [saveAuthState]);

  // Logout user
  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setState(defaultAuthState);
  }, []);

  // Verify email
  const verifyEmail = useCallback(async (token) => {
    try {
      const existingTokens = JSON.parse(localStorage.getItem(VERIFICATION_TOKEN_STORAGE_KEY) || '[]');
      const existingUsers = JSON.parse(localStorage.getItem('ican-users') || '[]');

      const verificationToken = existingTokens.find(t => t.token === token && !t.usedAt && t.expiresAt > Date.now());
      
      if (!verificationToken) {
        throw new Error('Invalid or expired verification token');
      }

      // Mark token as used
      const updatedTokens = existingTokens.map(t => 
        t.id === verificationToken.id ? { ...t, usedAt: Date.now() } : t
      );
      localStorage.setItem(VERIFICATION_TOKEN_STORAGE_KEY, JSON.stringify(updatedTokens));

      // Update user email verification status
      const updatedUsers = existingUsers.map(u => 
        u.id === verificationToken.userId ? { ...u, emailVerified: true, updatedAt: Date.now() } : u
      );
      localStorage.setItem('ican-users', JSON.stringify(updatedUsers));

      // Update current user if logged in
      if (state.user && state.user.id === verificationToken.userId) {
        const updatedUser = { ...state.user, emailVerified: true, updatedAt: Date.now() };
        setState(prev => ({ ...prev, user: updatedUser }));
        saveAuthState(updatedUser, state.tenant);
      }

      return { success: true };
    } catch (error) {
      setState(prev => ({ ...prev, error: error.message }));
      return { success: false, error: error.message };
    }
  }, [state.user, state.tenant, saveAuthState]);

  // Resend verification email
  const resendVerificationEmail = useCallback(async () => {
    try {
      if (!state.user) {
        throw new Error('No user logged in');
      }

      if (state.user.emailVerified) {
        throw new Error('Email already verified');
      }

      const token = generateVerificationToken();
      const verificationToken = {
        id: Date.now().toString(36),
        userId: state.user.id,
        token,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        usedAt: null
      };

      const existingTokens = JSON.parse(localStorage.getItem(VERIFICATION_TOKEN_STORAGE_KEY) || '[]');
      localStorage.setItem(VERIFICATION_TOKEN_STORAGE_KEY, JSON.stringify([...existingTokens, verificationToken]));

      // Mock email sending
      console.log('📧 Verification Email Resent:', {
        to: state.user.email,
        subject: 'Verify your iCan account',
        verificationLink: `${window.location.origin}/verify-email?token=${token}`,
        token
      });

      return { success: true };
    } catch (error) {
      setState(prev => ({ ...prev, error: error.message }));
      return { success: false, error: error.message };
    }
  }, [state.user, generateVerificationToken]);

  // Update user profile
  const updateUserProfile = useCallback(async (updates) => {
    try {
      if (!state.user) {
        throw new Error('No user logged in');
      }

      const existingUsers = JSON.parse(localStorage.getItem('ican-users') || '[]');
      const updatedUser = { ...state.user, ...updates, updatedAt: Date.now() };
      
      const updatedUsers = existingUsers.map(u => 
        u.id === state.user.id ? updatedUser : u
      );
      localStorage.setItem('ican-users', JSON.stringify(updatedUsers));

      setState(prev => ({ ...prev, user: updatedUser }));
      saveAuthState(updatedUser, state.tenant);

      return { success: true, user: updatedUser };
    } catch (error) {
      setState(prev => ({ ...prev, error: error.message }));
      return { success: false, error: error.message };
    }
  }, [state.user, state.tenant, saveAuthState]);

  // Delete account
  const deleteAccount = useCallback(async () => {
    try {
      if (!state.user) {
        throw new Error('No user logged in');
      }

      // Remove user from users array
      const existingUsers = JSON.parse(localStorage.getItem('ican-users') || '[]');
      const updatedUsers = existingUsers.filter(u => u.id !== state.user.id);
      localStorage.setItem('ican-users', JSON.stringify(updatedUsers));

      // Remove tenant if user is the only member (in production, check tenant member count)
      if (state.tenant && state.tenant.createdBy === state.user.email) {
        const existingTenants = JSON.parse(localStorage.getItem('ican-tenants') || '[]');
        const updatedTenants = existingTenants.filter(t => t.id !== state.tenant.id);
        localStorage.setItem('ican-tenants', JSON.stringify(updatedTenants));
      }

      // Clear auth state
      localStorage.removeItem(AUTH_STORAGE_KEY);

      // Reset state
      setState(defaultAuthState);

      return { success: true };
    } catch (error) {
      setState(prev => ({ ...prev, error: error.message }));
      return { success: false, error: error.message };
    }
  }, [state.user, state.tenant]);

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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};