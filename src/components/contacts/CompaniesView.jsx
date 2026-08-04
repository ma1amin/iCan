import React from 'react';
import Card from '../common/Card';
import './CompaniesView.css';

const CompaniesView = () => {
  return (
    <div className="companies-view">
      <Card padding="large" className="companies-disabled">
        <div className="empty-state">
          <h3>Company Management Disabled</h3>
          <p>Company management has been simplified. Companies are now entered directly in Contact and Deal forms as text fields.</p>
          <p>Use the Contacts page to manage contact information including company names.</p>
        </div>
      </Card>
    </div>
  );
};

export default CompaniesView;