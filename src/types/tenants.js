// Tenant type definitions for iCan platform

export const TENANT_PLANS = {
  FREE: 'free',
  PRO: 'pro',
  ENTERPRISE: 'enterprise'
};

export const TENANT_PLAN_LABELS = {
  free: 'Free',
  pro: 'Pro',
  enterprise: 'Enterprise'
};

export const emptyTenant = {
  id: '',
  name: '',
  slug: '',
  plan: TENANT_PLANS.FREE,
  settings: {
    theme: 'dark',
    currency: 'USD',
    dateFormat: 'YYYY-MM-DD',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  },
  createdBy: '',
  createdAt: null,
  updatedAt: null
};

export const createTenant = (tenantData) => ({
  ...emptyTenant,
  ...tenantData,
  id: tenantData.id || 'tenant-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9),
  slug: tenantData.slug || generateSlug(tenantData.name),
  createdAt: tenantData.createdAt || Date.now(),
  updatedAt: Date.now()
});

export const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export const validateTenant = (tenant) => {
  const errors = [];
  
  if (!tenant.name || tenant.name.trim().length < 2) {
    errors.push('Tenant name must be at least 2 characters');
  }
  
  if (!tenant.slug || tenant.slug.length < 2) {
    errors.push('Valid slug is required');
  }
  
  if (!Object.values(TENANT_PLANS).includes(tenant.plan)) {
    errors.push('Invalid plan type');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};