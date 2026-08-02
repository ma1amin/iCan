import React from 'react';
import { useAppContext } from '../../context/AppContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { settings, toggleTheme } = useAppContext();
  const isDark = settings.theme === 'dark';

  return (
    <button 
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <span className="theme-toggle-icon">☀️</span>
      ) : (
        <span className="theme-toggle-icon">🌙</span>
      )}
    </button>
  );
};

export default ThemeToggle;