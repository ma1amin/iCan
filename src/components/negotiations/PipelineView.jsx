import React from 'react';
import PropTypes from 'prop-types';
import { useAppContext } from '../../context/AppContext';
import { DEAL_STAGES, DEAL_STAGE_LABELS, DEAL_STAGE_COLORS } from '../../types/deals';
import DealForm from './DealForm';
import './PipelineView.css';

const PipelineView = ({ deals, onDealUpdate, onDealDelete }) => {
  const { contacts } = useAppContext();
  const [selectedDeal, setSelectedDeal] = React.useState(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  const handleDealClick = (deal) => {
    setSelectedDeal(deal);
    setIsFormOpen(true);
  };

  const handleStageChange = (dealId, newStage) => {
    const deal = deals.find(d => d.id === dealId);
    if (deal) {
      const stageProbabilities = {
        'prospecting': 20,
        'qualification': 40,
        'proposal': 60,
        'negotiation': 75,
        'closing': 90,
        'won': 100,
        'lost': 0
      };
      onDealUpdate(dealId, { 
        ...deal, 
        stage: newStage,
        probability: stageProbabilities[newStage] || deal.probability
      });
    }
  };

  const handleSaveDeal = (dealData) => {
    onDealUpdate(dealData.id, dealData);
    setIsFormOpen(false);
    setSelectedDeal(null);
  };

  const handleDeleteDeal = (dealId) => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      onDealDelete(dealId);
      setIsFormOpen(false);
      setSelectedDeal(null);
    }
  };

  const getContact = (contactId) => {
    return contacts.find(c => c.id === contactId);
  };

  const formatCurrency = (value, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isOverdue = (dateString) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  const getStageTotal = (stage) => {
    return deals
      .filter(deal => deal.stage === stage)
      .reduce((sum, deal) => sum + deal.value, 0);
  };

  return (
    <div className="pipeline-view">
      {DEAL_STAGES.map(stage => {
        const stageDeals = deals.filter(deal => deal.stage === stage);
        const stageTotal = getStageTotal(stage);
        return (
          <div key={stage} className="pipeline-column">
            <div 
              className="pipeline-column-header"
              style={{ 
                backgroundColor: DEAL_STAGE_COLORS[stage] + '22',
                color: DEAL_STAGE_COLORS[stage]
              }}
            >
              <h3 className="pipeline-column-title">{DEAL_STAGE_LABELS[stage]}</h3>
              <div className="pipeline-column-stats">
                <span className="pipeline-column-count">{stageDeals.length}</span>
                <span className="pipeline-column-total">{formatCurrency(stageTotal, 'USD')}</span>
              </div>
            </div>
            <div className="pipeline-column-deals">
              {stageDeals.length === 0 ? (
                <div className="pipeline-empty">
                  <span>No deals</span>
                </div>
              ) : (
                stageDeals.map(deal => {
                  const contact = getContact(deal.contactId);
                  return (
                    <div 
                      key={deal.id} 
                      className="pipeline-deal-card"
                      onClick={() => handleDealClick(deal)}
                    >
                      <div className="deal-card-header">
                        <h4 className="deal-card-title">{deal.name}</h4>
                        <div className="deal-card-value">
                          {formatCurrency(deal.value, deal.currency)}
                        </div>
                      </div>
                      {contact && (
                        <div className="deal-card-contact">{contact.name}</div>
                      )}
                      {deal.company && (
                        <div className="deal-card-company">{deal.company}</div>
                      )}
                      <div className="deal-card-meta">
                        <div className="deal-card-probability">
                          <span className="probability-label">Probability:</span>
                          <span className="probability-value">{deal.probability}%</span>
                        </div>
                        {deal.expectedCloseDate && (
                          <div 
                            className={`deal-card-close-date ${isOverdue(deal.expectedCloseDate) ? 'overdue' : ''}`}
                          >
                            {formatDate(deal.expectedCloseDate)}
                          </div>
                        )}
                      </div>
                      {deal.competitors && deal.competitors.length > 0 && (
                        <div className="deal-card-competitors">
                          <span className="competitors-label">Competitors:</span>
                          <span className="competitors-value">
                            {deal.competitors.slice(0, 2).map(c => c.name).join(', ')}
                            {deal.competitors.length > 2 && ` +${deal.competitors.length - 2}`}
                          </span>
                        </div>
                      )}
                      {deal.tags && deal.tags.length > 0 && (
                        <div className="deal-card-tags">
                          {deal.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="deal-tag">{tag}</span>
                          ))}
                          {deal.tags.length > 3 && (
                            <span className="deal-tag">+{deal.tags.length - 3}</span>
                          )}
                        </div>
                      )}
                      <div className="deal-card-actions">
                        <select
                          className="deal-stage-select"
                          value={deal.stage}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleStageChange(deal.id, e.target.value);
                          }}
                        >
                          {DEAL_STAGES.map(s => (
                            <option key={s} value={s}>{DEAL_STAGE_LABELS[s]}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}

      {isFormOpen && (
        <DealForm
          deal={selectedDeal}
          contactId={null}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedDeal(null);
          }}
          onSave={handleSaveDeal}
          onDelete={handleDeleteDeal}
        />
      )}
    </div>
  );
};

PipelineView.propTypes = {
  deals: PropTypes.array.isRequired,
  onDealUpdate: PropTypes.func.isRequired,
  onDealDelete: PropTypes.func.isRequired
};

export default PipelineView;
