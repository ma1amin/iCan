import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import FeedbackForm from './FeedbackForm';
import { feedbackAPI } from '../../lib/api';
import { getPriorityLabel, getPriorityColor, getStatusLabel } from '../../types/feedback';
import './FeedbackList.css';

const FeedbackList = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const data = await feedbackAPI.getAll();
      setFeedback(data.feedback);
    } catch (err) {
      setError(err.message || 'Failed to fetch feedback');
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

  if (loading) {
    return (
      <div className="feedback-list-loading">
        <div className="loading-spinner">Loading feedback...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feedback-list-error">
        {error}
      </div>
    );
  }

  return (
    <div className="feedback-list">
      <div className="feedback-list-header">
        <h1>My Feedback</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          + New Feedback
        </Button>
      </div>

      {feedback.length === 0 ? (
        <div className="feedback-list-empty">
          <p>No feedback submitted yet</p>
          <Button onClick={() => setIsFormOpen(true)}>
            Submit Your First Feedback
          </Button>
        </div>
      ) : (
        <div className="feedback-list-content">
          {feedback.map(item => (
            <div 
              key={item.id} 
              className="feedback-item"
              onClick={() => handleViewFeedback(item)}
            >
              <div className="feedback-item-header">
                <h3 className="feedback-item-subject">{item.subject}</h3>
                <span 
                  className="feedback-item-priority"
                  style={{ color: getPriorityColor(item.priority) }}
                >
                  {getPriorityLabel(item.priority)}
                </span>
              </div>
              <div className="feedback-item-meta">
                <span className="feedback-item-category">{item.category}</span>
                <span className="feedback-item-status">{getStatusLabel(item.status)}</span>
                <span className="feedback-item-rating">
                  {'★'.repeat(item.rating)}
                </span>
              </div>
              <div className="feedback-item-date">
                {new Date(item.createdAt).toLocaleDateString()}
              </div>
              {item.adminReply && (
                <div className="feedback-item-reply">
                  <strong>Admin Reply:</strong> {item.adminReply}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedFeedback && (
        <div className="feedback-detail-modal" onClick={handleCloseDetail}>
          <div className="feedback-detail-content" onClick={(e) => e.stopPropagation()}>
            <div className="feedback-detail-header">
              <h2>{selectedFeedback.subject}</h2>
              <button className="feedback-detail-close" onClick={handleCloseDetail}>
                ✕
              </button>
            </div>
            <div className="feedback-detail-body">
              <div className="feedback-detail-meta">
                <span className="feedback-detail-category">{selectedFeedback.category}</span>
                <span 
                  className="feedback-detail-priority"
                  style={{ color: getPriorityColor(selectedFeedback.priority) }}
                >
                  {getPriorityLabel(selectedFeedback.priority)}
                </span>
                <span className="feedback-detail-status">
                  {getStatusLabel(selectedFeedback.status)}
                </span>
                <span className="feedback-detail-rating">
                  Rating: {'★'.repeat(selectedFeedback.rating)}
                </span>
              </div>
              <div className="feedback-detail-content-text">
                <strong>Feedback:</strong>
                <p>{selectedFeedback.content}</p>
              </div>
              {selectedFeedback.adminReply && (
                <div className="feedback-detail-reply">
                  <strong>Admin Reply:</strong>
                  <p>{selectedFeedback.adminReply}</p>
                  <small>Replied: {new Date(selectedFeedback.replyDate).toLocaleDateString()}</small>
                </div>
              )}
              <div className="feedback-detail-date">
                Submitted: {new Date(selectedFeedback.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {isFormOpen && (
        <div className="feedback-form-modal">
          <div className="feedback-form-modal-content">
            <FeedbackForm
              onSubmit={async (data) => {
                try {
                  await feedbackAPI.submit(data);
                  setIsFormOpen(false);
                  fetchFeedback();
                } catch (err) {
                  alert('Failed to submit feedback: ' + err.message);
                }
              }}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackList;
