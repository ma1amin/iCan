import React, { useState, useEffect } from 'react';
import { getPriorityLabel, getPriorityColor, getStatusLabel } from '../../types/feedback';
import './AdminFeedbackManagement.css';

const AdminFeedbackManagement = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: ''
  });
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchFeedback();
  }, [page, filters]);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('ican-admin-token');
      const searchParams = new URLSearchParams({
        page,
        limit: 20,
        ...(filters.status && { status: filters.status }),
        ...(filters.priority && { priority: filters.priority })
      });

      const response = await fetch(`http://localhost:3001/api/admin/feedback?${searchParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFeedback(data.feedback);
        setPagination(data.pagination);
      } else {
        setError('Failed to fetch feedback');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleViewFeedback = (item) => {
    setSelectedFeedback(item);
  };

  const handleCloseDetail = () => {
    setSelectedFeedback(null);
  };

  const handleReply = async () => {
    const reply = prompt('Enter your reply:');
    if (!reply) return;

    try {
      const token = localStorage.getItem('ican-admin-token');
      const response = await fetch(`http://localhost:3001/api/admin/feedback/${selectedFeedback.id}/reply`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reply })
      });

      if (response.ok) {
        fetchFeedback();
        setSelectedFeedback(null);
      } else {
        alert('Failed to reply to feedback');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      const token = localStorage.getItem('ican-admin-token');
      const response = await fetch(`http://localhost:3001/api/admin/feedback/${selectedFeedback.id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchFeedback();
        setSelectedFeedback(null);
      } else {
        alert('Failed to update feedback status');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) {
      return;
    }

    try {
      const token = localStorage.getItem('ican-admin-token');
      const response = await fetch(`http://localhost:3001/api/admin/feedback/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchFeedback();
      } else {
        alert('Failed to delete feedback');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  if (loading) {
    return (
      <div className="admin-feedback-loading">
        <div className="loading-spinner">Loading feedback...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-feedback-error">
        {error}
      </div>
    );
  }

  return (
    <div className="admin-feedback-management">
      <div className="admin-feedback-header">
        <h1>Feedback Management</h1>
        <div className="admin-feedback-filters">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
            <option value="archived">Archived</option>
          </select>
          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            className="filter-select"
          >
            <option value="">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div className="admin-feedback-content">
        {feedback.length === 0 ? (
          <div className="admin-feedback-empty">
            <p>No feedback found</p>
          </div>
        ) : (
          <div className="admin-feedback-list">
            {feedback.map(item => (
              <div 
                key={item.id} 
                className="admin-feedback-item"
                onClick={() => handleViewFeedback(item)}
              >
                <div className="admin-feedback-item-header">
                  <h3 className="admin-feedback-item-subject">{item.subject}</h3>
                  <div className="admin-feedback-item-badges">
                    <span 
                      className="admin-feedback-item-priority"
                      style={{ color: getPriorityColor(item.priority) }}
                    >
                      {getPriorityLabel(item.priority)}
                    </span>
                    <span className="admin-feedback-item-status">
                      {getStatusLabel(item.status)}
                    </span>
                  </div>
                </div>
                <div className="admin-feedback-item-meta">
                  <span className="admin-feedback-item-category">{item.category}</span>
                  <span className="admin-feedback-item-rating">
                    Rating: {'★'.repeat(item.rating)}
                  </span>
                  <span className="admin-feedback-item-user">
                    {item.user.name} ({item.user.email})
                  </span>
                  <span className="admin-feedback-item-org">
                    {item.tenant.name}
                  </span>
                </div>
                <div className="admin-feedback-item-date">
                  {new Date(item.createdAt).toLocaleString()}
                </div>
                {item.adminReply && (
                  <div className="admin-feedback-item-reply">
                    <strong>Admin Reply:</strong> {item.adminReply}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-button"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="pagination-info">
              Page {page} of {pagination.totalPages}
            </span>
            <button
              className="pagination-button"
              onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {selectedFeedback && (
        <div className="admin-feedback-detail-modal" onClick={handleCloseDetail}>
          <div className="admin-feedback-detail-content" onClick={(e) => e.stopPropagation()}>
            <div className="admin-feedback-detail-header">
              <h2>{selectedFeedback.subject}</h2>
              <button className="admin-feedback-detail-close" onClick={handleCloseDetail}>
                ✕
              </button>
            </div>
            <div className="admin-feedback-detail-body">
              <div className="admin-feedback-detail-meta">
                <span className="admin-feedback-detail-category">{selectedFeedback.category}</span>
                <span 
                  className="admin-feedback-detail-priority"
                  style={{ color: getPriorityColor(selectedFeedback.priority) }}
                >
                  {getPriorityLabel(selectedFeedback.priority)}
                </span>
                <span className="admin-feedback-detail-status">
                  {getStatusLabel(selectedFeedback.status)}
                </span>
                <span className="admin-feedback-detail-rating">
                  Rating: {'★'.repeat(selectedFeedback.rating)}
                </span>
              </div>
              <div className="admin-feedback-detail-user">
                <strong>From:</strong> {selectedFeedback.user.name} ({selectedFeedback.user.email})
                <br />
                <strong>Organization:</strong> {selectedFeedback.tenant.name}
              </div>
              <div className="admin-feedback-detail-content-text">
                <strong>Feedback:</strong>
                <p>{selectedFeedback.content}</p>
              </div>
              {selectedFeedback.adminReply ? (
                <div className="admin-feedback-detail-reply">
                  <strong>Admin Reply:</strong>
                  <p>{selectedFeedback.adminReply}</p>
                  <small>Replied: {new Date(selectedFeedback.replyDate).toLocaleString()}</small>
                </div>
              ) : (
                <button className="admin-feedback-reply-button" onClick={handleReply}>
                  Reply to Feedback
                </button>
              )}
              <div className="admin-feedback-detail-actions">
                <div className="admin-feedback-status-actions">
                  <strong>Update Status:</strong>
                  <button onClick={() => handleUpdateStatus('open')}>Open</button>
                  <button onClick={() => handleUpdateStatus('in_progress')}>In Progress</button>
                  <button onClick={() => handleUpdateStatus('resolved')}>Resolved</button>
                  <button onClick={() => handleUpdateStatus('closed')}>Closed</button>
                  <button onClick={() => handleUpdateStatus('archived')}>Archived</button>
                </div>
                <button 
                  className="admin-feedback-delete-button"
                  onClick={() => handleDelete(selectedFeedback.id)}
                >
                  Delete Feedback
                </button>
              </div>
              <div className="admin-feedback-detail-date">
                Submitted: {new Date(selectedFeedback.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFeedbackManagement;
