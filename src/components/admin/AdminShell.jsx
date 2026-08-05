import React from 'react';
import { useAdminAuthContext } from '../../context/AdminAuthContext';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import './AdminShell.css';

const AdminShell = ({ children }) => {
  const { admin } = useAdminAuthContext();

  return (
    <div className="admin-shell">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminShell;
