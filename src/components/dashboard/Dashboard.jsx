import React from 'react';
import { useAppContext } from '../../context/AppContext';
import Card from '../common/Card';
import ScrollReveal from '../common/ScrollReveal';
import AnimatedCounter from '../common/AnimatedCounter';
import { Users, Calendar, CheckSquare, GitBranch } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { contacts, appointments, tasks, deals } = useAppContext();

  const stats = {
    totalContacts: contacts.length,
    totalAppointments: appointments.length,
    totalTasks: tasks.length,
    totalDeals: deals.length,
    activeContacts: contacts.filter(c => c.stage !== 'Archived').length,
    pendingTasks: tasks.filter(t => t.status !== 'done').length,
    upcomingAppointments: appointments.filter(a => a.status === 'scheduled').length,
    activeDeals: deals.filter(d => !['won', 'lost'].includes(d.stage)).length
  };

  return (
    <div className="dashboard">
      <ScrollReveal animation="fadeInSlideUp">
        <div className="dashboard-header">
          <h2>Welcome to iCan</h2>
          <p className="dashboard-subtitle">Your networking command center</p>
        </div>
      </ScrollReveal>

      <div className="dashboard-stats">
        <ScrollReveal animation="fadeInSlideUp" delay={0.1} className="stagger-1">
          <Card padding="medium">
            <div className="stat-card">
              <Users className="stat-icon animate-pulse" size={24} />
              <div className="stat-label">Total Contacts</div>
              <div className="stat-value">
                <AnimatedCounter end={stats.totalContacts} duration={1000} />
              </div>
              <div className="stat-sub">{stats.activeContacts} active</div>
            </div>
          </Card>
        </ScrollReveal>

        <ScrollReveal animation="fadeInSlideUp" delay={0.2} className="stagger-2">
          <Card padding="medium">
            <div className="stat-card">
              <Calendar className="stat-icon animate-pulse" size={24} />
              <div className="stat-label">Appointments</div>
              <div className="stat-value">
                <AnimatedCounter end={stats.totalAppointments} duration={1000} />
              </div>
              <div className="stat-sub">{stats.upcomingAppointments} upcoming</div>
            </div>
          </Card>
        </ScrollReveal>

        <ScrollReveal animation="fadeInSlideUp" delay={0.3} className="stagger-3">
          <Card padding="medium">
            <div className="stat-card">
              <CheckSquare className="stat-icon animate-pulse" size={24} />
              <div className="stat-label">Tasks</div>
              <div className="stat-value">
                <AnimatedCounter end={stats.totalTasks} duration={1000} />
              </div>
              <div className="stat-sub">{stats.pendingTasks} pending</div>
            </div>
          </Card>
        </ScrollReveal>

        <ScrollReveal animation="fadeInSlideUp" delay={0.4} className="stagger-4">
          <Card padding="medium">
            <div className="stat-card">
              <GitBranch className="stat-icon animate-pulse" size={24} />
              <div className="stat-label">Active Deals</div>
              <div className="stat-value">
                <AnimatedCounter end={stats.activeDeals} duration={1000} />
              </div>
              <div className="stat-sub">in pipeline</div>
            </div>
          </Card>
        </ScrollReveal>
      </div>

      {stats.totalContacts === 0 && (
        <ScrollReveal animation="fadeInSlideUp" delay={0.5}>
          <Card padding="large" className="dashboard-empty">
            <div className="empty-state">
              <h3>Get Started</h3>
              <p>Add your first contact to begin organizing your network.</p>
            </div>
          </Card>
        </ScrollReveal>
      )}
    </div>
  );
};

export default Dashboard;
