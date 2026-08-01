// Company data type definitions and constants

export const COMPANY_SIZES = [
  'startup',
  'small',
  'medium',
  'large',
  'enterprise'
];

export const INDUSTRIES = [
  'technology',
  'finance',
  'healthcare',
  'retail',
  'manufacturing',
  'consulting',
  'education',
  'government',
  'nonprofit',
  'other'
];

export const COMPANY_SIZE_LABELS = {
  'startup': 'Startup (1-10)',
  'small': 'Small (11-50)',
  'medium': 'Medium (51-200)',
  'large': 'Large (201-1000)',
  'enterprise': 'Enterprise (1000+)'
};

export const INDUSTRY_LABELS = {
  'technology': 'Technology',
  'finance': 'Finance',
  'healthcare': 'Healthcare',
  'retail': 'Retail',
  'manufacturing': 'Manufacturing',
  'consulting': 'Consulting',
  'education': 'Education',
  'government': 'Government',
  'nonprofit': 'Non-Profit',
  'other': 'Other'
};

// Company validation rules
export const companyValidation = {
  name: {
    required: true,
    minLength: 1,
    maxLength: 200
  },
  industry: {
    required: true
  },
  size: {
    required: true
  },
  website: {
    pattern: /^https?:\/\/.+/,
    optional: true
  }
};

// Empty company template
export const emptyCompany = () => ({
  id: generateId(),
  name: '',
  industry: 'technology',
  size: 'small',
  website: '',
  location: '',
  description: '',
  notes: '',
  foundedYear: null,
  revenue: null,
  employeeCount: null,
  tags: [],
  createdAt: Date.now(),
  updatedAt: Date.now()
});

// Generate unique ID
export const generateId = () => Math.random().toString(36).slice(2, 10);
