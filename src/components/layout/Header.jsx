import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { useAuthContext } from '../../context/AuthContext';
import Button from '../common/Button';
import ThemeToggle from '../common/ThemeToggle';
import './Header.css';

// Hamburger menu icon component
const HamburgerIcon = ({ isOpen }) => (
  <div className={`hamburger-icon ${isOpen ? 'open' : ''}`}>
    <span className="hamburger-line"></span>
    <span className="hamburger-line"></span>
    <span className="hamburger-line"></span>
  </div>
);

const Header = ({ onMenuToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setCurrentView } = useAppContext();
  const { logout, user } = useAuthContext();
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('ican-theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Sync theme with DOM
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('ican-theme', newTheme);
  };

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
        <button 
          className="header-menu-toggle mobile-only"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <HamburgerIcon isOpen={false} />
        </button>
        <h1 className="header-title">{getViewTitle()}</h1>
      </div>
      <div className="header-right">
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
        {getHeaderActions()}
      </div>
    </header>
  );
};

export default Header;
