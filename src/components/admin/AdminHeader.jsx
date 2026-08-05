import React from 'react';
import { useAdminAuthContext } from '../../context/AdminAuthContext';
import AdminNotification from './AdminNotification';
import './AdminHeader.css';

const AdminHeader = () => {
  const { admin, adminLogout } = useAdminAuthContext();

  const handleLogout = () => {
    adminLogout();
  };

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <h1 className="admin-header-title">iCan Admin Dashboard</h1>
      </div>
      <div className="admin-header-right">
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
