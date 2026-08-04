import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAppContext } from '../../context/AppContext';
import Modal from '../common/Modal';
import { Input, Select, Textarea } from '../common/Form';
import Button from '../common/Button';
import { TASK_STATUS, TASK_PRIORITY, TASK_CATEGORIES, TASK_STATUS_LABELS, TASK_PRIORITY_LABELS, TASK_CATEGORY_LABELS } from '../../types/tasks';
import './TaskForm.css';

const TaskForm = ({ task, contactId, onClose, onSave, onDelete }) => {
  const { contacts, appointments, interactions, deals } = useAppContext();
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
    reminder: 'none',
    estimatedTime: '',
    contactId: '',
    category: 'follow-up',
    tags: '',
    linkedAppointmentId: '',
    linkedInteractionId: '',
    linkedDealId: ''
  });

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '',
        reminder: task.reminder || 'none',
        estimatedTime: task.estimatedTime || '',
        contactId: task.contactId || '',
        category: task.category || 'follow-up',
        tags: (task.tags || []).join(', '),
        linkedAppointmentId: task.linkedItems?.appointments?.[0] || '',
        linkedInteractionId: task.linkedItems?.interactions?.[0] || '',
        linkedDealId: task.linkedItems?.deals?.[0] || ''
      });
    } else {
      // Set default due date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);
      
      setForm(prev => ({
        ...prev,
        dueDate: tomorrow.toISOString().slice(0, 16),
        contactId: contactId || ''
      }));
    }
  }, [task, contactId]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    if (!form.title.trim()) {
      alert('Title is required');
      return false;
    }
    if (form.dueDate && new Date(form.dueDate) < new Date()) {
      alert('Due date must be in the future');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    const taskData = {
      ...form,
      id: task?.id || Date.now().toString(36),
      tags: form.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
      estimatedTime: form.estimatedTime ? parseInt(form.estimatedTime) : null,
      linkedItems: {
        appointments: form.linkedAppointmentId ? [form.linkedAppointmentId] : [],
        interactions: form.linkedInteractionId ? [form.linkedInteractionId] : [],
        deals: form.linkedDealId ? [form.linkedDealId] : []
      },
      createdAt: task?.createdAt || Date.now(),
      updatedAt: Date.now(),
      completedAt: form.status === 'done' ? Date.now() : task?.completedAt || null
    };

    await onSave(taskData);
  };

  const statusOptions = TASK_STATUS.map(status => ({ value: status, label: TASK_STATUS_LABELS[status] }));
  const priorityOptions = TASK_PRIORITY.map(priority => ({ value: priority, label: TASK_PRIORITY_LABELS[priority] }));
  const categoryOptions = TASK_CATEGORIES.map(category => ({ value: category, label: TASK_CATEGORY_LABELS[category] }));
  const reminderOptions = [
    { value: 'none', label: 'No Reminder' },
    { value: '15min', label: '15 minutes before' },
    { value: '1hour', label: '1 hour before' },
    { value: '1day', label: '1 day before' },
    { value: '1week', label: '1 week before' }
  ];
  const contactOptions = [
    { value: '', label: 'No Contact' },
    ...contacts.map(c => ({ value: c.id, label: c.name }))
  ];
  const appointmentOptions = [
    { value: '', label: 'No Appointment' },
    ...appointments.map(a => ({ value: a.id, label: a.title }))
  ];
  const interactionOptions = [
    { value: '', label: 'No Interaction' },
    ...interactions.map(i => ({ value: i.id, label: i.subject }))
  ];
  const dealOptions = [
    { value: '', label: 'No Deal' },
    ...deals.map(d => ({ value: d.id, label: d.title }))
  ];

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={task?.title ? 'Edit Task' : 'New Task'}
      size="medium"
    >
      <form onSubmit={handleSubmit} className="task-form">
        <div className="task-form-grid">
          <Input
            label="Title *"
            value={form.title}
            onChange={(value) => handleChange('title', value)}
            placeholder="Task title"
            fullWidth
          />

          <div className="form-row">
            <Select
              label="Status"
              value={form.status}
              onChange={(value) => handleChange('status', value)}
              options={statusOptions}
              fullWidth
            />
            <Select
              label="Priority"
              value={form.priority}
              onChange={(value) => handleChange('priority', value)}
              options={priorityOptions}
              fullWidth
            />
          </div>

          <div className="form-row">
            <Input
              label="Due Date"
              type="datetime-local"
              value={form.dueDate}
              onChange={(value) => handleChange('dueDate', value)}
              fullWidth
            />
            <Select
              label="Reminder"
              value={form.reminder}
              onChange={(value) => handleChange('reminder', value)}
              options={reminderOptions}
              fullWidth
            />
          </div>

          <Input
            label="Estimated Time (minutes)"
            type="number"
            value={form.estimatedTime}
            onChange={(value) => handleChange('estimatedTime', value)}
            placeholder="30"
            fullWidth
          />

          <Select
            label="Category"
            value={form.category}
            onChange={(value) => handleChange('category', value)}
            options={categoryOptions}
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
            label="Related Appointment"
            value={form.linkedAppointmentId}
            onChange={(value) => handleChange('linkedAppointmentId', value)}
            options={appointmentOptions}
            fullWidth
          />

          <Select
            label="Related Interaction"
            value={form.linkedInteractionId}
            onChange={(value) => handleChange('linkedInteractionId', value)}
            options={interactionOptions}
            fullWidth
          />

          <Select
            label="Related Deal"
            value={form.linkedDealId}
            onChange={(value) => handleChange('linkedDealId', value)}
            options={dealOptions}
            fullWidth
          />

          <Input
            label="Tags"
            value={form.tags}
            onChange={(value) => handleChange('tags', value)}
            placeholder="Urgent, Important, Follow-up (comma separated)"
            fullWidth
          />

          <Textarea
            label="Description"
            value={form.description}
            onChange={(value) => handleChange('description', value)}
            placeholder="Task details and requirements..."
            rows={4}
            fullWidth
          />
        </div>

        <div className="task-form-actions">
          {task?.id && (
            <Button variant="danger" onClick={() => onDelete(task.id)}>
              Delete Task
            </Button>
          )}
          <div className="task-form-actions-right">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {task?.title ? 'Save Changes' : 'Create Task'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

TaskForm.propTypes = {
  task: PropTypes.object,
  contactId: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func
};

export default TaskForm;
