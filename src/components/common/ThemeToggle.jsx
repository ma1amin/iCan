import React from 'react';
import { useAppContext } from '../../context/AppContext';
import './ThemeToggle.css';

const ThemeToggle = ({ theme: propTheme, onToggle: propOnToggle }) => {
  const { settings, toggleTheme } = useAppContext();
  const isDark = propTheme ? propTheme === 'dark' : settings.theme === 'dark';
  const handleToggle = propOnToggle || toggleTheme;

  return (
    <button 
      className="theme-toggle"
      onClick={handleToggle}
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