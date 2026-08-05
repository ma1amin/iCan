import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { useAuthContext } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Calendar,
  MessageSquare,
  CheckSquare,
  GitBranch,
  Building2,
  User,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import './Sidebar.css';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'contacts', label: 'Contacts', icon: Users, path: '/contacts' },
  { id: 'calendar', label: 'Calendar', icon: Calendar, path: '/calendar' },
  { id: 'interactions', label: 'Interactions', icon: MessageSquare, path: '/interactions' },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare, path: '/tasks' },
  { id: 'pipeline', label: 'Pipeline', icon: GitBranch, path: '/pipeline' },
  { id: 'feedback', label: 'Feedback', icon: MessageSquare, path: '/feedback' },
  { id: 'profile', label: 'Profile', icon: User, path: '/profile' }
];

const Sidebar = ({ isOpen, onToggle, isCollapsed, onCollapse }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { contacts } = useAppContext();
  const { logout, user } = useAuthContext();
  const { setCurrentView } = useAppContext();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);
  const actualIsOpen = isOpen !== undefined ? isOpen : internalIsOpen;
  const actualOnToggle = onToggle || (() => setInternalIsOpen(!internalIsOpen));
  const actualIsCollapsed = isCollapsed !== undefined ? isCollapsed : internalIsCollapsed;
  const actualOnCollapse = onCollapse || (() => setInternalIsCollapsed(!internalIsCollapsed));

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
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${actualIsOpen ? 'open' : ''} ${actualIsCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div>
            <Link to="/dashboard" className="sidebar-brand-link">
              <div className="sidebar-brand">iCan</div>
              <div className="sidebar-tagline">Interact · Contact · Arrange · Negotiate</div>
            </Link>
          </div>
          <div className="sidebar-header-actions">
            <button 
              className="sidebar-collapse desktop-only"
              onClick={actualOnCollapse}
              aria-label={actualIsCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={actualIsCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {actualIsCollapsed ? <ChevronRight /> : <ChevronLeft />}
            </button>
            <button 
              className="sidebar-close mobile-only"
              onClick={actualOnToggle}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
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
                <item.icon className="sidebar-nav-icon" size={20} />
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
                <User size={20} />
              </button>
              <button 
                className="sidebar-user-action"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
