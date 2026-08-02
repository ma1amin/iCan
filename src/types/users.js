// User type definitions for iCan platform

export const ROLES = {
  ADMIN: 'admin',
  MEMBER: 'member',
  VIEWER: 'viewer'
};

export const ROLE_LABELS = {
  admin: 'Admin',
  member: 'Member',
  viewer: 'Viewer'
};

export const emptyUser = {
  id: '',
  email: '',
  password: '',
  name: '',
  tenantId: '',
  role: ROLES.MEMBER,
  emailVerified: false,
  avatar: '',
  createdAt: null,
  updatedAt: null
};

export const createUser = (userData) => ({
  ...emptyUser,
  ...userData,
  id: userData.id || 'user-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9),
  createdAt: userData.createdAt || Date.now(),
  updatedAt: Date.now()
});

export const validateUser = (user) => {
  const errors = [];
  
  if (!user.email || !user.email.includes('@')) {
    errors.push('Valid email is required');
  }
  
  if (!user.password || user.password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  
  if (!user.name || user.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};