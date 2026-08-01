import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import Card from '../common/Card';
import Button from '../common/Button';
import { Input, Select } from '../common/Form';
import CompanyForm from './CompanyForm';
import CompanyDetail from './CompanyDetail';
import { COMPANY_SIZES, INDUSTRIES, COMPANY_SIZE_LABELS, INDUSTRY_LABELS } from '../../types/companies';
import './CompaniesView.css';

const CompaniesView = () => {
  const { companies, contacts, deals, addCompany, updateCompany, deleteCompany } = useAppContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [sizeFilter, setSizeFilter] = useState('all');

  const sizeOptions = [
    { value: 'all', label: 'All Sizes' },
    ...COMPANY_SIZES.map(size => ({ value: size, label: COMPANY_SIZE_LABELS[size] }))
  ];
  const industryOptions = [
    { value: 'all', label: 'All Industries' },
    ...INDUSTRIES.map(industry => ({ value: industry, label: INDUSTRY_LABELS[industry] }))
  ];

  const filteredCompanies = useMemo(() => {
    return companies.filter(company => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = !query || 
        company.name.toLowerCase().includes(query) ||
        (company.description && company.description.toLowerCase().includes(query)) ||
        (company.location && company.location.toLowerCase().includes(query)) ||
        (company.tags && company.tags.some(tag => tag.toLowerCase().includes(query)));
      
      const matchesIndustry = industryFilter === 'all' || company.industry === industryFilter;
      const matchesSize = sizeFilter === 'all' || company.size === sizeFilter;
      
      return matchesSearch && matchesIndustry && matchesSize;
    });
  }, [companies, searchQuery, industryFilter, sizeFilter]);

  const handleSaveCompany = (companyData) => {
    if (selectedCompany) {
      updateCompany(selectedCompany.id, companyData);
    } else {
      addCompany(companyData);
    }
    setIsFormOpen(false);
    setSelectedCompany(null);
  };

  const handleDeleteCompany = (companyId) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      deleteCompany(companyId);
      setIsFormOpen(false);
      setSelectedCompany(null);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedCompany(null);
  };

  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
    setIsDetailOpen(true);
  };

  const getCompanyStats = (companyId) => {
    const companyContacts = contacts.filter(c => c.company === companyId);
    const companyDeals = deals.filter(d => d.company === companyId);
    const totalDealValue = companyDeals.reduce((sum, deal) => sum + deal.value, 0);
    
    return {
      contactCount: companyContacts.length,
      dealCount: companyDeals.length,
      totalDealValue
    };
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
    <div className="companies-view">
      <div className="companies-header">
        <div className="companies-stats">
          <span className="companies-count">{companies.length} compan{companies.length !== 1 ? 'ies' : 'y'}</span>
          <span className="companies-filtered">
            {filteredCompanies.length !== companies.length && `(${filteredCompanies.length} shown)`}
          </span>
        </div>
        <Button variant="primary" onClick={() => {
          setSelectedCompany(null);
          setIsFormOpen(true);
        }} icon="➕">
          New Company
        </Button>
      </div>

      <div className="companies-filters">
        <Input
          placeholder="Search companies..."
          value={searchQuery}
          onChange={setSearchQuery}
          icon="🔍"
        />
        <Select
          value={industryFilter}
          onChange={setIndustryFilter}
          options={industryOptions}
        />
        <Select
          value={sizeFilter}
          onChange={setSizeFilter}
          options={sizeOptions}
        />
      </div>

      {filteredCompanies.length === 0 ? (
        <Card padding="large" className="companies-empty">
          <div className="empty-state">
            <h3>No companies found</h3>
            <p>{companies.length === 0 ? 'Create your first company to get started.' : 'Try adjusting your search or filters.'}</p>
          </div>
        </Card>
      ) : (
        <div className="companies-grid">
          {filteredCompanies.map(company => {
            const stats = getCompanyStats(company.id);
            return (
              <Card key={company.id} padding="medium" className="company-card" onClick={() => handleCompanyClick(company)}>
                <div className="company-card-header">
                  <h3 className="company-card-name">{company.name}</h3>
                  <div className="company-card-industry">{INDUSTRY_LABELS[company.industry]}</div>
                </div>
                {company.location && (
                  <div className="company-card-location">{company.location}</div>
                )}
                <div className="company-card-meta">
                  <div className="company-card-stat">
                    <span className="stat-label">Size:</span>
                    <span className="stat-value">{COMPANY_SIZE_LABELS[company.size]}</span>
                  </div>
                  <div className="company-card-stat">
                    <span className="stat-label">Contacts:</span>
                    <span className="stat-value">{stats.contactCount}</span>
                  </div>
                  <div className="company-card-stat">
                    <span className="stat-label">Deals:</span>
                    <span className="stat-value">{stats.dealCount}</span>
                  </div>
                  {stats.totalDealValue > 0 && (
                    <div className="company-card-stat">
                      <span className="stat-label">Pipeline:</span>
                      <span className="stat-value stat-value-green">{formatCurrency(stats.totalDealValue)}</span>
                    </div>
                  )}
                </div>
                {company.tags && company.tags.length > 0 && (
                  <div className="company-card-tags">
                    {company.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="company-tag">{tag}</span>
                    ))}
                    {company.tags.length > 3 && (
                      <span className="company-tag">+{company.tags.length - 3}</span>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {isFormOpen && (
        <CompanyForm
          company={selectedCompany}
          onClose={handleFormClose}
          onSave={handleSaveCompany}
          onDelete={handleDeleteCompany}
        />
      )}

      {isDetailOpen && (
        <CompanyDetail
          company={selectedCompany}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedCompany(null);
          }}
          onEdit={() => {
            setIsDetailOpen(false);
            setIsFormOpen(true);
          }}
          onDelete={handleDeleteCompany}
        />
      )}
    </div>
  );
};

export default CompaniesView;
