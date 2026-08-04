import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import Card from '../common/Card';
import Button from '../common/Button';
import { Input, Select, Textarea } from '../common/Form';
import Modal from '../common/Modal';
import ContactForm from './ContactForm';
import ContactDetail from './ContactDetail';
import { SOURCE_META, STAGE_COLORS, CONTACT_SOURCES, CONTACT_STAGES, STAGE_LABELS } from '../../types/contacts';
import { parseCSV, exportContactsCSV, exportContactsJSON, validateContact } from '../../utils/importExport';
import './ContactsView.css';

const ContactsView = () => {
  const { contacts, addContact, updateContact, deleteContact } = useAppContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [stageFilter, setStageFilter] = useState('all');
  const [importText, setImportText] = useState('');
  const [importErrors, setImportErrors] = useState([]);

  const sourceOptions = [
    { value: 'all', label: 'All Sources' },
    ...CONTACT_SOURCES.map(source => ({
      value: source,
      label: SOURCE_META[source].label
    }))
  ];

  const stageOptions = [
    { value: 'all', label: 'All Stages' },
    ...CONTACT_STAGES.map(stage => ({ value: stage, label: STAGE_LABELS[stage] }))
  ];

  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = !query || 
        contact.name.toLowerCase().includes(query) ||
        (contact.companyName && contact.companyName.toLowerCase().includes(query)) ||
        (contact.email && contact.email.toLowerCase().includes(query)) ||
        (contact.phone && contact.phone.toLowerCase().includes(query));
      
      const matchesSource = sourceFilter === 'all' || contact.source === sourceFilter;
      const matchesStage = stageFilter === 'all' || contact.stage === stageFilter;
      
      return matchesSearch && matchesSource && matchesStage;
    });
  }, [contacts, searchQuery, sourceFilter, stageFilter]);

  const handleAddContact = () => {
    setSelectedContact(null);
    setIsFormOpen(true);
  };

  const handleEditContact = (contact) => {
    setSelectedContact(contact);
    setIsDetailOpen(false);
    setIsFormOpen(true);
  };

  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    setIsDetailOpen(true);
  };

  const handleSaveContact = async (contactData) => {
    console.log('handleSaveContact called with:', contactData);
    let result;
    if (selectedContact) {
      console.log('Updating existing contact:', selectedContact.id);
      result = await updateContact(selectedContact.id, contactData);
    } else {
      console.log('Creating new contact');
      result = await addContact(contactData);
    }
    
    console.log('Save result:', result);
    if (result.success) {
      setIsFormOpen(false);
      setSelectedContact(null);
    } else {
      alert(`Failed to save contact: ${result.error}`);
    }
  };

  const handleDeleteContact = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      const result = await deleteContact(id);
      if (!result.success) {
        alert(`Failed to delete contact: ${result.error}`);
      }
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedContact(null);
  };

  const handleDetailClose = () => {
    setIsDetailOpen(false);
    setSelectedContact(null);
  };

  const handleImportOpen = () => {
    setIsImportOpen(true);
    setImportText('');
    setImportErrors([]);
  };

  const handleImportClose = () => {
    setIsImportOpen(false);
    setImportText('');
    setImportErrors([]);
  };

  const handleImport = () => {
    try {
      const parsedContacts = parseCSV(importText);
      const validContacts = [];
      const errors = [];

      parsedContacts.forEach((contact, index) => {
        const validation = validateContact(contact);
        if (validation.isValid) {
          validContacts.push({
            ...contact,
            id: Date.now().toString(36) + index,
            createdAt: Date.now(),
            updatedAt: Date.now()
          });
        } else {
          errors.push({
            row: index + 1,
            name: contact.name,
            errors: validation.errors
          });
        }
      });

      if (errors.length > 0) {
        setImportErrors(errors);
        return;
      }

      if (validContacts.length === 0) {
        alert('No valid contacts found in the import data.');
        return;
      }

      // Add all valid contacts
      validContacts.forEach(contact => addContact(contact));
      
      setIsImportOpen(false);
      setImportText('');
      setImportErrors([]);
      alert(`Successfully imported ${validContacts.length} contact(s).`);
    } catch (error) {
      alert('Error parsing CSV data. Please check the format.');
      console.error('Import error:', error);
    }
  };

  const handleExportCSV = () => {
    if (contacts.length === 0) {
      alert('No contacts to export');
      return;
    }
    if (window.confirm(`Export ${contacts.length} contact(s) to CSV?`)) {
      exportContactsCSV(contacts);
    }
  };

  const handleExportJSON = () => {
    if (contacts.length === 0) {
      alert('No contacts to export');
      return;
    }
    if (window.confirm(`Export ${contacts.length} contact(s) to JSON?`)) {
      exportContactsJSON(contacts);
    }
  };

  return (
    <div className="contacts-view">
      <div className="contacts-header">
        <div className="contacts-stats">
          <span className="contacts-count">{contacts.length} contact{contacts.length !== 1 ? 's' : ''}</span>
          <span className="contacts-filtered">
            {filteredContacts.length !== contacts.length && `(${filteredContacts.length} shown)`}
          </span>
        </div>
        <div className="contacts-actions">
          <Button variant="ghost" onClick={handleImportOpen} icon="📥">
            Import
          </Button>
          <Button variant="ghost" onClick={handleExportCSV} icon="📤">
            Export CSV
          </Button>
          <Button variant="ghost" onClick={handleExportJSON} icon="📤">
            Export JSON
          </Button>
          <Button variant="primary" onClick={handleAddContact} icon="➕">
            Add Contact
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="contacts-filters">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={setSearchQuery}
            className="search-input"
          />
        </div>
        <Select
          value={sourceFilter}
          onChange={setSourceFilter}
          options={sourceOptions}
        />
        <Select
          value={stageFilter}
          onChange={setStageFilter}
          options={stageOptions}
        />
      </div>

      {filteredContacts.length === 0 ? (
        <Card padding="large" className="contacts-empty">
          <div className="empty-state">
            <h3>No contacts found</h3>
            <p>{contacts.length === 0 ? 'Add your first contact to get started.' : 'Try adjusting your search or filters.'}</p>
          </div>
        </Card>
      ) : (
        <Card padding="medium">
          <div className="contacts-list">
            {filteredContacts.map(contact => (
              <div 
                key={contact.id} 
                className="contact-item"
                onClick={() => handleViewContact(contact)}
              >
                <div className="contact-main">
                  <div className="contact-name">{contact.name}</div>
                  <div className="contact-company">{contact.companyName || '—'}</div>
                </div>
                <div className="contact-details">
                  <div className="contact-email">{contact.email || '—'}</div>
                  <div className="contact-phone">{contact.phone || '—'}</div>
                </div>
                <div className="contact-meta">
                  <div 
                    className="contact-source"
                    style={{ color: SOURCE_META[contact.source]?.color || '#8B92A8' }}
                  >
                    {SOURCE_META[contact.source]?.label || contact.source}
                  </div>
                  <div 
                    className="contact-stage"
                    style={{ 
                      backgroundColor: STAGE_COLORS[contact.stage] + '22',
                      color: STAGE_COLORS[contact.stage]
                    }}
                  >
                    {contact.stage}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {isFormOpen && (
        <ContactForm
          contact={selectedContact}
          onClose={handleFormClose}
          onSave={handleSaveContact}
          onDelete={handleDeleteContact}
        />
      )}

      {isDetailOpen && (
        <ContactDetail
          contact={selectedContact}
          onClose={handleDetailClose}
          onEdit={handleEditContact}
          onDelete={handleDeleteContact}
        />
      )}

      {isImportOpen && (
        <Modal
          isOpen={true}
          onClose={handleImportClose}
          title="Bulk Import Contacts"
          size="medium"
        >
          <div className="import-modal">
            <p className="import-instructions">
              Paste CSV data below. Format: Name, Phone, Email, Company, Location, Industry, Source, Stage, Tags, Notes
            </p>
            <Textarea
              value={importText}
              onChange={(value) => setImportText(value)}
              placeholder="John Doe, +1234567890, john@example.com, Tech Corp, San Francisco, Technology, LinkedIn, New, VIP, Senior developer..."
              rows={8}
              fullWidth
            />
            {importErrors.length > 0 && (
              <div className="import-errors">
                <h4>Import Errors:</h4>
                <ul>
                  {importErrors.map((error, index) => (
                    <li key={index}>
                      Row {error.row} ({error.name}): {Object.values(error.errors).join(', ')}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="import-actions">
              <Button variant="ghost" onClick={handleImportClose}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleImport}>
                Import {importText ? `${parseCSV(importText).length} contact(s)` : ''}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ContactsView;
