import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import Card from '../common/Card';
import Button from '../common/Button';
import { Input, Select } from '../common/Form';
import AppointmentForm from './AppointmentForm';
import { APPOINTMENT_TYPES } from '../../types/appointments';
import './CalendarView.css';

const CalendarView = () => {
  const { appointments, contacts, addAppointment, updateAppointment, deleteAppointment } = useAppContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); // month, week, day
  const [selectedDate, setSelectedDate] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAppointmentsModal, setShowAppointmentsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [contactFilter, setContactFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const handleSaveAppointment = (appointmentData) => {
    if (selectedAppointment) {
      updateAppointment(selectedAppointment.id, appointmentData);
    } else {
      addAppointment(appointmentData);
    }
    setIsFormOpen(false);
    setSelectedAppointment(null);
  };

  const handleDeleteAppointment = (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      deleteAppointment(id);
      setIsFormOpen(false);
      setSelectedAppointment(null);
    }
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    ...APPOINTMENT_TYPES.map(type => ({ value: type, label: type.charAt(0).toUpperCase() + type.slice(1) }))
  ];
  const contactOptions = [
    { value: 'all', label: 'All Contacts' },
    ...contacts.map(c => ({ value: c.id, label: c.name }))
  ];

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Navigate to previous/next month
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentMonth + direction);
    setCurrentDate(newDate);
  };

  // Navigate to previous/next week
  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  // Navigate to previous/next day
  const navigateDay = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + direction);
    setCurrentDate(newDate);
  };

  // Get appointments for a specific date
  const getAppointmentsForDate = (date) => {
    const dateStr = date.toDateString();
    return appointments.filter(apt => {
      const aptDate = new Date(apt.startTime);
      const matchesDate = aptDate.toDateString() === dateStr;
      
      // Apply filters
      const matchesSearch = !searchQuery || 
        apt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (apt.description && apt.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesContact = contactFilter === 'all' || apt.contactId === contactFilter;
      const matchesType = typeFilter === 'all' || apt.type === typeFilter;
      
      return matchesDate && matchesSearch && matchesContact && matchesType;
    }).sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  };

  // Month view calendar
  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];

    // Empty cells for days before first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dayAppointments = getAppointmentsForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

      days.push(
        <div
          key={day}
          className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => {
            setSelectedDate(date);
            if (dayAppointments.length > 0) {
              setShowAppointmentsModal(true);
            } else {
              setIsFormOpen(true);
              setSelectedAppointment(null);
            }
          }}
        >
          <div className="calendar-day-number">{day}</div>
          <div className="calendar-day-appointments">
            {dayAppointments.slice(0, 3).map(apt => (
              <div key={apt.id} className="calendar-appointment-dot" title={apt.title}></div>
            ))}
            {dayAppointments.length > 3 && (
              <div className="calendar-appointment-more">+{dayAppointments.length - 3}</div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  // Week view calendar
  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dayAppointments = getAppointmentsForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

      days.push(
        <div
          key={i}
          className={`calendar-day-week ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => {
            setSelectedDate(date);
            setIsFormOpen(true);
            setSelectedAppointment(null);
          }}
        >
          <div className="calendar-day-header">
            <div className="calendar-day-name">{dayNames[date.getDay()]}</div>
            <div className="calendar-day-number">{date.getDate()}</div>
          </div>
          <div className="calendar-day-appointments-list">
            {dayAppointments.map(apt => {
              const contact = contacts.find(c => c.id === apt.contactId);
              return (
                <div key={apt.id} className="calendar-appointment-item" onClick={(e) => {
                  e.stopPropagation();
                  setSelectedAppointment(apt);
                  setIsFormOpen(true);
                }}>
                  <div className="calendar-appointment-time">
                    {new Date(apt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="calendar-appointment-title">{apt.title}</div>
                  {contact && (
                    <div className="calendar-appointment-contact">{contact.name}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return days;
  };

  // Day view calendar
  const renderDayView = () => {
    const dayAppointments = getAppointmentsForDate(currentDate);
    const isToday = currentDate.toDateString() === new Date().toDateString();

    return (
      <div className="calendar-day-view">
        <div className={`calendar-day-header-large ${isToday ? 'today' : ''}`}>
          <div className="calendar-day-name-large">{dayNames[currentDate.getDay()]}</div>
          <div className="calendar-day-number-large">{currentDate.getDate()}</div>
          <div className="calendar-month-year">{monthNames[currentMonth]} {currentYear}</div>
        </div>
        <div className="calendar-day-appointments-list-large">
          {dayAppointments.length === 0 ? (
            <div className="calendar-no-appointments">No appointments</div>
          ) : (
            dayAppointments.map(apt => {
              const contact = contacts.find(c => c.id === apt.contactId);
              return (
                <div key={apt.id} className="calendar-appointment-item-large" onClick={() => {
                  setSelectedAppointment(apt);
                  setIsFormOpen(true);
                }}>
                  <div className="appointment-time">
                    {new Date(apt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="appointment-info">
                    <div className="appointment-title">{apt.title}</div>
                    {contact && (
                      <div className="appointment-contact">{contact.name}</div>
                    )}
                    {apt.location && (
                      <div className="appointment-location">{apt.location}</div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedAppointment(null);
  };

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <div className="calendar-nav">
          <Button variant="ghost" onClick={() => {
            if (view === 'month') navigateMonth(-1);
            else if (view === 'week') navigateWeek(-1);
            else navigateDay(-1);
          }} icon="◀">
            Previous
          </Button>
          <h2 className="calendar-title">
            {view === 'month' && `${monthNames[currentMonth]} ${currentYear}`}
            {view === 'week' && `Week of ${new Date(currentDate).toLocaleDateString()}`}
            {view === 'day' && `${dayNames[currentDate.getDay()]}, ${monthNames[currentMonth]} ${currentDate.getDate()}, ${currentYear}`}
          </h2>
          <Button variant="ghost" onClick={() => {
            if (view === 'month') navigateMonth(1);
            else if (view === 'week') navigateWeek(1);
            else navigateDay(1);
          }} icon="▶">
            Next
          </Button>
        </div>
        <div className="calendar-controls">
          <div className="calendar-filters">
            <Input
              placeholder="Search appointments..."
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
          </div>
          <div className="calendar-actions">
            <div className="calendar-view-toggle">
              <Button
                variant={view === 'month' ? 'primary' : 'ghost'}
                onClick={() => setView('month')}
                size="small"
              >
                Month
              </Button>
              <Button
                variant={view === 'week' ? 'primary' : 'ghost'}
                onClick={() => setView('week')}
                size="small"
              >
                Week
              </Button>
              <Button
                variant={view === 'day' ? 'primary' : 'ghost'}
                onClick={() => setView('day')}
                size="small"
              >
                Day
              </Button>
            </div>
            <Button variant="primary" onClick={() => {
              setSelectedDate(new Date());
              setIsFormOpen(true);
              setSelectedAppointment(null);
            }} icon="➕">
              New Appointment
            </Button>
          </div>
        </div>
      </div>

      <Card padding="medium">
        <div className="calendar-grid">
          {view === 'month' && (
            <>
              <div className="calendar-weekdays">
                {dayNames.map(day => (
                  <div key={day} className="calendar-weekday">{day}</div>
                ))}
              </div>
              <div className="calendar-days">
                {renderMonthView()}
              </div>
            </>
          )}
          {view === 'week' && (
            <div className="calendar-week-grid">
              {renderWeekView()}
            </div>
          )}
          {view === 'day' && renderDayView()}
        </div>
      </Card>

      {isFormOpen && (
        <AppointmentForm
          appointment={selectedAppointment}
          contactId={selectedDate ? null : null}
          onClose={handleFormClose}
          onSave={handleSaveAppointment}
          onDelete={handleDeleteAppointment}
        />
      )}

      {showAppointmentsModal && selectedDate && (
        <Modal
          isOpen={true}
          onClose={() => setShowAppointmentsModal(false)}
          title={`${selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`}
          size="medium"
        >
          <div className="day-appointments-modal">
            {getAppointmentsForDate(selectedDate).length === 0 ? (
              <div className="no-appointments">
                <p>No appointments on this day</p>
                <Button variant="primary" onClick={() => {
                  setShowAppointmentsModal(false);
                  setIsFormOpen(true);
                  setSelectedAppointment(null);
                }}>
                  Add Appointment
                </Button>
              </div>
            ) : (
              <div className="appointments-list">
                {getAppointmentsForDate(selectedDate).map(apt => {
                  const contact = contacts.find(c => c.id === apt.contactId);
                  return (
                    <div key={apt.id} className="appointment-detail-item">
                      <div className="appointment-detail-time">
                        {new Date(apt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {' - '}
                        {new Date(apt.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="appointment-detail-title">{apt.title}</div>
                      {apt.description && (
                        <div className="appointment-detail-description">{apt.description}</div>
                      )}
                      <div className="appointment-detail-meta">
                        {contact && <span className="appointment-detail-contact">{contact.name}</span>}
                        <span className="appointment-detail-type">{apt.type}</span>
                        <span className="appointment-detail-location">{apt.location || 'No location'}</span>
                      </div>
                      <div className="appointment-detail-actions">
                        <Button variant="ghost" size="small" onClick={() => {
                          setShowAppointmentsModal(false);
                          setSelectedAppointment(apt);
                          setIsFormOpen(true);
                        }}>
                          Edit
                        </Button>
                        <Button variant="danger" size="small" onClick={() => {
                          if (window.confirm('Are you sure you want to delete this appointment?')) {
                            deleteAppointment(apt.id);
                            setShowAppointmentsModal(false);
                          }
                        }}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  );
                })}
                <div className="appointments-modal-footer">
                  <Button variant="primary" onClick={() => {
                    setShowAppointmentsModal(false);
                    setIsFormOpen(true);
                    setSelectedAppointment(null);
                  }}>
                    Add New Appointment
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CalendarView;
