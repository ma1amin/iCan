import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import Card from '../common/Card';
import Button from '../common/Button';
import { Input, Select } from '../common/Form';
import DealForm from './DealForm';
import PipelineView from './PipelineView';
import { DEAL_STAGES, DEAL_STAGE_LABELS, CURRENCIES } from '../../types/deals';
import './DealsView.css';

const DealsView = () => {
  const { deals, contacts, addDeal, updateDeal, deleteDeal } = useAppContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [contactFilter, setContactFilter] = useState('all');
  const [stageFilter, setStageFilter] = useState('all');
  const [currencyFilter, setCurrencyFilter] = useState('all');

  const stageOptions = [
    { value: 'all', label: 'All Stages' },
    ...DEAL_STAGES.map(stage => ({ value: stage, label: DEAL_STAGE_LABELS[stage] }))
  ];
  const currencyOptions = [
    { value: 'all', label: 'All Currencies' },
    ...CURRENCIES.map(currency => ({ value: currency, label: currency }))
  ];
  const contactOptions = [
    { value: 'all', label: 'All Contacts' },
    ...contacts.map(c => ({ value: c.id, label: c.name }))
  ];

  const filteredDeals = useMemo(() => {
    return deals.filter(deal => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = !query || 
        deal.name.toLowerCase().includes(query) ||
        (deal.description && deal.description.toLowerCase().includes(query)) ||
        (deal.company && deal.company.toLowerCase().includes(query)) ||
        (deal.tags && deal.tags.some(tag => tag.toLowerCase().includes(query)));
      
      const matchesContact = contactFilter === 'all' || deal.contactId === contactFilter;
      const matchesStage = stageFilter === 'all' || deal.stage === stageFilter;
      const matchesCurrency = currencyFilter === 'all' || deal.currency === currencyFilter;
      
      return matchesSearch && matchesContact && matchesStage && matchesCurrency;
    });
  }, [deals, searchQuery, contactFilter, stageFilter, currencyFilter]);

  const handleSaveDeal = async (dealData) => {
    let result;
    if (selectedDeal) {
      result = await updateDeal(selectedDeal.id, dealData);
    } else {
      result = await addDeal(dealData);
    }
    
    if (result.success) {
      setIsFormOpen(false);
      setSelectedDeal(null);
    } else {
      alert(`Failed to save deal: ${result.error}`);
    }
  };

  const handleDeleteDeal = async (dealId) => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      const result = await deleteDeal(dealId);
      if (result.success) {
        setIsFormOpen(false);
        setSelectedDeal(null);
      } else {
        alert(`Failed to delete deal: ${result.error}`);
      }
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedDeal(null);
  };

  const getDealStats = () => {
    const total = deals.length;
    const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
    const won = deals.filter(d => d.stage === 'won');
    const wonValue = won.reduce((sum, deal) => sum + deal.value, 0);
    const avgProbability = deals.length > 0 
      ? Math.round(deals.reduce((sum, deal) => sum + deal.probability, 0) / deals.length)
      : 0;
    
    return { total, totalValue, won, wonValue, avgProbability };
  };

  const stats = getDealStats();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="deals-view">
      <div className="deals-header">
        <div className="deals-stats">
          <div className="stat-item">
            <span className="stat-label">Total Deals</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Pipeline Value</span>
            <span className="stat-value stat-value-green">{formatCurrency(stats.totalValue)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Won Deals</span>
            <span className="stat-value stat-won">{stats.won.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Won Value</span>
            <span className="stat-value stat-won">{formatCurrency(stats.wonValue)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Avg Probability</span>
            <span className="stat-value">{stats.avgProbability}%</span>
          </div>
        </div>
        <Button variant="primary" onClick={() => {
          setSelectedDeal(null);
          setIsFormOpen(true);
        }} icon="➕">
          New Deal
        </Button>
      </div>

      <div className="deals-filters">
        <Input
          placeholder="Search deals..."
          value={searchQuery}
          onChange={setSearchQuery}
          icon="🔍"
        />
        <Select
          value={contactFilter}
          onChange={setContactFilter}
          options={contactOptions}
        />
        <Select
          value={stageFilter}
          onChange={setStageFilter}
          options={stageOptions}
        />
        <Select
          value={currencyFilter}
          onChange={setCurrencyFilter}
          options={currencyOptions}
        />
      </div>

      {filteredDeals.length === 0 ? (
        <Card padding="large" className="deals-empty">
          <div className="empty-state">
            <h3>No deals found</h3>
            <p>{deals.length === 0 ? 'Create your first deal to get started.' : 'Try adjusting your search or filters.'}</p>
          </div>
        </Card>
      ) : (
        <PipelineView
          deals={filteredDeals}
          onDealUpdate={updateDeal}
          onDealDelete={deleteDeal}
        />
      )}

      {isFormOpen && (
        <DealForm
          deal={selectedDeal}
          contactId={null}
          onClose={handleFormClose}
          onSave={handleSaveDeal}
          onDelete={handleDeleteDeal}
        />
      )}
    </div>
  );
};

export default DealsView;
