// Deal data type definitions and constants

export const DEAL_STAGES = [
  'prospecting',
  'qualification',
  'proposal',
  'negotiation',
  'closing',
  'won',
  'lost'
];

export const DEAL_STAGE_COLORS = {
  'prospecting': '#5B8DEF',
  'qualification': '#8B92A8',
  'proposal': '#F0B429',
  'negotiation': '#8B5CF6',
  'closing': '#34D399',
  'won': '#34D399',
  'lost': '#E06166'
};

export const DEAL_STAGE_LABELS = {
  'prospecting': 'Prospecting',
  'qualification': 'Qualification',
  'proposal': 'Proposal',
  'negotiation': 'Negotiation',
  'closing': 'Closing',
  'won': 'Won',
  'lost': 'Lost'
};

export const CURRENCIES = [
  'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'AED'
];

// Deal validation rules
export const dealValidation = {
  name: {
    required: true,
    minLength: 1,
    maxLength: 200
  },
  contactId: {
    required: true
  },
  value: {
    required: true,
    min: 0
  },
  probability: {
    required: true,
    min: 0,
    max: 100
  },
  currency: {
    required: true,
    pattern: /^[A-Z]{3}$/,
    default: 'USD'
  }
};

// Empty deal template
export const emptyDeal = () => ({
  id: generateId(),
  name: '',
  contactId: null,
  company: '',
  stage: 'prospecting',
  value: 0,
  currency: 'USD',
  probability: 20,
  expectedCloseDate: null,
  description: '',
  nextSteps: [],
  competitors: [],
  source: '',
  tags: [],
  createdAt: Date.now(),
  updatedAt: Date.now()
});

// Empty next step template
export const emptyNextStep = () => ({
  id: generateId(),
  action: '',
  dueDate: null,
  assignee: '',
  completed: false
});

// Empty competitor template
export const emptyCompetitor = () => ({
  name: '',
  strengths: '',
  weaknesses: '',
  offering: '',
  pricing: ''
});

// Generate unique ID
export const generateId = () => Math.random().toString(36).slice(2, 10);
