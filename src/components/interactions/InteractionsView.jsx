import React from 'react';
import Card from '../common/Card';
import './InteractionsView.css';

const InteractionsView = () => {
  return (
    <div className="interactions-view">
      <Card padding="large">
        <div className="placeholder-content">
          <h3>Interactions</h3>
          <p>Interaction history and logging coming soon.</p>
        </div>
      </Card>
    </div>
  );
};

export default InteractionsView;
