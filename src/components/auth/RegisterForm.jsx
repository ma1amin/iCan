import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { Input } from '../common/Form';
import Button from '../common/Button';
import './RegisterForm.css';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register } = useAuthContext();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    organization: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      const result = await register(
        {
          name: form.name,
          email: form.email,
          password: form.password
        },
        {
          name: form.organization || form.name + "'s Organization"
        }
      );
      
      if (result.success) {
        if (result.requiresVerification) {
          navigate('/verify-email');
        } else if (result.redirectTo) {
          navigate(result.redirectTo);
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <div className="register-form-fields">
        <Input
          label="Full Name"
          type="text"
          value={form.name}
          onChange={(value) => handleChange('name', value)}
          placeholder="John Doe"
          fullWidth
          required
        />

        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(value) => handleChange('email', value)}
          placeholder="you@example.com"
          fullWidth
          required
        />

        <Input
          label="Password"
          type="password"
          value={form.password}
          onChange={(value) => handleChange('password', value)}
          placeholder="••••••••"
          fullWidth
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          value={form.confirmPassword}
          onChange={(value) => handleChange('confirmPassword', value)}
          placeholder="••••••••"
          fullWidth
          required
        />

        <Input
          label="Organization Name (optional)"
          type="text"
          value={form.organization}
          onChange={(value) => handleChange('organization', value)}
          placeholder="Acme Corporation"
          fullWidth
        />
      </div>

      {error && (
        <div className="register-form-error">
          {error}
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        fullWidth
        disabled={isLoading}
      >
        {isLoading ? 'Creating account...' : 'Create Account'}
      </Button>

      <div className="register-form-footer">
        <p className="register-form-footer-text">
          Already have an account?{' '}
          <Link to="/login" className="register-form-link">
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;