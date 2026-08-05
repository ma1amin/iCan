import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../common/ThemeToggle';
import Footer from '../common/Footer';
import './AuthLayout.css';

const AuthLayout = ({ children, title, subtitle }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('ican-theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Sync theme with DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('ican-theme', newTheme);
  };

  return (
    <div className="auth-layout">
      {/* Header */}
      <header className="auth-header">
        <div className="auth-header-content">
          <Link to="/" className="auth-brand">
            <span className="auth-brand-name">iCan</span>
            <span className="auth-brand-tagline">Interact · Contact · Arrange · Negotiate</span>
          </Link>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      </header>

      {/* Main Content */}
      <main className="auth-main">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-card-header">
              <h1 className="auth-title">{title}</h1>
              {subtitle && <p className="auth-subtitle">{subtitle}</p>}
            </div>
            <div className="auth-card-body">
              {children}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AuthLayout;