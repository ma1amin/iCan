import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuthContext } from '../../context/AdminAuthContext';
import AdminNotification from './AdminNotification';
import ThemeToggle from '../common/ThemeToggle';
import './AdminHeader.css';

// Hamburger menu icon component
const HamburgerIcon = ({ isOpen }) => (
  <div className={`hamburger-icon ${isOpen ? 'open' : ''}`}>
    <span className="hamburger-line"></span>
    <span className="hamburger-line"></span>
    <span className="hamburger-line"></span>
  </div>
);

const AdminHeader = ({ onMenuToggle }) => {
  const { admin, adminLogout } = useAdminAuthContext();
  const navigate = useNavigate();
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

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <button 
          className="admin-header-menu-toggle mobile-only"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <HamburgerIcon isOpen={false} />
        </button>
        <h1 className="admin-header-title">iCan Admin Dashboard</h1>
      </div>
      <div className="admin-header-right">
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
        <AdminNotification />
        <div className="admin-header-user">
          <span className="admin-header-username">{admin?.name}</span>
          <span className="admin-header-email">{admin?.email}</span>
        </div>
        <button 
          className="admin-header-logout"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
