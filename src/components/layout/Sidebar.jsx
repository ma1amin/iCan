import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { useAuthContext } from '../../context/AuthContext';
import './Sidebar.css';

// Simple icon components as placeholders
const LayoutDashboard = () => <span>📊</span>;
const Users = () => <span>👥</span>;
const Calendar = () => <span>📅</span>;
const MessageSquare = () => <span>💬</span>;
const CheckSquare = () => <span>✅</span>;
const GitBranch = () => <span>🌿</span>;
const Building2 = () => <span>🏢</span>;
const User = () => <span>👤</span>;
const X = () => <span>✕</span>;
const Menu = () => <span>☰</span>;
const LogOut = () => <span>🚪</span>;

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard' },
  { id: 'contacts', label: 'Contacts', icon: '👥', path: '/contacts' },
  { id: 'calendar', label: 'Calendar', icon: '📅', path: '/calendar' },
  { id: 'interactions', label: 'Interactions', icon: '💬', path: '/interactions' },
  { id: 'tasks', label: 'Tasks', icon: '✅', path: '/tasks' },
  { id: 'pipeline', label: 'Pipeline', icon: '🌿', path: '/pipeline' },
  { id: 'companies', label: 'Companies', icon: '🏢', path: '/companies' },
  { id: 'profile', label: 'Profile', icon: '👤', path: '/profile' }
];

const Sidebar = () => {
  const location = useLocation();
  const { contacts } = useAppContext();
  const { logout } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const getActiveView = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'dashboard';
    if (path === '/contacts') return 'contacts';
    if (path === '/calendar') return 'calendar';
    if (path === '/interactions') return 'interactions';
    if (path === '/tasks') return 'tasks';
    if (path === '/pipeline') return 'pipeline';
    if (path === '/companies') return 'companies';
    if (path === '/profile') return 'profile';
    return 'dashboard';
  };

  const currentView = getActiveView();

  return (
    <>
      {/* Mobile backdrop */}
      <div 
        className={`sidebar-backdrop ${isOpen ? 'show' : ''}`}
        onClick={() => setIsOpen(false)}
      />
      
      {/* Mobile menu button */}
      <button 
        className="sidebar-toggle mobile-only"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
      >
        <span className="sidebar-toggle-icon">☰</span>
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div>
            <Link to="/dashboard" className="sidebar-brand-link">
              <div className="sidebar-brand">iCan</div>
              <div className="sidebar-tagline">Interact · Contact · Arrange · Negotiate</div>
            </Link>
          </div>
          <button 
            className="sidebar-close mobile-only"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            <span className="sidebar-close-icon">✕</span>
          </button>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const isActive = currentView === item.id;
            
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={handleNavClick}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="sidebar-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-stats">
            <div className="sidebar-stat">
              <span className="sidebar-stat-value">{contacts.length}</span>
              <span className="sidebar-stat-label">Contacts</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="sidebar-logout"
            aria-label="Logout"
          >
            <span className="sidebar-logout-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
