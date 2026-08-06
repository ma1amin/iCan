import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../common/ThemeToggle';
import Footer from '../common/Footer';
import ScrollReveal from '../common/ScrollReveal';
import AnimatedCounter from '../common/AnimatedCounter';
import ShimmerBorder from '../common/ShimmerBorder';
import { Users, Calendar, MessageSquare, CheckSquare, GitBranch, Building2, Rocket, Target } from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or system preference
    const savedTheme = localStorage.getItem('ican-theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Sync theme with DOM on mount and when theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('ican-theme', newTheme);
  };

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="landing-header-content">
          <div className="landing-brand">
            <span className="landing-brand-name">iCan</span>
            <span className="landing-brand-tagline">Interact · Contact · Arrange · Negotiate</span>
          </div>
          <div className="landing-header-actions">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <Link to="/login" className="btn btn-ghost">Login</Link>
            <Link to="/register" className="btn btn-primary">Sign Up</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <ScrollReveal animation="fadeInSlideUp" delay={0}>
            <h1 className="landing-hero-title">
              Organize Your Digital Life & Professional Network
            </h1>
          </ScrollReveal>
          <ScrollReveal animation="fadeInSlideUp" delay={0.1}>
            <p className="landing-hero-subtitle">
              One powerful platform to manage contacts, appointments, interactions, tasks, and business negotiations. Transform chaos into clarity.
            </p>
          </ScrollReveal>
          <ScrollReveal animation="fadeInSlideUp" delay={0.2}>
            <div className="landing-hero-cta">
              <Link to="/register" className="btn btn-primary btn-large">
                Get Started Free
              </Link>
              <Link to="/login" className="btn btn-secondary btn-large">
                View Demo
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Features Section */}
      <section className="landing-features">
        <div className="landing-container">
          <ScrollReveal animation="fadeInSlideUp">
            <h2 className="landing-section-title">Everything You Need</h2>
            <p className="landing-section-subtitle">Complete platform for professional relationship management</p>
          </ScrollReveal>
          
          <div className="landing-features-grid">
            <ScrollReveal animation="fadeInSlideUp" delay={0.1} className="stagger-1">
              <div className="landing-feature-card">
                <Users className="landing-feature-icon animate-pulse" size={40} />
                <h3 className="landing-feature-title">Contact Management</h3>
                <p className="landing-feature-description">
                  Comprehensive contact profiles with activity timelines, tags, and advanced search capabilities.
                </p>
              </div>
            </ScrollReveal>
            
            <ScrollReveal animation="fadeInSlideUp" delay={0.2} className="stagger-2">
              <div className="landing-feature-card">
                <Calendar className="landing-feature-icon animate-pulse" size={40} />
                <h3 className="landing-feature-title">Calendar & Appointments</h3>
                <p className="landing-feature-description">
                  Full calendar with multiple views, recurring events, reminders, and contact integration.
                </p>
              </div>
            </ScrollReveal>
            
            <ScrollReveal animation="fadeInSlideUp" delay={0.3} className="stagger-3">
              <div className="landing-feature-card">
                <MessageSquare className="landing-feature-icon animate-pulse" size={40} />
                <h3 className="landing-feature-title">Interaction History</h3>
                <p className="landing-feature-description">
                  Track every interaction with contacts - calls, emails, meetings, and messages in one place.
                </p>
              </div>
            </ScrollReveal>
            
            <ScrollReveal animation="fadeInSlideUp" delay={0.4} className="stagger-4">
              <div className="landing-feature-card">
                <CheckSquare className="landing-feature-icon animate-pulse" size={40} />
                <h3 className="landing-feature-title">Task Management</h3>
                <p className="landing-feature-description">
                  Kanban-style task board with priorities, due dates, and task linking to contacts and deals.
                </p>
              </div>
            </ScrollReveal>
            
            <ScrollReveal animation="fadeInSlideUp" delay={0.5} className="stagger-5">
              <div className="landing-feature-card">
                <GitBranch className="landing-feature-icon animate-pulse" size={40} />
                <h3 className="landing-feature-title">Pipeline & Negotiations</h3>
                <p className="landing-feature-description">
                  Visual sales pipeline with deal tracking, probability management, and competitor analysis.
                </p>
              </div>
            </ScrollReveal>
            
            <ScrollReveal animation="fadeInSlideUp" delay={0.6} className="stagger-6">
              <div className="landing-feature-card">
                <Building2 className="landing-feature-icon animate-pulse" size={40} />
                <h3 className="landing-feature-title">Company Management</h3>
                <p className="landing-feature-description">
                  Organize contacts by company, track company-level metrics, and manage business relationships.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="landing-testimonials">
        <div className="landing-container">
          <ScrollReveal animation="fadeInSlideUp">
            <h2 className="landing-section-title">Trusted by Professionals</h2>
            <p className="landing-section-subtitle">See what our users say about iCan</p>
          </ScrollReveal>
          
          <div className="landing-testimonials-grid">
            <ScrollReveal animation="fadeInSlideUp" delay={0.1} className="stagger-1">
              <div className="landing-testimonial-card">
                <div className="landing-testimonial-content">
                  <p className="landing-testimonial-text">
                    "iCan transformed how I manage my professional network. Everything is in one place, and I never miss an important follow-up."
                  </p>
                  <div className="landing-testimonial-author">
                    <div className="landing-testimonial-avatar">JD</div>
                    <div className="landing-testimonial-info">
                      <div className="landing-testimonial-name">John Doe</div>
                      <div className="landing-testimonial-role">Sales Manager</div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal animation="fadeInSlideUp" delay={0.2} className="stagger-2">
              <div className="landing-testimonial-card">
                <div className="landing-testimonial-content">
                  <p className="landing-testimonial-text">
                    "The pipeline view alone saved me hours every week. I can see exactly where each deal stands and what needs attention."
                  </p>
                  <div className="landing-testimonial-author">
                    <div className="landing-testimonial-avatar">SM</div>
                    <div className="landing-testimonial-info">
                      <div className="landing-testimonial-name">Sarah Miller</div>
                      <div className="landing-testimonial-role">Business Developer</div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal animation="fadeInSlideUp" delay={0.3} className="stagger-3">
              <div className="landing-testimonial-card">
                <div className="landing-testimonial-content">
                  <p className="landing-testimonial-text">
                    "Finally, a platform that understands the complexity of professional relationships. The interaction history is invaluable."
                  </p>
                  <div className="landing-testimonial-author">
                    <div className="landing-testimonial-avatar">MJ</div>
                    <div className="landing-testimonial-info">
                      <div className="landing-testimonial-name">Michael Johnson</div>
                      <div className="landing-testimonial-role">Consultant</div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="landing-pricing">
        <div className="landing-container">
          <ScrollReveal animation="fadeInSlideUp">
            <h2 className="landing-section-title">Simple, Transparent Pricing</h2>
            <p className="landing-section-subtitle">Choose the plan that fits your needs</p>
          </ScrollReveal>
          
          <div className="landing-pricing-grid">
            <ScrollReveal animation="fadeInSlideUp" delay={0.1} className="stagger-1">
              <div className="landing-pricing-card">
                <div className="landing-pricing-header">
                  <h3 className="landing-pricing-plan">Free</h3>
                  <div className="landing-pricing-price">$0</div>
                  <div className="landing-pricing-period">forever</div>
                </div>
                <ul className="landing-pricing-features">
                  <li>Up to 100 contacts</li>
                  <li>Basic calendar features</li>
                  <li>Task management</li>
                  <li>Community support</li>
                </ul>
                <Link to="/register" className="btn btn-secondary btn-full">Get Started</Link>
              </div>
            </ScrollReveal>
            
            <ScrollReveal animation="fadeInSlideUp" delay={0.2} className="stagger-2">
              <ShimmerBorder shimmerColor="var(--accent-primary)" borderRadius="12px">
                <div className="landing-pricing-card landing-pricing-popular-inner">
                  <div className="landing-pricing-badge">Most Popular</div>
                  <div className="landing-pricing-header">
                    <h3 className="landing-pricing-plan">Pro</h3>
                    <div className="landing-pricing-price">$29</div>
                    <div className="landing-pricing-period">per month</div>
                  </div>
                  <ul className="landing-pricing-features">
                    <li>Unlimited contacts</li>
                    <li>Advanced calendar & reminders</li>
                    <li>Pipeline & negotiations</li>
                    <li>Company management</li>
                    <li>Priority support</li>
                  </ul>
                  <Link to="/register" className="btn btn-primary btn-full">Start Free Trial</Link>
                </div>
              </ShimmerBorder>
            </ScrollReveal>
            
            <ScrollReveal animation="fadeInSlideUp" delay={0.3} className="stagger-3">
              <div className="landing-pricing-card">
                <div className="landing-pricing-header">
                  <h3 className="landing-pricing-plan">Enterprise</h3>
                  <div className="landing-pricing-price">Custom</div>
                  <div className="landing-pricing-period">contact us</div>
                </div>
                <ul className="landing-pricing-features">
                  <li>Everything in Pro</li>
                  <li>Team collaboration</li>
                  <li>Advanced analytics</li>
                  <li>Custom integrations</li>
                  <li>Dedicated support</li>
                </ul>
                <Link to="/register" className="btn btn-secondary btn-full">Contact Sales</Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="landing-faq">
        <div className="landing-container">
          <ScrollReveal animation="fadeInSlideUp">
            <h2 className="landing-section-title">Frequently Asked Questions</h2>
            <p className="landing-section-subtitle">Find answers to common questions</p>
          </ScrollReveal>
          
          <div className="landing-faq-list">
            <ScrollReveal animation="fadeInSlideUp" delay={0.1} className="stagger-1">
              <div className="landing-faq-item">
                <h3 className="landing-faq-question">Is iCan free to use?</h3>
                <p className="landing-faq-answer">
                  Yes! iCan offers a free forever plan with up to 100 contacts and basic features. For more advanced features, upgrade to our Pro plan at $29/month.
                </p>
              </div>
            </ScrollReveal>
            
            <ScrollReveal animation="fadeInSlideUp" delay={0.2} className="stagger-2">
              <div className="landing-faq-item">
                <h3 className="landing-faq-question">How secure is my data?</h3>
                <p className="landing-faq-answer">
                  Your data is stored securely with encryption at rest and in transit. We follow industry best practices for data security and privacy.
                </p>
              </div>
            </ScrollReveal>
            
            <ScrollReveal animation="fadeInSlideUp" delay={0.3} className="stagger-3">
              <div className="landing-faq-item">
                <h3 className="landing-faq-question">Can I import my existing contacts?</h3>
                <p className="landing-faq-answer">
                  Absolutely! iCan supports CSV import for contacts, making it easy to migrate your existing data. We also provide export functionality.
                </p>
              </div>
            </ScrollReveal>
            
            <ScrollReveal animation="fadeInSlideUp" delay={0.4} className="stagger-4">
              <div className="landing-faq-item">
                <h3 className="landing-faq-question">Is there a mobile app?</h3>
                <p className="landing-faq-answer">
                  iCan is currently web-based and fully responsive for mobile devices. We're working on native mobile apps for iOS and Android.
                </p>
              </div>
            </ScrollReveal>
            
            <ScrollReveal animation="fadeInSlideUp" delay={0.5} className="stagger-5">
              <div className="landing-faq-item">
                <h3 className="landing-faq-question">Can I cancel my subscription anytime?</h3>
                <p className="landing-faq-answer">
                  Yes, you can cancel your subscription at any time. Your data will remain accessible until the end of your billing period.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-cta">
        <div className="landing-container">
          <ScrollReveal animation="fadeInSlideUp">
            <div className="landing-cta-content">
              <h2 className="landing-cta-title">Ready to Transform Your Professional Network?</h2>
              <p className="landing-cta-subtitle">Join thousands of professionals who trust iCan to manage their relationships.</p>
              <div className="landing-cta-actions">
                <Link to="/register" className="btn btn-primary btn-large">
                  Get Started Free
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;