// Contact data type definitions and constants

export const CONTACT_STAGES = [
  'New',
  'Contacted', 
  'Meeting',
  'Negotiating',
  'Collaborating',
  'Archived'
];

export const CONTACT_SOURCES = [
  'whatsapp',
  'linkedin',
  'other'
];

export const STAGE_COLORS = {
  'New': '#5B8DEF',
  'Contacted': '#8B92A8',
  'Meeting': '#F0B429',
  'Negotiating': '#F0B429',
  'Collaborating': '#34D399',
  'Archived': '#4B5266'
};

export const SOURCE_META = {
  'whatsapp': { label: 'WhatsApp', color: '#25D366' },
  'linkedin': { label: 'LinkedIn', color: '#0A66C2' },
  'other': { label: 'Other', color: '#8B92A8' }
};

// Contact validation rules
export const contactValidation = {
  name: {
    required: true,
    minLength: 1,
    maxLength: 100
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    maxLength: 100
  },
  phone: {
    pattern: /^\+?[\d\s\-()]+$/,
    maxLength: 20
  },
  company: {
    maxLength: 100
  },
  notes: {
    maxLength: 2000
  }
};

// Empty contact template
export const emptyContact = () => ({
  id: generateId(),
  name: '',
  phone: '',
  email: '',
  company: '',
  location: '',
  industry: '',
  source: 'whatsapp',
  stage: 'New',
  tags: [],
  lastContactDate: null,
  notes: '',
  relationshipStrength: 0,
  createdAt: Date.now(),
  updatedAt: Date.now()
});

// Generate unique ID
export const generateId = () => Math.random().toString(36).slice(2, 10);
