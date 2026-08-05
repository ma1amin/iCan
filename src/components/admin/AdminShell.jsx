import React, { useState } from 'react';
import { useAdminAuthContext } from '../../context/AdminAuthContext';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import './AdminShell.css';

const AdminShell = ({ children }) => {
  const { admin } = useAdminAuthContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="admin-shell">
      {/* Mobile backdrop */}
      <div 
        className={`admin-backdrop ${isSidebarOpen ? 'show' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      />
      
      <AdminSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="admin-main">
        <AdminHeader onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminShell;
