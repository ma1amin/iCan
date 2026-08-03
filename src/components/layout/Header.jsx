import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { useAuthContext } from '../../context/AuthContext';
import Button from '../common/Button';
import ThemeToggle from '../common/ThemeToggle';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setCurrentView } = useAppContext();
  const { logout, user } = useAuthContext();

  const getViewTitle = () => {
    const path = location.pathname;
    const titles = {
      '/dashboard': 'Dashboard',
      '/contacts': 'Contacts',
      '/calendar': 'Calendar',
      '/interactions': 'Interactions',
      '/tasks': 'Tasks',
      '/pipeline': 'Pipeline',
      '/companies': 'Companies',
      '/profile': 'Profile'
    };
    return titles[path] || 'Dashboard';
  };

  const getHeaderActions = () => {
    const path = location.pathname;
    const actions = {
      '/contacts': (
        <>
          <Button variant="ghost" size="small" icon="📥">
            Import
          </Button>
          <Button variant="primary" size="small" icon="➕">
            Add Contact
          </Button>
        </>
      ),
      '/calendar': (
        <Button variant="primary" size="small" icon="➕">
          New Appointment
        </Button>
      ),
      '/interactions': (
        <Button variant="primary" size="small" icon="➕">
          Log Interaction
        </Button>
      ),
      '/tasks': (
        <Button variant="primary" size="small" icon="➕">
          New Task
        </Button>
      ),
      '/pipeline': (
        <Button variant="primary" size="small" icon="➕">
          New Deal
        </Button>
      ),
      '/companies': null,
      '/dashboard': null,
      '/profile': null
    };
    return actions[path] || null;
  };

  // Update currentView based on route
  React.useEffect(() => {
    const path = location.pathname;
    const viewMap = {
      '/dashboard': 'dashboard',
      '/contacts': 'contacts',
      '/calendar': 'calendar',
      '/interactions': 'interactions',
      '/tasks': 'tasks',
      '/pipeline': 'pipeline',
      '/companies': 'companies',
      '/profile': 'profile'
    };
    setCurrentView(viewMap[path] || 'dashboard');
  }, [location.pathname, setCurrentView]);

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title">{getViewTitle()}</h1>
      </div>
      <div className="header-right">
        <ThemeToggle />
        {getHeaderActions()}
        <Button variant="ghost" size="small" onClick={() => navigate('/profile')}>
          Profile
        </Button>
        <Button variant="ghost" size="small" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;
