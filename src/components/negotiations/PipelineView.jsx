import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
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

  const handleStageChange = async (dealId, newStage) => {
    const stageProbabilities = {
      'prospecting': 20,
      'qualification': 40,
      'proposal': 60,
      'negotiation': 75,
      'closing': 90,
      'won': 100,
      'lost': 0
    };
    const result = await onDealUpdate(dealId, { 
      stage: newStage,
      probability: stageProbabilities[newStage] || 50
    });
    if (!result.success) {
      alert(`Failed to update deal stage: ${result.error}`);
    }
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    // Dropped outside the board
    if (!destination) {
      return;
    }

    // Dropped in the same column
    if (destination.droppableId === source.droppableId) {
      return;
    }

    // Prevent moving "won" or "lost" deals to other columns
    const deal = deals.find(d => d.id === draggableId);
    if (deal && (deal.stage === 'won' || deal.stage === 'lost')) {
      return;
    }

    // Update deal stage to match the destination column
    const stageProbabilities = {
      'prospecting': 20,
      'qualification': 40,
      'proposal': 60,
      'negotiation': 75,
      'closing': 90,
      'won': 100,
      'lost': 0
    };
    const updateResult = await onDealUpdate(draggableId, { 
      stage: destination.droppableId,
      probability: stageProbabilities[destination.droppableId] || 50
    });
    if (!updateResult.success) {
      alert(`Failed to update deal stage: ${updateResult.error}`);
    }
  };

  const handleSaveDeal = async (dealData) => {
    const result = await onDealUpdate(dealData.id, dealData);
    if (result.success) {
      setIsFormOpen(false);
      setSelectedDeal(null);
    } else {
      alert(`Failed to save deal: ${result.error}`);
    }
  };

  const handleDeleteDeal = async (dealId) => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      const result = await onDealDelete(dealId);
      if (result.success) {
        setIsFormOpen(false);
        setSelectedDeal(null);
      } else {
        alert(`Failed to delete deal: ${result.error}`);
      }
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
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="pipeline-view">
        {DEAL_STAGES.map(stage => {
          const stageDeals = deals.filter(deal => deal.stage === stage);
          const stageTotal = getStageTotal(stage);
          return (
            <Droppable key={stage} droppableId={stage}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  key={stage}
                  className="pipeline-column"
                >
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
                      stageDeals.map((deal, index) => {
                        const contact = getContact(deal.contactId);
                        return (
                          <Draggable key={deal.id} draggableId={deal.id} index={index} isDragDisabled={deal.stage === 'won' || deal.stage === 'lost'}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="pipeline-deal-card"
                                onClick={() => handleDealClick(deal)}
                                style={{
                                  ...provided.draggableProps.style,
                                  opacity: snapshot.isDragging ? 0.8 : 1
                                }}
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
                                  {deal.stage !== 'won' && deal.stage !== 'lost' && (
                                    <select
                                      className="deal-stage-select"
                                      value={deal.stage}
                                      onClick={(e) => e.stopPropagation()}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        handleStageChange(deal.id, e.target.value);
                                      }}
                                    >
                                      {DEAL_STAGES.map(s => (
                                        <option key={s} value={s}>{DEAL_STAGE_LABELS[s]}</option>
                                      ))}
                                    </select>
                                  )}
                                  {(deal.stage === 'won' || deal.stage === 'lost') && (
                                    <div className={`deal-stage-completed ${deal.stage}`}>
                                      {DEAL_STAGE_LABELS[deal.stage]}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })
                    )}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
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
    </DragDropContext>
  );
};

PipelineView.propTypes = {
  deals: PropTypes.array.isRequired,
  onDealUpdate: PropTypes.func.isRequired,
  onDealDelete: PropTypes.func.isRequired
};

export default PipelineView;
