import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from '../common/Footer';
import './AppShell.css';

const AppShell = ({ children }) => {
  const { currentView } = useAppContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="app-main">
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
