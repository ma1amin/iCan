import React, { useState } from 'react';
import { Input, Select, Textarea } from '../common/Form';
import Button from '../common/Button';
import StarRating from './StarRating';
import { FEEDBACK_SUBJECTS, getCategoriesForSubject, FEEDBACK_PRIORITIES } from '../../types/feedback';
import './FeedbackForm.css';

const FeedbackForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    subject: '',
    customSubject: '',
    category: '',
    content: '',
    rating: 5,
    priority: 'medium'
  });

  const categories = formData.subject ? getCategoriesForSubject(formData.subject) : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const subject = formData.subject === 'other' ? formData.customSubject : formData.subject;
    
    onSubmit({
      subject,
      category: formData.category,
      content: formData.content,
      rating: formData.rating,
      priority: formData.priority
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // Reset category when subject changes
      ...(field === 'subject' && { category: '' })
    }));
  };

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      <div className="feedback-form-header">
        <h2>Submit Feedback</h2>
        <p>We value your feedback to improve iCan</p>
      </div>

      <div className="feedback-form-body">
        <div className="feedback-form-field">
          <label htmlFor="subject">Subject</label>
          <Select
            id="subject"
            value={formData.subject}
            onChange={(e) => handleChange('subject', e.target.value)}
            options={[
              { value: '', label: 'Select a subject' },
              ...FEEDBACK_SUBJECTS.map(subject => ({
                value: subject.value,
                label: subject.label
              })),
              { value: 'other', label: 'Other (specify below)' }
            ]}
            required
          />
        </div>

        {formData.subject === 'other' && (
          <div className="feedback-form-field">
            <label htmlFor="customSubject">Custom Subject</label>
            <Input
              id="customSubject"
              value={formData.customSubject}
              onChange={(e) => handleChange('customSubject', e.target.value)}
              placeholder="Enter custom subject"
              required
            />
          </div>
        )}

        {categories.length > 0 && (
          <div className="feedback-form-field">
            <label htmlFor="category">Category</label>
            <Select
              id="category"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              options={[
                { value: '', label: 'Select a category' },
                ...categories.map(category => ({
                  value: category.value,
                  label: category.label
                }))
              ]}
              required
            />
          </div>
        )}

        <div className="feedback-form-field">
          <label htmlFor="priority">Priority</label>
          <Select
            id="priority"
            value={formData.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
            options={FEEDBACK_PRIORITIES.map(priority => ({
              value: priority.value,
              label: priority.label
            }))}
          />
        </div>

        <div className="feedback-form-field">
          <label htmlFor="content">Your Feedback</label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => handleChange('content', e.target.value)}
            placeholder="Please describe your feedback in detail..."
            rows={5}
            required
          />
        </div>

        <div className="feedback-form-field">
          <label>Rating</label>
          <StarRating
            value={formData.rating}
            onChange={(rating) => handleChange('rating', rating)}
          />
        </div>
      </div>

      <div className="feedback-form-footer">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Submit Feedback
        </Button>
      </div>
    </form>
  );
};

export default FeedbackForm;
