// Feedback categories and subjects configuration

export const FEEDBACK_SUBJECTS = [
  { value: 'bug_report', label: 'Bug Report' },
  { value: 'feature_request', label: 'Feature Request' },
  { value: 'general_feedback', label: 'General Feedback' },
  { value: 'support', label: 'Support' },
  { value: 'ui_ux', label: 'UI/UX' },
  { value: 'performance', label: 'Performance' }
];

export const FEEDBACK_CATEGORIES = {
  bug_report: [
    { value: 'login', label: 'Login' },
    { value: 'database', label: 'Database' },
    { value: 'forms', label: 'Forms' },
    { value: 'performance', label: 'Performance' },
    { value: 'other', label: 'Other' }
  ],
  feature_request: [
    { value: 'contacts', label: 'Contacts' },
    { value: 'calendar', label: 'Calendar' },
    { value: 'tasks', label: 'Tasks' },
    { value: 'pipeline', label: 'Pipeline' },
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'other', label: 'Other' }
  ],
  general_feedback: [
    { value: 'satisfaction', label: 'Satisfaction' },
    { value: 'suggestion', label: 'Suggestion' },
    { value: 'complaint', label: 'Complaint' },
    { value: 'other', label: 'Other' }
  ],
  support: [
    { value: 'account', label: 'Account' },
    { value: 'billing', label: 'Billing' },
    { value: 'technical', label: 'Technical' },
    { value: 'other', label: 'Other' }
  ],
  ui_ux: [
    { value: 'navigation', label: 'Navigation' },
    { value: 'design', label: 'Design' },
    { value: 'accessibility', label: 'Accessibility' },
    { value: 'other', label: 'Other' }
  ],
  performance: [
    { value: 'speed', label: 'Speed' },
    { value: 'reliability', label: 'Reliability' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'other', label: 'Other' }
  ]
};

export const FEEDBACK_PRIORITIES = [
  { value: 'high', label: 'High', color: '#E06166' },
  { value: 'medium', label: 'Medium', color: '#F0B429' },
  { value: 'low', label: 'Low', color: '#34D399' }
];

export const FEEDBACK_STATUS = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
  { value: 'archived', label: 'Archived' }
];

export const getCategoriesForSubject = (subject) => {
  return FEEDBACK_CATEGORIES[subject] || [];
};

export const getPriorityLabel = (priority) => {
  const found = FEEDBACK_PRIORITIES.find(p => p.value === priority);
  return found ? found.label : priority;
};

export const getPriorityColor = (priority) => {
  const found = FEEDBACK_PRIORITIES.find(p => p.value === priority);
  return found ? found.color : '#8B92A8';
};

export const getStatusLabel = (status) => {
  const found = FEEDBACK_STATUS.find(s => s.value === status);
  return found ? found.label : status;
};
