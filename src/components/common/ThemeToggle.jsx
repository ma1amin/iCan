import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import './ThemeToggle.css';

const ThemeToggle = ({ theme: propTheme, onToggle: propOnToggle }) => {
  const [localTheme, setLocalTheme] = useState(() => {
    const savedTheme = localStorage.getItem('ican-theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const isDark = propTheme ? propTheme === 'dark' : localTheme === 'dark';
  const handleToggle = propOnToggle || (() => {
    const newTheme = localTheme === 'dark' ? 'light' : 'dark';
    setLocalTheme(newTheme);
    localStorage.setItem('ican-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  });

  // Sync with propTheme if provided
  useEffect(() => {
    if (propTheme) {
      setLocalTheme(propTheme);
    }
  }, [propTheme]);

  return (
    <button 
      className="theme-toggle"
      onClick={handleToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default ThemeToggle;