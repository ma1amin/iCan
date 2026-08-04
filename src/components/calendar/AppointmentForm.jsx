import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAppContext } from '../../context/AppContext';
import Modal from '../common/Modal';
import { Input, Select, Textarea } from '../common/Form';
import Button from '../common/Button';
import { APPOINTMENT_TYPES, APPOINTMENT_STATUS } from '../../types/appointments';
import './AppointmentForm.css';

const AppointmentForm = ({ appointment, contactId, onClose, onSave, onDelete }) => {
  const { contacts } = useAppContext();
  const [form, setForm] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    location: '',
    type: 'meeting',
    status: 'scheduled',
    recurrence: 'none',
    reminder: 'none',
    contactId: ''
  });

  useEffect(() => {
    if (appointment) {
      setForm({
        title: appointment.title || '',
        description: appointment.description || '',
        startTime: appointment.startTime ? new Date(appointment.startTime).toISOString().slice(0, 16) : '',
        endTime: appointment.endTime ? new Date(appointment.endTime).toISOString().slice(0, 16) : '',
        location: appointment.location || '',
        type: appointment.type || 'meeting',
        status: appointment.status || 'scheduled',
        recurrence: appointment.recurrence || 'none',
        reminder: appointment.reminder || 'none',
        contactId: appointment.contactId || ''
      });
    } else {
      // Set default start time to next hour
      const now = new Date();
      now.setHours(now.getHours() + 1, 0, 0, 0);
      const endTime = new Date(now);
      endTime.setHours(endTime.getHours() + 1);
      
      setForm(prev => ({
        ...prev,
        startTime: now.toISOString().slice(0, 16),
        endTime: endTime.toISOString().slice(0, 16),
        contactId: contactId || ''
      }));
    }
  }, [appointment, contactId]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    if (!form.title.trim()) {
      alert('Title is required');
      return false;
    }
    if (!form.startTime) {
      alert('Start time is required');
      return false;
    }
    if (!form.endTime) {
      alert('End time is required');
      return false;
    }
    if (new Date(form.endTime) <= new Date(form.startTime)) {
      alert('End time must be after start time');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    const appointmentData = {
      ...form,
      id: appointment?.id || Date.now().toString(36),
      contactId: contactId || appointment?.contactId || null,
      startTime: new Date(form.startTime).toISOString(),
      endTime: new Date(form.endTime).toISOString(),
      createdAt: appointment?.createdAt || Date.now(),
      updatedAt: Date.now()
    };

    await onSave(appointmentData);
  };

  const typeOptions = APPOINTMENT_TYPES.map(type => ({ value: type, label: type.charAt(0).toUpperCase() + type.slice(1) }));
  const statusOptions = APPOINTMENT_STATUS.map(status => ({ value: status, label: status.charAt(0).toUpperCase() + status.slice(1) }));
  const recurrenceOptions = [
    { value: 'none', label: 'No Recurrence' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];
  const reminderOptions = [
    { value: 'none', label: 'No Reminder' },
    { value: '15min', label: '15 minutes before' },
    { value: '1hour', label: '1 hour before' },
    { value: '1day', label: '1 day before' }
  ];
  const contactOptions = [
    { value: '', label: 'No Contact' },
    ...contacts.map(c => ({ value: c.id, label: c.name }))
  ];

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={appointment?.title ? 'Edit Appointment' : 'New Appointment'}
      size="medium"
    >
      <form onSubmit={handleSubmit} className="appointment-form">
        <div className="appointment-form-grid">
          <Input
            label="Title *"
            value={form.title}
            onChange={(value) => handleChange('title', value)}
            placeholder="Meeting with client"
            fullWidth
          />

          <div className="form-row">
            <Input
              label="Start Time *"
              type="datetime-local"
              value={form.startTime}
              onChange={(value) => handleChange('startTime', value)}
              fullWidth
            />
            <Input
              label="End Time *"
              type="datetime-local"
              value={form.endTime}
              onChange={(value) => handleChange('endTime', value)}
              fullWidth
            />
          </div>

          <Input
            label="Location"
            value={form.location}
            onChange={(value) => handleChange('location', value)}
            placeholder="Office, Zoom link, etc."
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
            label="Contact"
            value={form.contactId}
            onChange={(value) => handleChange('contactId', value)}
            options={contactOptions}
            fullWidth
          />

          <Select
            label="Status"
            value={form.status}
            onChange={(value) => handleChange('status', value)}
            options={statusOptions}
            fullWidth
          />

          <Select
            label="Recurrence"
            value={form.recurrence}
            onChange={(value) => handleChange('recurrence', value)}
            options={recurrenceOptions}
            fullWidth
          />

          <Select
            label="Reminder"
            value={form.reminder}
            onChange={(value) => handleChange('reminder', value)}
            options={reminderOptions}
            fullWidth
          />

          <Textarea
            label="Description"
            value={form.description}
            onChange={(value) => handleChange('description', value)}
            placeholder="Meeting agenda, notes, etc."
            rows={4}
            fullWidth
          />
        </div>

        <div className="appointment-form-actions">
          {appointment?.id && (
            <Button variant="danger" onClick={() => onDelete(appointment.id)}>
              Delete
            </Button>
          )}
          <div className="appointment-form-actions-right">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {appointment?.title ? 'Save Changes' : 'Create Appointment'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

AppointmentForm.propTypes = {
  appointment: PropTypes.object,
  contactId: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func
};

export default AppointmentForm;
