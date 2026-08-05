import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuthContext } from './AuthContext';
import { contactsAPI, appointmentsAPI, interactionsAPI, tasksAPI, dealsAPI } from '../lib/api';

const AppContext = createContext(null);

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
  const { user, tenant, isAuthenticated } = useAuthContext();

  // Check URL path on mount to set correct currentView
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/feedback') {
      setState(prev => ({ ...prev, currentView: 'feedback' }));
    }
  }, []);

  // Load data from API
  const loadData = useCallback(async () => {
    if (!isAuthenticated || !tenant) {
      setState(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Load all data in parallel
      const [contactsRes, appointmentsRes, interactionsRes, tasksRes, dealsRes] = await Promise.all([
        contactsAPI.getAll(),
        appointmentsAPI.getAll(),
        interactionsAPI.getAll(),
        tasksAPI.getAll(),
        dealsAPI.getAll()
      ]);

      setState(prev => ({
        ...prev,
        contacts: contactsRes.contacts || [],
        companies: [],
        appointments: appointmentsRes.appointments || [],
        interactions: interactionsRes.interactions || [],
        tasks: tasksRes.tasks || [],
        deals: dealsRes.deals || [],
        loading: false
      }));
    } catch (error) {
      console.error('Error loading data:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to load data',
        loading: false
      }));
    }
  }, [isAuthenticated, tenant]);

  // Load data when authentication status or tenant changes
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reload data when storage event occurs (for tenant changes)
  useEffect(() => {
    const handleStorageChange = () => {
      loadData();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadData]);

  // Contact CRUD operations
  const addContact = useCallback(async (contactData) => {
    try {
      console.log('AppContext addContact called with:', contactData);
      const response = await contactsAPI.create(contactData);
      console.log('API response:', response);
      setState(prev => ({
        ...prev,
        contacts: [...prev.contacts, response.contact]
      }));
      return { success: true, contact: response.contact };
    } catch (error) {
      console.error('Error adding contact:', error);
      return { success: false, error: error.message };
    }
  }, []);

  const updateContact = useCallback(async (id, contactData) => {
    try {
      const response = await contactsAPI.update(id, contactData);
      setState(prev => ({
        ...prev,
        contacts: prev.contacts.map(c => c.id === id ? response.contact : c)
      }));
      return { success: true, contact: response.contact };
    } catch (error) {
      console.error('Error updating contact:', error);
      return { success: false, error: error.message };
    }
  }, []);

  const deleteContact = useCallback(async (id) => {
    try {
      await contactsAPI.delete(id);
      setState(prev => ({
        ...prev,
        contacts: prev.contacts.filter(c => c.id !== id)
      }));
      return { success: true };
    } catch (error) {
      console.error('Error deleting contact:', error);
      return { success: false, error: error.message };
    }
  }, []);

  // Appointment CRUD operations
  const addAppointment = useCallback(async (appointmentData) => {
    try {
      const response = await appointmentsAPI.create(appointmentData);
      setState(prev => ({
        ...prev,
        appointments: [...prev.appointments, response.appointment]
      }));
      return { success: true, appointment: response.appointment };
    } catch (error) {
      console.error('Error adding appointment:', error);
      return { success: false, error: error.message };
    }
  }, []);

  const updateAppointment = useCallback(async (id, appointmentData) => {
    try {
      const response = await appointmentsAPI.update(id, appointmentData);
      setState(prev => ({
        ...prev,
        appointments: prev.appointments.map(a => a.id === id ? response.appointment : a)
      }));
      return { success: true, appointment: response.appointment };
    } catch (error) {
      console.error('Error updating appointment:', error);
      return { success: false, error: error.message };
    }
  }, []);

  const deleteAppointment = useCallback(async (id) => {
    try {
      await appointmentsAPI.delete(id);
      setState(prev => ({
        ...prev,
        appointments: prev.appointments.filter(a => a.id !== id)
      }));
      return { success: true };
    } catch (error) {
      console.error('Error deleting appointment:', error);
      return { success: false, error: error.message };
    }
  }, []);

  // Interaction CRUD operations
  const addInteraction = useCallback(async (interactionData) => {
    try {
      const response = await interactionsAPI.create(interactionData);
      setState(prev => ({
        ...prev,
        interactions: [...prev.interactions, response.interaction]
      }));
      return { success: true, interaction: response.interaction };
    } catch (error) {
      console.error('Error adding interaction:', error);
      return { success: false, error: error.message };
    }
  }, []);

  const updateInteraction = useCallback(async (id, interactionData) => {
    try {
      const response = await interactionsAPI.update(id, interactionData);
      setState(prev => ({
        ...prev,
        interactions: prev.interactions.map(i => i.id === id ? response.interaction : i)
      }));
      return { success: true, interaction: response.interaction };
    } catch (error) {
      console.error('Error updating interaction:', error);
      return { success: false, error: error.message };
    }
  }, []);

  const deleteInteraction = useCallback(async (id) => {
    try {
      await interactionsAPI.delete(id);
      setState(prev => ({
        ...prev,
        interactions: prev.interactions.filter(i => i.id !== id)
      }));
      return { success: true };
    } catch (error) {
      console.error('Error deleting interaction:', error);
      return { success: false, error: error.message };
    }
  }, []);

  // Task CRUD operations
  const addTask = useCallback(async (taskData) => {
    try {
      const response = await tasksAPI.create(taskData);
      setState(prev => ({
        ...prev,
        tasks: [...prev.tasks, response.task]
      }));
      return { success: true, task: response.task };
    } catch (error) {
      console.error('Error adding task:', error);
      return { success: false, error: error.message };
    }
  }, []);

  const updateTask = useCallback(async (id, taskData) => {
    try {
      const response = await tasksAPI.update(id, taskData);
      setState(prev => ({
        ...prev,
        tasks: prev.tasks.map(t => t.id === id ? response.task : t)
      }));
      return { success: true, task: response.task };
    } catch (error) {
      console.error('Error updating task:', error);
      return { success: false, error: error.message };
    }
  }, []);

  const deleteTask = useCallback(async (id) => {
    try {
      await tasksAPI.delete(id);
      setState(prev => ({
        ...prev,
        tasks: prev.tasks.filter(t => t.id !== id)
      }));
      return { success: true };
    } catch (error) {
      console.error('Error deleting task:', error);
      return { success: false, error: error.message };
    }
  }, []);

  // Deal CRUD operations
  const addDeal = useCallback(async (dealData) => {
    try {
      const response = await dealsAPI.create(dealData);
      setState(prev => ({
        ...prev,
        deals: [...prev.deals, response.deal]
      }));
      return { success: true, deal: response.deal };
    } catch (error) {
      console.error('Error adding deal:', error);
      return { success: false, error: error.message };
    }
  }, []);

  const updateDeal = useCallback(async (id, dealData) => {
    try {
      const response = await dealsAPI.update(id, dealData);
      setState(prev => ({
        ...prev,
        deals: prev.deals.map(d => d.id === id ? response.deal : d)
      }));
      return { success: true, deal: response.deal };
    } catch (error) {
      console.error('Error updating deal:', error);
      return { success: false, error: error.message };
    }
  }, []);

  const deleteDeal = useCallback(async (id) => {
    try {
      await dealsAPI.delete(id);
      setState(prev => ({
        ...prev,
        deals: prev.deals.filter(d => d.id !== id)
      }));
      return { success: true };
    } catch (error) {
      console.error('Error deleting deal:', error);
      return { success: false, error: error.message };
    }
  }, []);

  // Settings management
  const updateSettings = useCallback((newSettings) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }));
  }, []);

  // Theme toggle
  const toggleTheme = useCallback(() => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        theme: prev.settings.theme === 'dark' ? 'light' : 'dark'
      }
    }));
  }, []);

  // View management
  const setCurrentView = useCallback((view) => {
    setState(prev => ({ ...prev, currentView: view }));
  }, []);

  const value = {
    ...state,
    addContact,
    updateContact,
    deleteContact,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    addInteraction,
    updateInteraction,
    deleteInteraction,
    addTask,
    updateTask,
    deleteTask,
    addDeal,
    updateDeal,
    deleteDeal,
    updateSettings,
    toggleTheme,
    setCurrentView,
    loadData
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};