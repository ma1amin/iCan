import React from 'react';
import Card from '../common/Card';
import './CompaniesView.css';

const CompaniesView = () => {
  return (
    <div className="companies-view">
      <Card padding="large">
        <div className="placeholder-content">
          <h3>Companies</h3>
          <p>Company organization and management coming soon.</p>
        </div>
      </Card>
    </div>
  );
};

export default CompaniesView;
