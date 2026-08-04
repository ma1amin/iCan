// Contact data type definitions and constants

export const CONTACT_STAGES = [
  'new',
  'contacted', 
  'meeting',
  'negotiating',
  'collaborating',
  'archived'
];

export const CONTACT_SOURCES = [
  'whatsapp',
  'linkedin',
  'other'
];

export const STAGE_COLORS = {
  'new': '#5B8DEF',
  'contacted': '#8B92A8',
  'meeting': '#F0B429',
  'negotiating': '#F0B429',
  'collaborating': '#34D399',
  'archived': '#4B5266'
};

export const STAGE_LABELS = {
  'new': 'New',
  'contacted': 'Contacted',
  'meeting': 'Meeting',
  'negotiating': 'Negotiating',
  'collaborating': 'Collaborating',
  'archived': 'Archived'
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
  stage: 'new',
  tags: [],
  lastContactDate: null,
  notes: '',
  relationshipStrength: 0,
  createdAt: Date.now(),
  updatedAt: Date.now()
});

// Generate unique ID
export const generateId = () => Math.random().toString(36).slice(2, 10);
