import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import Card from '../common/Card';
import Button from '../common/Button';
import { Input, Select } from '../common/Form';
import InteractionForm from './InteractionForm';
import { INTERACTION_TYPES, INTERACTION_TYPE_LABELS, INTERACTION_TYPE_COLORS, INTERACTION_OUTCOME_LABELS } from '../../types/interactions';
import './InteractionsView.css';

const InteractionsView = () => {
  const { interactions, contacts, addInteraction, updateInteraction, deleteInteraction } = useAppContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedInteraction, setSelectedInteraction] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [contactFilter, setContactFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [outcomeFilter, setOutcomeFilter] = useState('all');

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    ...INTERACTION_TYPES.map(type => ({ value: type, label: INTERACTION_TYPE_LABELS[type] }))
  ];
  const contactOptions = [
    { value: 'all', label: 'All Contacts' },
    ...contacts.map(c => ({ value: c.id, label: c.name }))
  ];
  const outcomeOptions = [
    { value: 'all', label: 'All Outcomes' },
    ...['follow-up_required', 'awaiting_response', 'completed', 'no_response', 'not_interested'].map(outcome => ({ value: outcome, label: INTERACTION_OUTCOME_LABELS[outcome] }))
  ];

  const filteredInteractions = useMemo(() => {
    return interactions.filter(interaction => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = !query || 
        interaction.subject.toLowerCase().includes(query) ||
        (interaction.content && interaction.content.toLowerCase().includes(query));
      
      const matchesContact = contactFilter === 'all' || interaction.contactId === contactFilter;
      const matchesType = typeFilter === 'all' || interaction.type === typeFilter;
      const matchesOutcome = outcomeFilter === 'all' || interaction.outcome === outcomeFilter;
      
      return matchesSearch && matchesContact && matchesType && matchesOutcome;
    }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [interactions, searchQuery, contactFilter, typeFilter, outcomeFilter]);

  const handleSaveInteraction = (interactionData) => {
    if (selectedInteraction) {
      updateInteraction(selectedInteraction.id, interactionData);
    } else {
      addInteraction(interactionData);
    }
    setIsFormOpen(false);
    setSelectedInteraction(null);
  };

  const handleDeleteInteraction = (id) => {
    if (window.confirm('Are you sure you want to delete this interaction?')) {
      deleteInteraction(id);
      setIsFormOpen(false);
      setSelectedInteraction(null);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedInteraction(null);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getContact = (contactId) => {
    return contacts.find(c => c.id === contactId);
  };

  return (
    <div className="interactions-view">
      <div className="interactions-header">
        <div className="interactions-stats">
          <span className="interactions-count">{interactions.length} interaction{interactions.length !== 1 ? 's' : ''}</span>
          <span className="interactions-filtered">
            {filteredInteractions.length !== interactions.length && `(${filteredInteractions.length} shown)`}
          </span>
        </div>
        <Button variant="primary" onClick={() => {
          setSelectedInteraction(null);
          setIsFormOpen(true);
        }} icon="➕">
          Log Interaction
        </Button>
      </div>

      <div className="interactions-filters">
        <Input
          placeholder="Search interactions..."
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
          value={typeFilter}
          onChange={setTypeFilter}
          options={typeOptions}
        />
        <Select
          value={outcomeFilter}
          onChange={setOutcomeFilter}
          options={outcomeOptions}
        />
      </div>

      {filteredInteractions.length === 0 ? (
        <Card padding="large" className="interactions-empty">
          <div className="empty-state">
            <h3>No interactions found</h3>
            <p>{interactions.length === 0 ? 'Log your first interaction to get started.' : 'Try adjusting your search or filters.'}</p>
          </div>
        </Card>
      ) : (
        <Card padding="medium">
          <div className="interactions-timeline">
            {filteredInteractions.map(interaction => {
              const contact = getContact(interaction.contactId);
              return (
                <div key={interaction.id} className="interaction-item" onClick={() => {
                  setSelectedInteraction(interaction);
                  setIsFormOpen(true);
                }}>
                  <div 
                    className="interaction-icon"
                    style={{ backgroundColor: INTERACTION_TYPE_COLORS[interaction.type] + '22', color: INTERACTION_TYPE_COLORS[interaction.type] }}
                  >
                    {INTERACTION_TYPE_LABELS[interaction.type].charAt(0)}
                  </div>
                  <div className="interaction-content">
                    <div className="interaction-header">
                      <div className="interaction-subject">{interaction.subject}</div>
                      <div className="interaction-date">{formatDate(interaction.timestamp)}</div>
                    </div>
                    <div className="interaction-details">
                      {contact && (
                        <div className="interaction-contact">{contact.name}</div>
                      )}
                      <div className="interaction-type">{INTERACTION_TYPE_LABELS[interaction.type]}</div>
                      <div className="interaction-direction">{interaction.direction}</div>
                      <div 
                        className="interaction-outcome"
                        style={{ color: interaction.outcome === 'completed' ? '#34D399' : interaction.outcome === 'not_interested' ? '#E06166' : '#8B92A8' }}
                      >
                        {INTERACTION_OUTCOME_LABELS[interaction.outcome]}
                      </div>
                    </div>
                    {interaction.content && (
                      <div className="interaction-notes">{interaction.content}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {isFormOpen && (
        <InteractionForm
          interaction={selectedInteraction}
          contactId={null}
          onClose={handleFormClose}
          onSave={handleSaveInteraction}
          onDelete={handleDeleteInteraction}
        />
      )}
    </div>
  );
};

export default InteractionsView;
