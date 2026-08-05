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
      '/feedback': 'Feedback',
      '/companies': 'Companies',
      '/profile': 'Profile'
    };
    return titles[path] || 'Dashboard';
  };

  const getHeaderActions = () => {
    return null;
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
      '/feedback': 'feedback',
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
      </div>
    </header>
  );
};

export default Header;
