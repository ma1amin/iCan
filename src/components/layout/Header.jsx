import React from 'react';
import { useAppContext } from '../../context/AppContext';
import Button from '../common/Button';
import './Header.css';

const Header = () => {
  const { currentView } = useAppContext();

  const getViewTitle = () => {
    const titles = {
      dashboard: 'Dashboard',
      contacts: 'Contacts',
      calendar: 'Calendar',
      interactions: 'Interactions',
      tasks: 'Tasks',
      pipeline: 'Pipeline',
      companies: 'Companies'
    };
    return titles[currentView] || currentView;
  };

  const getHeaderActions = () => {
    const actions = {
      contacts: (
        <>
          <Button variant="ghost" size="small" icon="📥">
            Import
          </Button>
          <Button variant="primary" size="small" icon="➕">
            Add Contact
          </Button>
        </>
      ),
      calendar: (
        <Button variant="primary" size="small" icon="➕">
          New Appointment
        </Button>
      ),
      interactions: (
        <Button variant="primary" size="small" icon="➕">
          Log Interaction
        </Button>
      ),
      tasks: (
        <Button variant="primary" size="small" icon="➕">
          New Task
        </Button>
      ),
      pipeline: (
        <Button variant="primary" size="small" icon="➕">
          New Deal
        </Button>
      ),
      companies: null,
      dashboard: null
    };
    return actions[currentView] || null;
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title">{getViewTitle()}</h1>
      </div>
      <div className="header-right">
        {getHeaderActions()}
      </div>
    </header>
  );
};

export default Header;
