const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('ican-token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
};

// Authentication API
export const authAPI = {
  register: async (userData, tenantData) => {
    const response = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ ...userData, organizationName: tenantData.name }),
    });
    
    // Store token
    if (response.token) {
      localStorage.setItem('ican-token', response.token);
    }
    
    return response;
  },

  login: async (email, password) => {
    const response = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Store token
    if (response.token) {
      localStorage.setItem('ican-token', response.token);
    }
    
    return response;
  },

  logout: () => {
    localStorage.removeItem('ican-token');
    return Promise.resolve();
  },

  verifyEmail: async (token) => {
    return apiCall('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },

  getCurrentUser: async () => {
    return apiCall('/auth/me');
  },

  updateProfile: async (updates) => {
    return apiCall('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  updateEmail: async (currentPassword, newEmail) => {
    return apiCall('/auth/email', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newEmail }),
    });
  },

  deleteAccount: async (password) => {
    return apiCall('/auth/account', {
      method: 'DELETE',
      body: JSON.stringify({ password }),
    });
  },
};

// Contacts API
export const contactsAPI = {
  getAll: async () => {
    return apiCall('/contacts');
  },

  create: async (contactData) => {
    return apiCall('/contacts', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  },

  update: async (id, contactData) => {
    return apiCall(`/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contactData),
    });
  },

  delete: async (id) => {
    return apiCall(`/contacts/${id}`, {
      method: 'DELETE',
    });
  },
};

// Companies API
export const companiesAPI = {
  getAll: async () => {
    return apiCall('/companies');
  },

  create: async (companyData) => {
    return apiCall('/companies', {
      method: 'POST',
      body: JSON.stringify(companyData),
    });
  },

  update: async (id, companyData) => {
    return apiCall(`/companies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(companyData),
    });
  },

  delete: async (id) => {
    return apiCall(`/companies/${id}`, {
      method: 'DELETE',
    });
  },
};

// Appointments API
export const appointmentsAPI = {
  getAll: async () => {
    return apiCall('/appointments');
  },

  create: async (appointmentData) => {
    return apiCall('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  },

  update: async (id, appointmentData) => {
    return apiCall(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(appointmentData),
    });
  },

  delete: async (id) => {
    return apiCall(`/appointments/${id}`, {
      method: 'DELETE',
    });
  },
};

// Interactions API
export const interactionsAPI = {
  getAll: async () => {
    return apiCall('/interactions');
  },

  create: async (interactionData) => {
    return apiCall('/interactions', {
      method: 'POST',
      body: JSON.stringify(interactionData),
    });
  },

  update: async (id, interactionData) => {
    return apiCall(`/interactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(interactionData),
    });
  },

  delete: async (id) => {
    return apiCall(`/interactions/${id}`, {
      method: 'DELETE',
    });
  },
};

// Tasks API
export const tasksAPI = {
  getAll: async () => {
    return apiCall('/tasks');
  },

  create: async (taskData) => {
    return apiCall('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },

  update: async (id, taskData) => {
    return apiCall(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  },

  delete: async (id) => {
    return apiCall(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },
};

// Deals API
export const dealsAPI = {
  getAll: async () => {
    return apiCall('/deals');
  },

  create: async (dealData) => {
    return apiCall('/deals', {
      method: 'POST',
      body: JSON.stringify(dealData),
    });
  },

  update: async (id, dealData) => {
    return apiCall(`/deals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dealData),
    });
  },

  delete: async (id) => {
    return apiCall(`/deals/${id}`, {
      method: 'DELETE',
    });
  },
};

// Feedback API
export const feedbackAPI = {
  getAll: async () => {
    return apiCall('/feedback');
  },

  getById: async (id) => {
    return apiCall(`/feedback/${id}`);
  },

  submit: async (feedbackData) => {
    return apiCall('/feedback', {
      method: 'POST',
      body: JSON.stringify(feedbackData),
    });
  },
};