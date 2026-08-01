import React from 'react';
import PropTypes from 'prop-types';
import { useAppContext } from '../../context/AppContext';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { COMPANY_SIZE_LABELS, INDUSTRY_LABELS } from '../../types/companies';
import './CompanyDetail.css';

const CompanyDetail = ({ company, onClose, onEdit, onDelete }) => {
  const { contacts, deals } = useAppContext();

  const companyContacts = contacts.filter(c => c.company === company.id);
  const companyDeals = deals.filter(d => d.company === company.id);
  const totalDealValue = companyDeals.reduce((sum, deal) => sum + deal.value, 0);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      onDelete(company.id);
      onClose();
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={company.name}
      size="large"
    >
      <div className="company-detail">
        {/* Company Information */}
        <div className="company-detail-section">
          <h3 className="company-detail-section-title">Company Information</h3>
          <div className="company-detail-grid">
            <div className="company-detail-item">
              <label>Industry</label>
              <div className="company-detail-value">{INDUSTRY_LABELS[company.industry]}</div>
            </div>
            <div className="company-detail-item">
              <label>Size</label>
              <div className="company-detail-value">{COMPANY_SIZE_LABELS[company.size]}</div>
            </div>
            <div className="company-detail-item">
              <label>Location</label>
              <div className="company-detail-value">{company.location || '—'}</div>
            </div>
            <div className="company-detail-item">
              <label>Website</label>
              <div className="company-detail-value">
                {company.website ? (
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="company-link">
                    {company.website}
                  </a>
                ) : '—'}
              </div>
            </div>
            <div className="company-detail-item">
              <label>Founded Year</label>
              <div className="company-detail-value">{company.foundedYear || '—'}</div>
            </div>
            <div className="company-detail-item">
              <label>Annual Revenue</label>
              <div className="company-detail-value">{company.revenue ? formatCurrency(company.revenue) : '—'}</div>
            </div>
            <div className="company-detail-item">
              <label>Employee Count</label>
              <div className="company-detail-value">{company.employeeCount || '—'}</div>
            </div>
            <div className="company-detail-item full-width">
              <label>Tags</label>
              <div className="company-detail-value">
                {company.tags && company.tags.length > 0 ? (
                  <div className="company-tags">
                    {company.tags.map((tag, index) => (
                      <span key={index} className="company-tag">{tag}</span>
                    ))}
                  </div>
                ) : '—'}
              </div>
            </div>
            {company.description && (
              <div className="company-detail-item full-width">
                <label>Description</label>
                <div className="company-detail-value company-description">{company.description}</div>
              </div>
            )}
            {company.notes && (
              <div className="company-detail-item full-width">
                <label>Notes</label>
                <div className="company-detail-value company-notes">{company.notes}</div>
              </div>
            )}
          </div>
        </div>

        {/* Company Stats */}
        <div className="company-detail-section">
          <h3 className="company-detail-section-title">Overview</h3>
          <div className="company-stats-grid">
            <div className="company-stat-card">
              <div className="stat-number">{companyContacts.length}</div>
              <div className="stat-label">Contacts</div>
            </div>
            <div className="company-stat-card">
              <div className="stat-number">{companyDeals.length}</div>
              <div className="stat-label">Deals</div>
            </div>
            <div className="company-stat-card">
              <div className="stat-number stat-value-green">{formatCurrency(totalDealValue)}</div>
              <div className="stat-label">Pipeline Value</div>
            </div>
          </div>
        </div>

        {/* Associated Contacts */}
        {companyContacts.length > 0 && (
          <div className="company-detail-section">
            <h3 className="company-detail-section-title">Contacts ({companyContacts.length})</h3>
            <div className="company-list">
              {companyContacts.map(contact => (
                <div key={contact.id} className="company-list-item">
                  <div className="list-item-name">{contact.name}</div>
                  <div className="list-item-meta">
                    {contact.email && <span>{contact.email}</span>}
                    {contact.stage && <span className="list-item-badge">{contact.stage}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Associated Deals */}
        {companyDeals.length > 0 && (
          <div className="company-detail-section">
            <h3 className="company-detail-section-title">Deals ({companyDeals.length})</h3>
            <div className="company-list">
              {companyDeals.map(deal => (
                <div key={deal.id} className="company-list-item">
                  <div className="list-item-name">{deal.name}</div>
                  <div className="list-item-meta">
                    <span className="list-item-value">{formatCurrency(deal.value)}</span>
                    <span className="list-item-badge">{deal.probability}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="company-detail-actions">
          <Button variant="danger" onClick={handleDelete}>
            Delete Company
          </Button>
          <Button variant="primary" onClick={onEdit}>
            Edit Company
          </Button>
        </div>
      </div>
    </Modal>
  );
};

CompanyDetail.propTypes = {
  company: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default CompanyDetail;
