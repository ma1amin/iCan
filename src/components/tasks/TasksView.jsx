import React from 'react';
import Card from '../common/Card';
import './TasksView.css';

const TasksView = () => {
  return (
    <div className="tasks-view">
      <Card padding="large">
        <div className="placeholder-content">
          <h3>Tasks</h3>
          <p>Task management and tracking coming soon.</p>
        </div>
      </Card>
    </div>
  );
};

export default TasksView;
