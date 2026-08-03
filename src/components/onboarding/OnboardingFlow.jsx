import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { useAuthContext } from '../../context/AuthContext';
import Button from '../common/Button';
import './OnboardingFlow.css';

const OnboardingFlow = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { addContact, addAppointment, addTask } = useAppContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [skipped, setSkipped] = useState(false);
  const [createSampleData, setCreateSampleData] = useState(true);

  const steps = [
    {
      title: 'Welcome to iCan!',
      description: 'Your comprehensive platform for managing relationships, appointments, tasks, and business negotiations.',
      icon: '🚀',
      content: (
        <div className="onboarding-welcome">
          <h2>Organize Your Digital Life & Professional Network</h2>
          <p>The name "iCan" represents our four core pillars:</p>
          <div className="ican-philosophy">
            <div className="ican-item">
              <span className="ican-letter">I</span>
              <span className="ican-meaning">Interact</span>
            </div>
            <div className="ican-item">
              <span className="ican-letter">C</span>
              <span className="ican-meaning">Contact/Connect</span>
            </div>
            <div className="ican-item">
              <span className="ican-letter">A</span>
              <span className="ican-meaning">Arrange/Appointment</span>
            </div>
            <div className="ican-item">
              <span className="ican-letter">N</span>
              <span className="ican-meaning">Negotiate</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Contact Management',
      description: 'Build and maintain your professional network with comprehensive contact profiles.',
      icon: '👥',
      content: (
        <div className="onboarding-feature">
          <h3>Track Your Connections</h3>
          <ul className="feature-list">
            <li>✓ Detailed contact profiles with notes and tags</li>
            <li>✓ Company information and industry tracking</li>
            <li>✓ Interaction history and communication logs</li>
            <li>✓ Search and filter by multiple criteria</li>
            <li>✓ Import/export contacts for easy management</li>
          </ul>
        </div>
      )
    },
    {
      title: 'Calendar & Appointments',
      description: 'Never miss an important meeting or deadline with smart scheduling.',
      icon: '📅',
      content: (
        <div className="onboarding-feature">
          <h3>Smart Scheduling</h3>
          <ul className="feature-list">
            <li>✓ Multiple calendar views (Month, Week, Day)</li>
            <li>✓ Recurring events and reminders</li>
            <li>✓ Integration with contacts and interactions</li>
            <li>✓ Location and meeting details</li>
            <li>✓ Color-coded appointment types</li>
          </ul>
        </div>
      )
    },
    {
      title: 'Task Management',
      description: 'Stay organized and productive with Kanban-style task boards.',
      icon: '✅',
      content: (
        <div className="onboarding-feature">
          <h3>Track Your Progress</h3>
          <ul className="feature-list">
            <li>✓ Kanban board with four stages (To Do, In Progress, Review, Done)</li>
            <li>✓ Priority levels and due date tracking</li>
            <li>✓ Task categories and tags</li>
            <li>✓ Link tasks to contacts, appointments, and deals</li>
            <li>✓ Estimated vs actual time tracking</li>
          </ul>
        </div>
      )
    },
    {
      title: 'Pipeline & Negotiations',
      description: 'Track your business deals and negotiations through the sales pipeline.',
      icon: '💼',
      content: (
        <div className="onboarding-feature">
          <h3>Close More Deals</h3>
          <ul className="feature-list">
            <li>✓ Seven-stage sales pipeline</li>
            <li>✓ Deal value and probability tracking</li>
            <li>✓ Competitor and next steps management</li>
            <li>✓ Integration with contacts and companies</li>
            <li>✓ Sales funnel visualization</li>
          </ul>
        </div>
      )
    },
    {
      title: 'Get Started',
      description: 'Choose how you want to begin your journey with iCan.',
      icon: '🎯',
      content: (
        <div className="onboarding-setup">
          <h3>Setup Your Workspace</h3>
          <div className="setup-options">
            <label className="setup-option">
              <input
                type="checkbox"
                checked={createSampleData}
                onChange={(e) => setCreateSampleData(e.target.checked)}
              />
              <span>Create sample data to explore features</span>
            </label>
            <p className="setup-hint">
              This will add sample contacts, appointments, and tasks to help you get started.
            </p>
          </div>
        </div>
      )
    }
  ];

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setSkipped(true);
    handleComplete();
  };

  const handleComplete = async () => {
    try {
      if (createSampleData) {
        await createSampleDataFunction();
      }

      // Mark onboarding as completed
      localStorage.setItem('ican-onboarding-completed', 'true');
      localStorage.setItem('ican-onboarding-date', Date.now().toString());

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // Still navigate even if sample data creation fails
      localStorage.setItem('ican-onboarding-completed', 'true');
      navigate('/dashboard');
    }
  };

  const createSampleDataFunction = async () => {
    try {
      // Create sample contact
      const contactResult = await addContact({
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+1 234 567 8900',
        location: 'San Francisco, CA',
        industry: 'Technology',
        source: 'linkedin',
        stage: 'contacted',
        tags: ['prospect', 'tech'],
        notes: 'Met at Tech Conference 2024'
      });

      if (contactResult.success) {
        // Create sample appointment
        await addAppointment({
          title: 'Initial Meeting with John Smith',
          description: 'Discuss potential partnership opportunities',
          startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
          location: 'Zoom',
          type: 'meeting',
          contactId: contactResult.contact.id,
          reminder: { timing: '1hour' }
        });

        // Create sample task
        await addTask({
          title: 'Follow up with John Smith',
          description: 'Send partnership proposal and schedule next meeting',
          status: 'todo',
          priority: 'high',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          category: 'follow-up',
          contactId: contactResult.contact.id,
          reminder: { timing: '1day' }
        });
      }
    } catch (error) {
      console.error('Error creating sample data:', error);
    }
  };

  // Check if onboarding should be shown
  useEffect(() => {
    const onboardingCompleted = localStorage.getItem('ican-onboarding-completed');
    if (onboardingCompleted) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="onboarding-flow">
      <div className="onboarding-container">
        <div className="onboarding-header">
          <div className="onboarding-progress">
            <div 
              className="progress-bar" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="onboarding-steps">
            {steps.map((s, index) => (
              <div
                key={index}
                className={`step-indicator ${
                  index === currentStep ? 'active' : ''
                } ${index < currentStep ? 'completed' : ''}`}
              >
                {index < currentStep ? '✓' : index + 1}
              </div>
            ))}
          </div>
        </div>

        <div className="onboarding-content">
          <div className="onboarding-icon">{step.icon}</div>
          <h1 className="onboarding-title">{step.title}</h1>
          <p className="onboarding-description">{step.description}</p>
          <div className="onboarding-body">
            {step.content}
          </div>
        </div>

        <div className="onboarding-footer">
          <div className="onboarding-actions">
            {currentStep > 0 && (
              <Button variant="ghost" onClick={handleBack}>
                Back
              </Button>
            )}
            <Button 
              variant="primary" 
              onClick={handleNext}
            >
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
            </Button>
          </div>
          <Button 
            variant="ghost" 
            className="skip-button"
            onClick={handleSkip}
          >
            Skip Onboarding
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;