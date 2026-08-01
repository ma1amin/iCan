import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import './Sidebar.css';

// Simple icon components as placeholders
const LayoutDashboard = () => <span>📊</span>;
const Users = () => <span>👥</span>;
const Calendar = () => <span>📅</span>;
const MessageSquare = () => <span>💬</span>;
const CheckSquare = () => <span>✅</span>;
const GitBranch = () => <span>🌿</span>;
const Building2 = () => <span>🏢</span>;
const X = () => <span>✕</span>;
const Menu = () => <span>☰</span>;

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'contacts', label: 'Contacts', icon: '👥' },
  { id: 'calendar', label: 'Calendar', icon: '📅' },
  { id: 'interactions', label: 'Interactions', icon: '💬' },
  { id: 'tasks', label: 'Tasks', icon: '✅' },
  { id: 'pipeline', label: 'Pipeline', icon: '🌿' },
  { id: 'companies', label: 'Companies', icon: '🏢' }
];

const Sidebar = () => {
  const { currentView, setCurrentView, contacts } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (viewId) => {
    setCurrentView(viewId);
    setIsOpen(false);
  };

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
            <div className="sidebar-brand">iCan</div>
            <div className="sidebar-tagline">Interact · Contact · Arrange · Negotiate</div>
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
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="sidebar-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
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
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
