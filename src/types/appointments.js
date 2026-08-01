// Appointment data type definitions and constants

export const APPOINTMENT_TYPES = [
  'call',
  'meeting',
  'video',
  'email',
  'task',
  'other'
];

export const APPOINTMENT_STATUS = [
  'scheduled',
  'completed',
  'cancelled'
];

export const RECURRENCE_FREQUENCIES = [
  'daily',
  'weekly',
  'biweekly',
  'monthly',
  'custom'
];

export const REMINDER_TIMINGS = [
  '15min',
  '1hour',
  '1day',
  'custom'
];

export const APPOINTMENT_TYPE_COLORS = {
  'call': '#5B8DEF',
  'meeting': '#34D399',
  'video': '#F0B429',
  'email': '#8B92A8',
  'task': '#8B5CF6',
  'other': '#4B5266'
};

export const APPOINTMENT_TYPE_LABELS = {
  'call': 'Call',
  'meeting': 'Meeting',
  'video': 'Video Call',
  'email': 'Email',
  'task': 'Task',
  'other': 'Other'
};

// Appointment validation rules
export const appointmentValidation = {
  title: {
    required: true,
    minLength: 1,
    maxLength: 200
  },
  startTime: {
    required: true,
    type: 'timestamp'
  },
  endTime: {
    required: true,
    type: 'timestamp',
    validate: (value, formData) => value > formData.startTime
  },
  description: {
    maxLength: 2000
  },
  location: {
    maxLength: 500
  }
};

// Empty appointment template
export const emptyAppointment = () => ({
  id: generateId(),
  title: '',
  contactId: null,
  description: '',
  startTime: null,
  endTime: null,
  location: '',
  type: 'meeting',
  recurrence: null,
  reminder: null,
  status: 'scheduled',
  createdAt: Date.now(),
  updatedAt: Date.now()
});

// Generate unique ID
export const generateId = () => Math.random().toString(36).slice(2, 10);
