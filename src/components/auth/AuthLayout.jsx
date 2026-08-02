import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../common/ThemeToggle';
import Footer from '../common/Footer';
import './AuthLayout.css';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="auth-layout">
      {/* Header */}
      <header className="auth-header">
        <div className="auth-header-content">
          <Link to="/" className="auth-brand">
            <span className="auth-brand-name">iCan</span>
            <span className="auth-brand-tagline">Interact · Contact · Arrange · Negotiate</span>
          </Link>
          <ThemeToggle />
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