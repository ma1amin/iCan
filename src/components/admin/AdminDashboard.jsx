import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const StatCard = ({ title, value, icon, color }) => (
  <div className="admin-stat-card">
    <div className="admin-stat-icon" style={{ color }}>
      {icon}
    </div>
    <div className="admin-stat-content">
      <div className="admin-stat-title">{title}</div>
      <div className="admin-stat-value">{value}</div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('ican-admin-token');
      const response = await fetch('http://localhost:3001/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      } else {
        setError('Failed to fetch statistics');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard-loading">
        <div className="loading-spinner">Loading statistics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard-error">
        {error}
      </div>
    );
  }

  const usersByPlan = stats?.usersByPlan || {};
  const feedbackByStatus = stats?.feedbackByStatus || {};
  const feedbackByPriority = stats?.feedbackByPriority || {};

  return (
    <div className="admin-dashboard">
      <h1 className="admin-dashboard-title">Dashboard Overview</h1>
      
      <div className="admin-stats-grid">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon="👥"
          color="#5B8DEF"
        />
        <StatCard
          title="Total Feedback"
          value={stats?.totalFeedback || 0}
          icon="💬"
          color="#34D399"
        />
        <StatCard
          title="Free Plan"
          value={usersByPlan.free || 0}
          icon="🆓"
          color="#8B92A8"
        />
        <StatCard
          title="Pro Plan"
          value={usersByPlan.pro || 0}
          icon="⭐"
          color="#F0B429"
        />
        <StatCard
          title="Enterprise Plan"
          value={usersByPlan.enterprise || 0}
          icon="🏢"
          color="#8B5CF6"
        />
        <StatCard
          title="Open Feedback"
          value={feedbackByStatus.open || 0}
          icon="📬"
          color="#34D399"
        />
      </div>

      <div className="admin-dashboard-sections">
        <div className="admin-dashboard-section">
          <h2 className="admin-section-title">Feedback Status</h2>
          <div className="admin-feedback-status">
            <div className="admin-status-item">
              <span className="admin-status-label">Open</span>
              <span className="admin-status-value">{feedbackByStatus.open || 0}</span>
            </div>
            <div className="admin-status-item">
              <span className="admin-status-label">In Progress</span>
              <span className="admin-status-value">{feedbackByStatus.in_progress || 0}</span>
            </div>
            <div className="admin-status-item">
              <span className="admin-status-label">Resolved</span>
              <span className="admin-status-value">{feedbackByStatus.resolved || 0}</span>
            </div>
            <div className="admin-status-item">
              <span className="admin-status-label">Closed</span>
              <span className="admin-status-value">{feedbackByStatus.closed || 0}</span>
            </div>
          </div>
        </div>

        <div className="admin-dashboard-section">
          <h2 className="admin-section-title">Feedback Priority</h2>
          <div className="admin-feedback-priority">
            <div className="admin-priority-item high">
              <span className="admin-priority-label">High</span>
              <span className="admin-priority-value">{feedbackByPriority.high || 0}</span>
            </div>
            <div className="admin-priority-item medium">
              <span className="admin-priority-label">Medium</span>
              <span className="admin-priority-value">{feedbackByPriority.medium || 0}</span>
            </div>
            <div className="admin-priority-item low">
              <span className="admin-priority-label">Low</span>
              <span className="admin-priority-value">{feedbackByPriority.low || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
