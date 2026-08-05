import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from '../common/Footer';
import './AppShell.css';

const AppShell = ({ children }) => {
  const { currentView } = useAppContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('ican-sidebar-collapsed') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('ican-sidebar-collapsed', isSidebarCollapsed);
  }, [isSidebarCollapsed]);

  return (
    <div className="app-shell">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isCollapsed={isSidebarCollapsed}
        onCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div className={`app-main ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Header onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="app-content">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AppShell;
