import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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

// Hamburger menu icon component
const HamburgerIcon = ({ isOpen }) => (
  <div className={`hamburger-icon ${isOpen ? 'open' : ''}`}>
    <span className="hamburger-line"></span>
    <span className="hamburger-line"></span>
    <span className="hamburger-line"></span>
  </div>
);

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard' },
  { id: 'contacts', label: 'Contacts', icon: '👥', path: '/contacts' },
  { id: 'calendar', label: 'Calendar', icon: '📅', path: '/calendar' },
  { id: 'interactions', label: 'Interactions', icon: '💬', path: '/interactions' },
  { id: 'tasks', label: 'Tasks', icon: '✅', path: '/tasks' },
  { id: 'pipeline', label: 'Pipeline', icon: '🌿', path: '/pipeline' },
  { id: 'feedback', label: 'Feedback', icon: '📝', path: '/feedback' },
  { id: 'profile', label: 'Profile', icon: '👤', path: '/profile' }
];

const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { contacts } = useAppContext();
  const { logout, user } = useAuthContext();
  const { setCurrentView } = useAppContext();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const actualIsOpen = isOpen !== undefined ? isOpen : internalIsOpen;
  const actualOnToggle = onToggle || (() => setInternalIsOpen(!internalIsOpen));

  const handleNavClick = (viewId, path) => {
    setCurrentView(viewId);
    actualOnToggle();
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    actualOnToggle();
  };

  const getActiveView = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'dashboard';
    if (path === '/contacts') return 'contacts';
    if (path === '/calendar') return 'calendar';
    if (path === '/interactions') return 'interactions';
    if (path === '/tasks') return 'tasks';
    if (path === '/pipeline') return 'pipeline';
    if (path === '/feedback') return 'feedback';
    if (path === '/companies') return 'companies';
    if (path === '/profile') return 'profile';
    return 'dashboard';
  };

  const currentView = getActiveView();

  return (
    <>
      {/* Mobile backdrop */}
      <div 
        className={`sidebar-backdrop ${actualIsOpen ? 'show' : ''}`}
        onClick={actualOnToggle}
      />
      
      {/* Mobile menu button */}
      <button 
        className="sidebar-toggle mobile-only"
        onClick={actualOnToggle}
        aria-label="Open menu"
      >
        <HamburgerIcon isOpen={false} />
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${actualIsOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div>
            <Link to="/dashboard" className="sidebar-brand-link">
              <div className="sidebar-brand">iCan</div>
              <div className="sidebar-tagline">Interact · Contact · Arrange · Negotiate</div>
            </Link>
          </div>
          <button 
            className="sidebar-close mobile-only"
            onClick={actualOnToggle}
            aria-label="Close menu"
          >
            <HamburgerIcon isOpen={true} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const isActive = currentView === item.id;
            
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => handleNavClick(item.id, item.path)}
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
          <div className="sidebar-user-section">
            <div className="sidebar-user-info">
              <div className="sidebar-user-avatar">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="sidebar-user-details">
                <div className="sidebar-user-name">{user?.name || 'User'}</div>
                <div className="sidebar-user-email">{user?.email || ''}</div>
              </div>
            </div>
            <div className="sidebar-user-actions">
              <button 
                className="sidebar-user-action"
                onClick={() => {
                  navigate('/profile');
                  actualOnToggle();
                }}
                title="Profile"
              >
                <span>👤</span>
              </button>
              <button 
                className="sidebar-user-action"
                onClick={handleLogout}
                title="Logout"
              >
                <span>🚪</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
