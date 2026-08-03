import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { Input } from '../common/Form';
import Button from '../common/Button';
import './LoginForm.css';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const [form, setForm] = useState({
    email: '',
    password: ''
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
    setIsLoading(true);

    try {
      const result = await login(form.email, form.password);
      
      if (result.success) {
        if (result.redirectTo) {
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
    <form onSubmit={handleSubmit} className="login-form">
      <div className="login-form-fields">
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
      </div>

      {error && (
        <div className="login-form-error">
          {error}
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        fullWidth
        disabled={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>

      <div className="login-form-footer">
        <p className="login-form-footer-text">
          Don't have an account?{' '}
          <Link to="/register" className="login-form-link">
            Sign up
          </Link>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;