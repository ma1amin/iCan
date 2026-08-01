import React from 'react';
import Card from '../common/Card';
import './CalendarView.css';

const CalendarView = () => {
  return (
    <div className="calendar-view">
      <Card padding="large">
        <div className="placeholder-content">
          <h3>Calendar</h3>
          <p>Appointment scheduling and calendar management coming soon.</p>
        </div>
      </Card>
    </div>
  );
};

export default CalendarView;
