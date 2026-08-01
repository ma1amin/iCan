// Interaction data type definitions and constants

export const INTERACTION_TYPES = [
  'call',
  'email',
  'message',
  'meeting',
  'other'
];

export const INTERACTION_DIRECTIONS = [
  'inbound',
  'outbound'
];

export const INTERACTION_OUTCOMES = [
  'follow-up_required',
  'awaiting_response',
  'completed',
  'no_response',
  'not_interested',
  'custom'
];

export const INTERACTION_TYPE_COLORS = {
  'call': '#5B8DEF',
  'email': '#34D399',
  'message': '#F0B429',
  'meeting': '#8B5CF6',
  'other': '#4B5266'
};

export const INTERACTION_TYPE_LABELS = {
  'call': 'Call',
  'email': 'Email',
  'message': 'Message',
  'meeting': 'Meeting',
  'other': 'Other'
};

export const INTERACTION_OUTCOME_LABELS = {
  'follow-up_required': 'Follow-up Required',
  'awaiting_response': 'Awaiting Response',
  'completed': 'Completed',
  'no_response': 'No Response',
  'not_interested': 'Not Interested',
  'custom': 'Custom'
};

// Interaction validation rules
export const interactionValidation = {
  contactId: {
    required: true
  },
  subject: {
    maxLength: 200
  },
  content: {
    maxLength: 5000
  },
  duration: {
    min: 0,
    max: 1440  // Max 24 hours in minutes
  }
};

// Empty interaction template
export const emptyInteraction = () => ({
  id: generateId(),
  contactId: null,
  type: 'call',
  direction: 'outbound',
  subject: '',
  content: '',
  timestamp: Date.now(),
  duration: null,
  outcome: 'completed',
  appointmentId: null,
  createdAt: Date.now(),
  updatedAt: Date.now()
});

// Generate unique ID
export const generateId = () => Math.random().toString(36).slice(2, 10);
