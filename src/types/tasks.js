// Task data type definitions and constants

export const TASK_STATUS = [
  'todo',
  'in_progress',
  'review',
  'done'
];

export const TASK_PRIORITY = [
  'low',
  'medium',
  'high'
];

export const TASK_CATEGORIES = [
  'follow-up',
  'research',
  'meeting_prep',
  'administrative',
  'development',
  'custom'
];

export const TASK_STATUS_COLORS = {
  'todo': '#4B5266',
  'in_progress': '#5B8DEF',
  'review': '#F0B429',
  'done': '#34D399'
};

export const TASK_PRIORITY_COLORS = {
  'low': '#4B5266',
  'medium': '#F0B429',
  'high': '#E06166'
};

export const TASK_STATUS_LABELS = {
  'todo': 'To Do',
  'in_progress': 'In Progress',
  'review': 'Review',
  'done': 'Done'
};

export const TASK_PRIORITY_LABELS = {
  'low': 'Low',
  'medium': 'Medium',
  'high': 'High'
};

export const TASK_CATEGORY_LABELS = {
  'follow-up': 'Follow-up',
  'research': 'Research',
  'meeting_prep': 'Meeting Prep',
  'administrative': 'Administrative',
  'development': 'Development',
  'custom': 'Custom'
};

// Task validation rules
export const taskValidation = {
  title: {
    required: true,
    minLength: 1,
    maxLength: 200
  },
  description: {
    maxLength: 2000
  },
  dueDate: {
    type: 'timestamp',
    validate: (value) => value > Date.now()
  },
  estimatedTime: {
    min: 0,
    max: 10080  // Max 1 week in minutes
  }
};

// Empty task template
export const emptyTask = () => ({
  id: generateId(),
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  dueDate: null,
  reminder: null,
  estimatedTime: null,
  actualTime: null,
  contactId: null,
  category: 'follow-up',
  tags: [],
  linkedItems: {
    appointments: [],
    interactions: [],
    deals: []
  },
  createdAt: Date.now(),
  updatedAt: Date.now(),
  completedAt: null
});

// Generate unique ID
export const generateId = () => Math.random().toString(36).slice(2, 10);
