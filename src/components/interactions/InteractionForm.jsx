import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAppContext } from '../../context/AppContext';
import Modal from '../common/Modal';
import { Input, Select, Textarea } from '../common/Form';
import Button from '../common/Button';
import { INTERACTION_TYPES, INTERACTION_DIRECTIONS, INTERACTION_OUTCOMES, INTERACTION_TYPE_LABELS, INTERACTION_OUTCOME_LABELS } from '../../types/interactions';
import './InteractionForm.css';

const InteractionForm = ({ interaction, contactId, onClose, onSave, onDelete }) => {
  const { contacts, appointments } = useAppContext();
  const [form, setForm] = useState({
    contactId: '',
    type: 'call',
    direction: 'outbound',
    subject: '',
    content: '',
    timestamp: '',
    duration: '',
    outcome: 'completed',
    appointmentId: ''
  });

  useEffect(() => {
    if (interaction) {
      setForm({
        contactId: interaction.contactId || '',
        type: interaction.type || 'call',
        direction: interaction.direction || 'outbound',
        subject: interaction.subject || '',
        content: interaction.content || '',
        timestamp: interaction.timestamp ? new Date(interaction.timestamp).toISOString().slice(0, 16) : '',
        duration: interaction.duration || '',
        outcome: interaction.outcome || 'completed',
        appointmentId: interaction.appointmentId || ''
      });
    } else {
      // Set default timestamp to now
      const now = new Date();
      setForm(prev => ({
        ...prev,
        timestamp: now.toISOString().slice(0, 16),
        contactId: contactId || '',
        type: defaultType || 'call'
      }));
    }
  }, [interaction, contactId, defaultType]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    if (!form.contactId) {
      alert('Contact is required');
      return false;
    }
    if (!form.subject.trim()) {
      alert('Subject is required');
      return false;
    }
    if (!form.timestamp) {
      alert('Timestamp is required');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    const interactionData = {
      ...form,
      id: interaction?.id || Date.now().toString(36),
      duration: form.duration ? parseInt(form.duration) : null,
      timestamp: new Date(form.timestamp).toISOString(),
      createdAt: interaction?.createdAt || Date.now(),
      updatedAt: Date.now()
    };

    onSave(interactionData);
  };

  const typeOptions = INTERACTION_TYPES.map(type => ({ value: type, label: INTERACTION_TYPE_LABELS[type] }));
  const directionOptions = INTERACTION_DIRECTIONS.map(dir => ({ value: dir, label: dir.charAt(0).toUpperCase() + dir.slice(1) }));
  const outcomeOptions = INTERACTION_OUTCOMES.map(outcome => ({ value: outcome, label: INTERACTION_OUTCOME_LABELS[outcome] }));
  const contactOptions = contacts.map(c => ({ value: c.id, label: c.name }));
  const appointmentOptions = [
    { value: '', label: 'No Appointment' },
    ...appointments.map(a => ({ value: a.id, label: a.title }))
  ];

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={interaction?.subject ? 'Edit Interaction' : 'Log Interaction'}
      size="medium"
    >
      <form onSubmit={handleSubmit} className="interaction-form">
        <div className="interaction-form-grid">
          <Select
            label="Contact *"
            value={form.contactId}
            onChange={(value) => handleChange('contactId', value)}
            options={contactOptions}
            fullWidth
          />

          <Select
            label="Type"
            value={form.type}
            onChange={(value) => handleChange('type', value)}
            options={typeOptions}
            fullWidth
          />

          <Select
            label="Direction"
            value={form.direction}
            onChange={(value) => handleChange('direction', value)}
            options={directionOptions}
            fullWidth
          />

          <Input
            label="Subject *"
            value={form.subject}
            onChange={(value) => handleChange('subject', value)}
            placeholder="Call about partnership"
            fullWidth
          />

          <Input
            label="Date & Time *"
            type="datetime-local"
            value={form.timestamp}
            onChange={(value) => handleChange('timestamp', value)}
            fullWidth
          />

          <Input
            label="Duration (minutes)"
            type="number"
            value={form.duration}
            onChange={(value) => handleChange('duration', value)}
            placeholder="30"
            fullWidth
          />

          <Select
            label="Outcome"
            value={form.outcome}
            onChange={(value) => handleChange('outcome', value)}
            options={outcomeOptions}
            fullWidth
          />

          <Select
            label="Related Appointment"
            value={form.appointmentId}
            onChange={(value) => handleChange('appointmentId', value)}
            options={appointmentOptions}
            fullWidth
          />

          <Textarea
            label="Notes"
            value={form.content}
            onChange={(value) => handleChange('content', value)}
            placeholder="Details about the interaction..."
            rows={4}
            fullWidth
          />
        </div>

        <div className="interaction-form-actions">
          {interaction?.id && (
            <Button variant="danger" onClick={() => onDelete(interaction.id)}>
              Delete
            </Button>
          )}
          <div className="interaction-form-actions-right">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {interaction?.subject ? 'Save Changes' : 'Log Interaction'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

InteractionForm.propTypes = {
  interaction: PropTypes.object,
  contactId: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  defaultType: PropTypes.string
};

export default InteractionForm;
