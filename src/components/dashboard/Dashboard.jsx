import React from 'react';
import { useAppContext } from '../../context/AppContext';
import Card from '../common/Card';
import './Dashboard.css';

const Dashboard = () => {
  const { contacts, appointments, tasks, deals } = useAppContext();

  const stats = {
    totalContacts: contacts.length,
    totalAppointments: appointments.length,
    totalTasks: tasks.length,
    totalDeals: deals.length,
    activeContacts: contacts.filter(c => c.stage !== 'Archived').length,
    pendingTasks: tasks.filter(t => t.status !== 'done').length,
    upcomingAppointments: appointments.filter(a => a.status === 'scheduled').length,
    activeDeals: deals.filter(d => !['won', 'lost'].includes(d.stage)).length
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Welcome to iCan</h2>
        <p className="dashboard-subtitle">Your networking command center</p>
      </div>

      <div className="dashboard-stats">
        <Card padding="medium">
          <div className="stat-card">
            <div className="stat-label">Total Contacts</div>
            <div className="stat-value">{stats.totalContacts}</div>
            <div className="stat-sub">{stats.activeContacts} active</div>
          </div>
        </Card>

        <Card padding="medium">
          <div className="stat-card">
            <div className="stat-label">Appointments</div>
            <div className="stat-value">{stats.totalAppointments}</div>
            <div className="stat-sub">{stats.upcomingAppointments} upcoming</div>
          </div>
        </Card>

        <Card padding="medium">
          <div className="stat-card">
            <div className="stat-label">Tasks</div>
            <div className="stat-value">{stats.totalTasks}</div>
            <div className="stat-sub">{stats.pendingTasks} pending</div>
          </div>
        </Card>

        <Card padding="medium">
          <div className="stat-card">
            <div className="stat-label">Active Deals</div>
            <div className="stat-value">{stats.activeDeals}</div>
            <div className="stat-sub">in pipeline</div>
          </div>
        </Card>
      </div>

      {stats.totalContacts === 0 && (
        <Card padding="large" className="dashboard-empty">
          <div className="empty-state">
            <h3>Get Started</h3>
            <p>Add your first contact to begin organizing your network.</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
