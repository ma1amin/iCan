import React from 'react';
import { useAppContext } from '../../context/AppContext';
import Card from '../common/Card';
import './ContactsView.css';

const ContactsView = () => {
  const { contacts } = useAppContext();

  return (
    <div className="contacts-view">
      {contacts.length === 0 ? (
        <Card padding="large" className="contacts-empty">
          <div className="empty-state">
            <h3>No contacts yet</h3>
            <p>Add your first contact to get started.</p>
          </div>
        </Card>
      ) : (
        <Card padding="medium">
          <div className="contacts-list">
            {contacts.map(contact => (
              <div key={contact.id} className="contact-item">
                <div className="contact-name">{contact.name}</div>
                <div className="contact-company">{contact.company || '—'}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ContactsView;
