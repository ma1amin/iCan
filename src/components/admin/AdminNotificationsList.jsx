import React, { useState, useEffect } from 'react';
import './AdminNotificationsList.css';

const AdminNotificationsList = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('ican-admin-token');
      const response = await fetch('http://localhost:3001/api/admin/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('ican-admin-token');
      await fetch(`http://localhost:3001/api/admin/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('ican-admin-token');
      await fetch('http://localhost:3001/api/admin/notifications/read-all', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const token = localStorage.getItem('ican-admin-token');
      await fetch(`http://localhost:3001/api/admin/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchNotifications();
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  if (loading) {
    return (
      <div className="admin-notifications-loading">
        <div className="loading-spinner">Loading notifications...</div>
      </div>
    );
  }

  return (
    <div className="admin-notifications-list">
      <div className="admin-notifications-header">
        <h1>Notifications</h1>
        {unreadCount > 0 && (
          <button 
            className="mark-all-read-button"
            onClick={markAllAsRead}
          >
            Mark all as read ({unreadCount})
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="admin-notifications-empty">
          <p>No notifications</p>
        </div>
      ) : (
        <div className="admin-notifications-content">
          {notifications.map(notification => (
            <div 
              key={notification.id}
              className={`admin-notification-card ${!notification.read ? 'unread' : ''}`}
            >
              <div className="admin-notification-card-header">
                <div className="admin-notification-card-type">
                  {notification.type === 'feedback' ? '💬 Feedback' : '📢 System'}
                </div>
                <div className="admin-notification-card-actions">
                  {!notification.read && (
                    <button 
                      className="notification-card-action"
                      onClick={() => markAsRead(notification.id)}
                    >
                      Mark as read
                    </button>
                  )}
                  <button 
                    className="notification-card-action delete"
                    onClick={() => deleteNotification(notification.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="admin-notification-card-message">
                {notification.message}
              </div>
              <div className="admin-notification-card-time">
                {new Date(notification.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminNotificationsList;
