import React, { useState, useEffect } from 'react';
import './AdminNotification.css';

const AdminNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
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

  return (
    <div className="admin-notification">
      <button 
        className="admin-notification-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        🔔
        {unreadCount > 0 && (
          <span className="admin-notification-badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="admin-notification-dropdown">
          <div className="admin-notification-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button 
                className="mark-all-read-button"
                onClick={markAllAsRead}
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="admin-notification-list">
            {loading ? (
              <div className="admin-notification-loading">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="admin-notification-empty">No notifications</div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id}
                  className={`admin-notification-item ${!notification.read ? 'unread' : ''}`}
                >
                  <div className="admin-notification-content">
                    <span className="admin-notification-type">
                      {notification.type === 'feedback' ? '💬' : '📢'}
                    </span>
                    <span className="admin-notification-message">
                      {notification.message}
                    </span>
                  </div>
                  <div className="admin-notification-actions">
                    {!notification.read && (
                      <button 
                        className="notification-action-button"
                        onClick={() => markAsRead(notification.id)}
                        title="Mark as read"
                      >
                        ✓
                      </button>
                    )}
                    <button 
                      className="notification-action-button delete"
                      onClick={() => deleteNotification(notification.id)}
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="admin-notification-time">
                    {new Date(notification.createdAt).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotification;
