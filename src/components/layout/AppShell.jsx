import React from 'react';
import { useAppContext } from '../../context/AppContext';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from '../common/Footer';
import './AppShell.css';

const AppShell = ({ children }) => {
  const { currentView } = useAppContext();

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <Header />
        <main className="app-content">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AppShell;
