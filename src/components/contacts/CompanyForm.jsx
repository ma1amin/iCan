import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAppContext } from '../../context/AppContext';
import Modal from '../common/Modal';
import { Input, Select, Textarea } from '../common/Form';
import Button from '../common/Button';
import { COMPANY_SIZES, INDUSTRIES, COMPANY_SIZE_LABELS, INDUSTRY_LABELS } from '../../types/companies';
import './CompanyForm.css';

const CompanyForm = ({ company, onClose, onSave, onDelete }) => {
  const [form, setForm] = useState({
    name: '',
    industry: 'technology',
    size: 'small',
    website: '',
    location: '',
    description: '',
    notes: '',
    foundedYear: '',
    revenue: '',
    employeeCount: '',
    tags: ''
  });

  useEffect(() => {
    if (company) {
      setForm({
        name: company.name || '',
        industry: company.industry || 'technology',
        size: company.size || 'small',
        website: company.website || '',
        location: company.location || '',
        description: company.description || '',
        notes: company.notes || '',
        foundedYear: company.foundedYear || '',
        revenue: company.revenue || '',
        employeeCount: company.employeeCount || '',
        tags: (company.tags || []).join(', ')
      });
    }
  }, [company]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    if (!form.name.trim()) {
      alert('Company name is required');
      return false;
    }
    if (!form.industry) {
      alert('Industry is required');
      return false;
    }
    if (!form.size) {
      alert('Company size is required');
      return false;
    }
    if (form.website && !form.website.startsWith('http')) {
      alert('Website must start with http:// or https://');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    const companyData = {
      ...form,
      foundedYear: form.foundedYear ? parseInt(form.foundedYear) : null,
      revenue: form.revenue ? parseFloat(form.revenue) : null,
      employeeCount: form.employeeCount ? parseInt(form.employeeCount) : null,
      tags: form.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    // Only include id when editing
    if (company) {
      companyData.id = company.id;
    }

    await onSave(companyData);
  };

  const sizeOptions = COMPANY_SIZES.map(size => ({ value: size, label: COMPANY_SIZE_LABELS[size] }));
  const industryOptions = INDUSTRIES.map(industry => ({ value: industry, label: INDUSTRY_LABELS[industry] }));

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={company?.name ? 'Edit Company' : 'New Company'}
      size="medium"
    >
      <form onSubmit={handleSubmit} className="company-form">
        <div className="company-form-grid">
          <Input
            label="Company Name *"
            value={form.name}
            onChange={(value) => handleChange('name', value)}
            placeholder="Acme Corporation"
            fullWidth
          />

          <Select
            label="Industry *"
            value={form.industry}
            onChange={(value) => handleChange('industry', value)}
            options={industryOptions}
            fullWidth
          />

          <Select
            label="Company Size *"
            value={form.size}
            onChange={(value) => handleChange('size', value)}
            options={sizeOptions}
            fullWidth
          />

          <Input
            label="Website"
            value={form.website}
            onChange={(value) => handleChange('website', value)}
            placeholder="https://example.com"
            fullWidth
          />

          <Input
            label="Location"
            value={form.location}
            onChange={(value) => handleChange('location', value)}
            placeholder="San Francisco, CA"
            fullWidth
          />

          <Input
            label="Founded Year"
            type="number"
            value={form.foundedYear}
            onChange={(value) => handleChange('foundedYear', value)}
            placeholder="2010"
            fullWidth
          />

          <Input
            label="Annual Revenue ($)"
            type="number"
            value={form.revenue}
            onChange={(value) => handleChange('revenue', value)}
            placeholder="1000000"
            fullWidth
          />

          <Input
            label="Employee Count"
            type="number"
            value={form.employeeCount}
            onChange={(value) => handleChange('employeeCount', value)}
            placeholder="50"
            fullWidth
          />

          <Input
            label="Tags"
            value={form.tags}
            onChange={(value) => handleChange('tags', value)}
            placeholder="Enterprise, B2B, SaaS (comma separated)"
            fullWidth
          />

          <Textarea
            label="Description"
            value={form.description}
            onChange={(value) => handleChange('description', value)}
            placeholder="Company overview and mission..."
            rows={4}
            fullWidth
          />

          <Textarea
            label="Notes"
            value={form.notes}
            onChange={(value) => handleChange('notes', value)}
            placeholder="Additional information about the company..."
            rows={3}
            fullWidth
          />
        </div>

        <div className="company-form-actions">
          {company?.id && (
            <Button variant="danger" onClick={() => onDelete(company.id)}>
              Delete Company
            </Button>
          )}
          <div className="company-form-actions-right">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {company?.name ? 'Save Changes' : 'Create Company'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

CompanyForm.propTypes = {
  company: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func
};

export default CompanyForm;
