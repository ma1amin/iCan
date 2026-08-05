import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AdminSidebar.css';

const SimpleIcon = ({ icon }) => <span className="admin-nav-icon">{icon}</span>;

// Hamburger menu icon component
const HamburgerIcon = ({ isOpen }) => (
  <div className={`hamburger-icon ${isOpen ? 'open' : ''}`}>
    <span className="hamburger-line"></span>
    <span className="hamburger-line"></span>
    <span className="hamburger-line"></span>
  </div>
);

const ADMIN_NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/admin/dashboard' },
  { id: 'users', label: 'Users', icon: '👥', path: '/admin/users' },
  { id: 'feedback', label: 'Feedback', icon: '💬', path: '/admin/feedback' },
  { id: 'notifications', label: 'Notifications', icon: '🔔', path: '/admin/notifications' }
];

const AdminSidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const actualIsOpen = isOpen !== undefined ? isOpen : internalIsOpen;
  const actualOnToggle = onToggle || (() => setInternalIsOpen(!internalIsOpen));

  const getActiveView = () => {
    const path = location.pathname;
    if (path === '/admin/dashboard') return 'dashboard';
    if (path === '/admin/users') return 'users';
    if (path === '/admin/feedback') return 'feedback';
    if (path === '/admin/notifications') return 'notifications';
    return 'dashboard';
  };

  const activeView = getActiveView();

  const handleNavClick = () => {
    actualOnToggle();
  };

  return (
    <aside className={`admin-sidebar ${actualIsOpen ? 'open' : ''}`}>
      <div className="admin-sidebar-header">
        <h2 className="admin-sidebar-title">Admin Panel</h2>
        <button 
          className="admin-sidebar-toggle"
          onClick={actualOnToggle}
          aria-label={actualIsOpen ? 'Close menu' : 'Open menu'}
        >
          <HamburgerIcon isOpen={actualIsOpen} />
        </button>
      </div>

      <nav className="admin-sidebar-nav">
        {ADMIN_NAV_ITEMS.map(item => (
          <Link
            key={item.id}
            to={item.path}
            className={`admin-nav-item ${activeView === item.id ? 'active' : ''}`}
            onClick={handleNavClick}
          >
            <SimpleIcon icon={item.icon} />
            <span className="admin-nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <div className="admin-sidebar-brand">
          <span className="admin-sidebar-logo">iCan</span>
          <span className="admin-sidebar-version">v3.2.0</span>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
