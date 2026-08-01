import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { emptyContact } from '../types/contacts';
import { emptyAppointment } from '../types/appointments';
import { emptyInteraction } from '../types/interactions';
import { emptyTask } from '../types/tasks';
import { emptyDeal } from '../types/deals';
import { emptyCompany } from '../types/companies';

const AppContext = createContext(null);

const STORAGE_KEY = 'ican-data';
const DATA_VERSION = '1.0.0';

const defaultSettings = {
  theme: 'dark',
  currency: 'USD',
  dateFormat: 'YYYY-MM-DD',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  defaultReminder: '1hour',
  defaultTaskCategory: 'follow-up',
  defaultAppointmentType: 'meeting',
  calendarStartHour: 8,
  calendarEndHour: 18,
  weekStartDay: 0,
  enableNotifications: false,
  notificationSound: false,
  autoBackup: true,
  backupFrequency: 'daily',
  lastBackup: null
};

const initialState = {
  contacts: [],
  appointments: [],
  interactions: [],
  tasks: [],
  deals: [],
  companies: [],
  settings: defaultSettings,
  currentView: 'dashboard',
  loading: true,
  error: null
};

export const AppProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  // Load data from localStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setState(prev => ({
            ...prev,
            ...parsed,
            loading: false
          }));
        } else {
          setState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setState(prev => ({
          ...prev,
          error: 'Failed to load data',
          loading: false
        }));
      }
    };

    loadData();
  }, []);

  // Save data to localStorage
  const saveData = useCallback(async () => {
    try {
      const dataToSave = {
        contacts: state.contacts,
        appointments: state.appointments,
        interactions: state.interactions,
        tasks: state.tasks,
        deals: state.deals,
        companies: state.companies,
        settings: state.settings,
        version: DATA_VERSION,
        lastSync: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving data:', error);
      setState(prev => ({ ...prev, error: 'Failed to save data' }));
    }
  }, [state]);

  // Auto-save when state changes
  useEffect(() => {
    if (!state.loading) {
      saveData();
    }
  }, [state, state.loading, saveData]);

  // Contact actions
  const addContact = useCallback((contact) => {
    setState(prev => ({
      ...prev,
      contacts: [...prev.contacts, { ...contact, id: contact.id || Date.now().toString(36), createdAt: Date.now(), updatedAt: Date.now() }]
    }));
  }, []);

  const updateContact = useCallback((id, updates) => {
    setState(prev => ({
      ...prev,
      contacts: prev.contacts.map(c => c.id === id ? { ...c, ...updates, updatedAt: Date.now() } : c)
    }));
  }, []);

  const deleteContact = useCallback((id) => {
    setState(prev => ({
      ...prev,
      contacts: prev.contacts.filter(c => c.id !== id)
    }));
  }, []);

  // Appointment actions
  const addAppointment = useCallback((appointment) => {
    setState(prev => ({
      ...prev,
      appointments: [...prev.appointments, { ...appointment, id: appointment.id || Date.now().toString(36), createdAt: Date.now(), updatedAt: Date.now() }]
    }));
  }, []);

  const updateAppointment = useCallback((id, updates) => {
    setState(prev => ({
      ...prev,
      appointments: prev.appointments.map(a => a.id === id ? { ...a, ...updates, updatedAt: Date.now() } : a)
    }));
  }, []);

  const deleteAppointment = useCallback((id) => {
    setState(prev => ({
      ...prev,
      appointments: prev.appointments.filter(a => a.id !== id)
    }));
  }, []);

  // Interaction actions
  const addInteraction = useCallback((interaction) => {
    setState(prev => ({
      ...prev,
      interactions: [...prev.interactions, { ...interaction, id: interaction.id || Date.now().toString(36), createdAt: Date.now(), updatedAt: Date.now() }]
    }));
  }, []);

  const updateInteraction = useCallback((id, updates) => {
    setState(prev => ({
      ...prev,
      interactions: prev.interactions.map(i => i.id === id ? { ...i, ...updates, updatedAt: Date.now() } : i)
    }));
  }, []);

  const deleteInteraction = useCallback((id) => {
    setState(prev => ({
      ...prev,
      interactions: prev.interactions.filter(i => i.id !== id)
    }));
  }, []);

  // Task actions
  const addTask = useCallback((task) => {
    setState(prev => ({
      ...prev,
      tasks: [...prev.tasks, { ...task, id: task.id || Date.now().toString(36), createdAt: Date.now(), updatedAt: Date.now() }]
    }));
  }, []);

  const updateTask = useCallback((id, updates) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, ...updates, updatedAt: Date.now(), completedAt: updates.status === 'done' ? Date.now() : t.completedAt } : t)
    }));
  }, []);

  const deleteTask = useCallback((id) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== id)
    }));
  }, []);

  // Deal actions
  const addDeal = useCallback((deal) => {
    setState(prev => ({
      ...prev,
      deals: [...prev.deals, { ...deal, id: deal.id || Date.now().toString(36), createdAt: Date.now(), updatedAt: Date.now() }]
    }));
  }, []);

  const updateDeal = useCallback((id, updates) => {
    setState(prev => ({
      ...prev,
      deals: prev.deals.map(d => d.id === id ? { ...d, ...updates, updatedAt: Date.now() } : d)
    }));
  }, []);

  const deleteDeal = useCallback((id) => {
    setState(prev => ({
      ...prev,
      deals: prev.deals.filter(d => d.id !== id)
    }));
  }, []);

  // Company actions
  const addCompany = useCallback((company) => {
    setState(prev => ({
      ...prev,
      companies: [...prev.companies, { ...company, id: company.id || Date.now().toString(36), createdAt: Date.now(), updatedAt: Date.now() }]
    }));
  }, []);

  const updateCompany = useCallback((id, updates) => {
    setState(prev => ({
      ...prev,
      companies: prev.companies.map(c => c.id === id ? { ...c, ...updates, updatedAt: Date.now() } : c)
    }));
  }, []);

  const deleteCompany = useCallback((id) => {
    setState(prev => ({
      ...prev,
      companies: prev.companies.filter(c => c.id !== id)
    }));
  }, []);

  // View management
  const setCurrentView = useCallback((view) => {
    setState(prev => ({ ...prev, currentView: view }));
  }, []);

  // Settings
  const updateSettings = useCallback((updates) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...updates }
    }));
  }, []);

  const value = {
    ...state,
    // Contact actions
    addContact,
    updateContact,
    deleteContact,
    // Appointment actions
    addAppointment,
    updateAppointment,
    deleteAppointment,
    // Interaction actions
    addInteraction,
    updateInteraction,
    deleteInteraction,
    // Task actions
    addTask,
    updateTask,
    deleteTask,
    // Deal actions
    addDeal,
    updateDeal,
    deleteDeal,
    // Company actions
    addCompany,
    updateCompany,
    deleteCompany,
    // View management
    setCurrentView,
    // Settings
    updateSettings,
    // Data management
    saveData
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export default AppContext;
