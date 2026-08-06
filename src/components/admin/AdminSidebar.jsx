import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, MessageSquare, Bell, Menu, X } from 'lucide-react';
import './AdminSidebar.css';

const ADMIN_NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { id: 'users', label: 'Users', icon: Users, path: '/admin/users' },
  { id: 'feedback', label: 'Feedback', icon: MessageSquare, path: '/admin/feedback' },
  { id: 'notifications', label: 'Notifications', icon: Bell, path: '/admin/notifications' }
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
          {actualIsOpen ? <X size={24} /> : <Menu size={24} />}
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
            <item.icon className="admin-nav-icon" size={20} />
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
