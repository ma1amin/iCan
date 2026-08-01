import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import AppShell from './components/layout/AppShell';
import Dashboard from './components/dashboard/Dashboard';
import ContactsView from './components/contacts/ContactsView';
import CalendarView from './components/calendar/CalendarView';
import InteractionsView from './components/interactions/InteractionsView';
import TasksView from './components/tasks/TasksView';
import PipelineView from './components/negotiations/PipelineView';
import CompaniesView from './components/contacts/CompaniesView';

function AppContent() {
  const { currentView, loading } = useAppContext();

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner">Loading iCan...</div>
      </div>
    );
  }

  const views = {
    dashboard: <Dashboard />,
    contacts: <ContactsView />,
    calendar: <CalendarView />,
    interactions: <InteractionsView />,
    tasks: <TasksView />,
    pipeline: <PipelineView />,
    companies: <CompaniesView />
  };

  return views[currentView] || <Dashboard />;
}

function App() {
  return (
    <AppProvider>
      <AppShell>
        <AppContent />
      </AppShell>
    </AppProvider>
  );
}

export default App;
