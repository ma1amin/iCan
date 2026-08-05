import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from '../common/Modal';
import { Input, Select, Textarea } from '../common/Form';
import Button from '../common/Button';
import { CONTACT_STAGES, CONTACT_SOURCES, SOURCE_META } from '../../types/contacts';
import { INDUSTRIES, INDUSTRY_LABELS } from '../../types/companies';
import './ContactForm.css';

const ContactForm = ({ contact, onClose, onSave, onDelete }) => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    companyName: '',
    location: '',
    industry: '',
    source: 'whatsapp',
    stage: 'new',
    tags: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (contact) {
      setForm({
        name: contact.name || '',
        phone: contact.phone || '',
        email: contact.email || '',
        companyName: contact.companyName || '',
        location: contact.location || '',
        industry: contact.industry || '',
        source: contact.source || 'whatsapp',
        stage: contact.stage || 'new',
        tags: (contact.tags || []).join(', '),
        notes: contact.notes || ''
      });
    }
  }, [contact]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name || !form.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (form.phone && !/^\+?[\d\s\-()]+$/.test(form.phone)) {
      newErrors.phone = 'Invalid phone format';
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    if (!isValid) {
      console.log('Validation errors:', newErrors);
    }
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    const contactData = {
      name: form.name,
      phone: form.phone || null,
      email: form.email || null,
      companyName: form.companyName || null,
      location: form.location || null,
      industry: form.industry || null,
      source: form.source || 'whatsapp',
      stage: form.stage || 'new',
      tags: form.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      notes: form.notes || ''
    };

    // Only include id when editing (for update operations)
    if (contact) {
      contactData.id = contact.id;
    }

    console.log('Submitting contact data:', contactData);
    await onSave(contactData);
  };

  const handleDelete = () => {
    if (contact?.id && window.confirm('Are you sure you want to delete this contact?')) {
      onDelete(contact.id);
      onClose();
    }
  };

  const stageOptions = CONTACT_STAGES.map(stage => ({ value: stage, label: stage.charAt(0).toUpperCase() + stage.slice(1) }));
  const sourceOptions = CONTACT_SOURCES.map(source => ({
    value: source,
    label: SOURCE_META[source].label
  }));
  const industryOptions = [
    { value: '', label: 'Select an industry' },
    ...INDUSTRIES.map(industry => ({ value: industry, label: INDUSTRY_LABELS[industry] }))
  ];

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={contact?.name ? 'Edit Contact' : 'New Contact'}
      size="medium"
    >
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="contact-form-grid">
          <Input
            label="Name *"
            value={form.name}
            onChange={(value) => handleChange('name', value)}
            placeholder="Full name"
            error={errors.name}
            required
          />

          <Input
            label="Phone"
            value={form.phone}
            onChange={(value) => handleChange('phone', value)}
            placeholder="+1 234 567 8900"
            error={errors.phone}
          />

          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(value) => handleChange('email', value)}
            placeholder="john@example.com"
            error={errors.email}
          />

          <Input
            label="Company"
            value={form.companyName}
            onChange={(value) => handleChange('companyName', value)}
            placeholder="Company name"
          />

          <Input
            label="Location"
            value={form.location}
            onChange={(value) => handleChange('location', value)}
            placeholder="City, Country"
          />

          <Select
            label="Industry"
            value={form.industry}
            onChange={(value) => handleChange('industry', value)}
            options={industryOptions}
          />

          <Select
            label="Source"
            value={form.source}
            onChange={(value) => handleChange('source', value)}
            options={sourceOptions}
          />

          <Select
            label="Stage"
            value={form.stage}
            onChange={(value) => handleChange('stage', value)}
            options={stageOptions}
          />

          <Input
            label="Tags"
            value={form.tags}
            onChange={(value) => handleChange('tags', value)}
            placeholder="VIP, Lead, Partner (comma separated)"
            className="full-width"
          />

          <Textarea
            label="Notes"
            value={form.notes}
            onChange={(value) => handleChange('notes', value)}
            placeholder="Additional information about this contact..."
            rows={4}
            className="full-width"
          />
        </div>

        <div className="contact-form-actions">
          {contact?.id && (
            <Button
              type="button"
              variant="danger"
              onClick={handleDelete}
            >
              Delete Contact
            </Button>
          )}
          <div className="contact-form-actions-right">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {contact?.id ? 'Save Changes' : 'Create Contact'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

ContactForm.propTypes = {
  contact: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func
};

export default ContactForm;
