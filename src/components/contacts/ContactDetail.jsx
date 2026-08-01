import React from 'react';
import PropTypes from 'prop-types';
import { useAppContext } from '../../context/AppContext';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { SOURCE_META, STAGE_COLORS } from '../../types/contacts';
import './ContactDetail.css';

const ContactDetail = ({ contact, onClose, onEdit, onDelete }) => {
  const { appointments, interactions, tasks } = useAppContext();

  const contactAppointments = appointments.filter(a => a.contactId === contact.id);
  const contactInteractions = interactions.filter(i => i.contactId === contact.id);
  const contactTasks = tasks.filter(t => t.contactId === contact.id);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      onDelete(contact.id);
      onClose();
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '—';
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={contact.name}
      size="large"
    >
      <div className="contact-detail">
        {/* Contact Information */}
        <div className="contact-detail-section">
          <h3 className="contact-detail-section-title">Contact Information</h3>
          <div className="contact-detail-grid">
            <div className="contact-detail-item">
              <label>Email</label>
              <div className="contact-detail-value">{contact.email || '—'}</div>
            </div>
            <div className="contact-detail-item">
              <label>Phone</label>
              <div className="contact-detail-value">{contact.phone || '—'}</div>
            </div>
            <div className="contact-detail-item">
              <label>Company</label>
              <div className="contact-detail-value">{contact.company || '—'}</div>
            </div>
            <div className="contact-detail-item">
              <label>Location</label>
              <div className="contact-detail-value">{contact.location || '—'}</div>
            </div>
            <div className="contact-detail-item">
              <label>Industry</label>
              <div className="contact-detail-value">{contact.industry || '—'}</div>
            </div>
            <div className="contact-detail-item">
              <label>Stage</label>
              <div 
                className="contact-detail-badge"
                style={{ 
                  backgroundColor: STAGE_COLORS[contact.stage] + '22',
                  color: STAGE_COLORS[contact.stage]
                }}
              >
                {contact.stage}
              </div>
            </div>
            <div className="contact-detail-item">
              <label>Source</label>
              <div 
                className="contact-detail-badge"
                style={{ 
                  backgroundColor: (SOURCE_META[contact.source]?.color || '#8B92A8') + '22',
                  color: SOURCE_META[contact.source]?.color || '#8B92A8'
                }}
              >
                {SOURCE_META[contact.source]?.label || contact.source}
              </div>
            </div>
            <div className="contact-detail-item full-width">
              <label>Tags</label>
              <div className="contact-detail-value">
                {contact.tags && contact.tags.length > 0 ? (
                  <div className="contact-tags">
                    {contact.tags.map((tag, index) => (
                      <span key={index} className="contact-tag">{tag}</span>
                    ))}
                  </div>
                ) : '—'}
              </div>
            </div>
            {contact.notes && (
              <div className="contact-detail-item full-width">
                <label>Notes</label>
                <div className="contact-detail-value contact-notes">{contact.notes}</div>
              </div>
            )}
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="contact-detail-section">
          <h3 className="contact-detail-section-title">Activity Timeline</h3>
          
          {contactAppointments.length === 0 && contactInteractions.length === 0 && contactTasks.length === 0 ? (
            <div className="activity-empty">
              <p>No activity yet</p>
            </div>
          ) : (
            <div className="activity-timeline">
              {/* Appointments */}
              {contactAppointments.map(appointment => (
                <div key={appointment.id} className="activity-item appointment">
                  <div className="activity-icon">📅</div>
                  <div className="activity-content">
                    <div className="activity-title">{appointment.title}</div>
                    <div className="activity-meta">
                      <span className="activity-date">{formatDate(appointment.startTime)}</span>
                      <span className="activity-type">Appointment</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Interactions */}
              {contactInteractions.map(interaction => (
                <div key={interaction.id} className="activity-item interaction">
                  <div className="activity-icon">💬</div>
                  <div className="activity-content">
                    <div className="activity-title">{interaction.subject || interaction.type}</div>
                    <div className="activity-meta">
                      <span className="activity-date">{formatDate(interaction.timestamp)}</span>
                      <span className="activity-type">{interaction.type}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Tasks */}
              {contactTasks.map(task => (
                <div key={task.id} className="activity-item task">
                  <div className="activity-icon">{task.status === 'done' ? '✅' : '📋'}</div>
                  <div className="activity-content">
                    <div className="activity-title">{task.title}</div>
                    <div className="activity-meta">
                      <span className="activity-date">{task.dueDate ? formatDate(task.dueDate) : 'No due date'}</span>
                      <span className="activity-type">Task</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="contact-detail-actions">
          <Button variant="danger" onClick={handleDelete}>
            Delete Contact
          </Button>
          <Button variant="primary" onClick={onEdit}>
            Edit Contact
          </Button>
        </div>
      </div>
    </Modal>
  );
};

ContactDetail.propTypes = {
  contact: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default ContactDetail;
