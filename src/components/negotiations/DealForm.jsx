import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAppContext } from '../../context/AppContext';
import Modal from '../common/Modal';
import { Input, Select, Textarea } from '../common/Form';
import Button from '../common/Button';
import { DEAL_STAGES, DEAL_STAGE_LABELS, CURRENCIES } from '../../types/deals';
import './DealForm.css';

const DealForm = ({ deal, contactId, onClose, onSave, onDelete }) => {
  const { contacts } = useAppContext();
  const [form, setForm] = useState({
    name: '',
    contactId: '',
    company: '',
    stage: 'prospecting',
    value: '',
    currency: 'USD',
    probability: '20',
    expectedCloseDate: '',
    description: '',
    source: '',
    tags: '',
    nextSteps: '',
    competitors: ''
  });

  useEffect(() => {
    if (deal) {
      setForm({
        name: deal.name || '',
        contactId: deal.contactId || '',
        company: deal.company || '',
        stage: deal.stage || 'prospecting',
        value: deal.value || '',
        currency: deal.currency || 'USD',
        probability: deal.probability || '20',
        expectedCloseDate: deal.expectedCloseDate ? new Date(deal.expectedCloseDate).toISOString().slice(0, 16) : '',
        description: deal.description || '',
        source: deal.source || '',
        tags: (deal.tags || []).join(', '),
        nextSteps: (deal.nextSteps || []).map(step => step.action).join('\n'),
        competitors: (deal.competitors || []).map(comp => comp.name).join(', ')
      });
    } else {
      // Set default probability based on stage
      setForm(prev => ({
        ...prev,
        contactId: contactId || '',
        probability: '20'
      }));
    }
  }, [deal, contactId]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleStageChange = (newStage) => {
    setForm(prev => ({ ...prev, stage: newStage }));
    // Auto-adjust probability based on stage
    const stageProbabilities = {
      'prospecting': 20,
      'qualification': 40,
      'proposal': 60,
      'negotiation': 75,
      'closing': 90,
      'won': 100,
      'lost': 0
    };
    setForm(prev => ({ ...prev, probability: stageProbabilities[newStage] || 20 }));
  };

  const validate = () => {
    if (!form.name.trim()) {
      alert('Deal name is required');
      return false;
    }
    if (!form.contactId || form.contactId === '') {
      alert('Contact is required');
      return false;
    }
    if (form.value && parseFloat(form.value) < 0) {
      alert('Deal value must be positive');
      return false;
    }
    if (!form.probability || parseFloat(form.probability) < 0 || parseFloat(form.probability) > 100) {
      alert('Probability must be between 0 and 100');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    const dealData = {
      name: form.name,
      contactId: form.contactId || null,
      userId: form.userId || null,
      company: form.company || null,
      value: form.value ? parseFloat(form.value) : null,
      currency: form.currency || 'USD',
      probability: form.probability ? parseInt(form.probability) : 50,
      expectedCloseDate: form.expectedCloseDate ? new Date(form.expectedCloseDate).toISOString() : null,
      stage: form.stage || 'prospecting',
      source: form.source || null,
      tags: form.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      nextSteps: form.nextSteps.split('\n').map(step => step.trim()).filter(Boolean).map(action => ({
        id: Date.now().toString(36) + Math.random(),
        action,
        dueDate: null,
        assignee: '',
        completed: false
      })),
      competitors: form.competitors.split(',').map(comp => comp.trim()).filter(Boolean).map(name => ({
        name,
        strengths: '',
        weaknesses: '',
        offering: '',
        pricing: ''
      }))
    };

    // Only include id when editing
    if (deal) {
      dealData.id = deal.id;
    }

    await onSave(dealData);
  };

  const stageOptions = DEAL_STAGES.map(stage => ({ value: stage, label: DEAL_STAGE_LABELS[stage] }));
  const currencyOptions = CURRENCIES.map(currency => ({ value: currency, label: currency }));
  const contactOptions = [
    { value: '', label: 'Select a contact', disabled: true },
    ...contacts.map(c => ({ value: c.id, label: c.name }))
  ];

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={deal?.name ? 'Edit Deal' : 'New Deal'}
      size="medium"
    >
      <form onSubmit={handleSubmit} className="deal-form">
        <div className="deal-form-grid">
          <Input
            label="Deal Name *"
            value={form.name}
            onChange={(value) => handleChange('name', value)}
            placeholder="Software License Agreement"
            fullWidth
          />

          <Select
            label="Contact *"
            value={form.contactId}
            onChange={(value) => handleChange('contactId', value)}
            options={contactOptions}
            fullWidth
          />

          <Input
            label="Company"
            value={form.company}
            onChange={(value) => handleChange('company', value)}
            placeholder="Company name"
            fullWidth
          />

          <Select
            label="Stage"
            value={form.stage}
            onChange={handleStageChange}
            options={stageOptions}
            fullWidth
          />

          <div className="form-row">
            <Input
              label="Value *"
              type="number"
              value={form.value?.toString() || ''}
              onChange={(value) => handleChange('value', value ? parseFloat(value) : null)}
              placeholder="10000"
              fullWidth
            />
            <Select
              label="Currency"
              value={form.currency}
              onChange={(value) => handleChange('currency', value)}
              options={currencyOptions}
              fullWidth
            />
          </div>

          <Input
            label="Probability (%) *"
            type="number"
            min="0"
            max="100"
            value={form.probability?.toString() || ''}
            onChange={(value) => handleChange('probability', value ? parseInt(value) : null)}
            placeholder="20"
            fullWidth
          />

          <Input
            label="Expected Close Date"
            type="date"
            value={form.expectedCloseDate}
            onChange={(value) => handleChange('expectedCloseDate', value)}
            fullWidth
          />

          <Input
            label="Source"
            value={form.source}
            onChange={(value) => handleChange('source', value)}
            placeholder="LinkedIn, Referral, Cold Call"
            fullWidth
          />

          <Input
            label="Tags"
            value={form.tags}
            onChange={(value) => handleChange('tags', value)}
            placeholder="Enterprise, Q4, Priority (comma separated)"
            fullWidth
          />

          <Input
            label="Competitors"
            value={form.competitors}
            onChange={(value) => handleChange('competitors', value)}
            placeholder="Competitor A, Competitor B (comma separated)"
            fullWidth
          />

          <Textarea
            label="Next Steps"
            value={form.nextSteps}
            onChange={(value) => handleChange('nextSteps', value)}
            placeholder="Schedule demo&#10;Send proposal&#10;Follow up next week"
            rows={4}
            fullWidth
          />

          <Textarea
            label="Description"
            value={form.description}
            onChange={(value) => handleChange('description', value)}
            placeholder="Deal details and requirements..."
            rows={4}
            fullWidth
          />
        </div>

        <div className="deal-form-actions">
          {deal?.id && (
            <Button variant="danger" onClick={() => onDelete(deal.id)}>
              Delete Deal
            </Button>
          )}
          <div className="deal-form-actions-right">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {deal?.name ? 'Save Changes' : 'Create Deal'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

DealForm.propTypes = {
  deal: PropTypes.object,
  contactId: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func
};

export default DealForm;
