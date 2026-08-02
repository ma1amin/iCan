import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import Button from '../common/Button';
import './EmailVerification.css';

const EmailVerification = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { verifyEmail, resendVerificationEmail, user } = useAuthContext();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided');
      return;
    }

    const verifyToken = async () => {
      const result = await verifyEmail(token);
      
      if (result.success) {
        setStatus('success');
        setMessage('Your email has been verified successfully!');
      } else {
        setStatus('error');
        setMessage(result.error);
      }
    };

    verifyToken();
  }, [searchParams, verifyEmail]);

  const handleResend = async () => {
    setIsResending(true);
    const result = await resendVerificationEmail();
    
    if (result.success) {
      setMessage('Verification email has been resent. Please check your inbox.');
    } else {
      setMessage(result.error);
    }
    
    setIsResending(false);
  };

  const handleContinue = () => {
    navigate('/dashboard');
  };

  if (status === 'loading') {
    return (
      <div className="email-verification">
        <div className="email-verification-spinner">
          <div className="spinner"></div>
        </div>
        <p className="email-verification-message">Verifying your email...</p>
      </div>
    );
  }

  return (
    <div className="email-verification">
      <div className={`email-verification-icon ${status}`}>
        {status === 'success' ? '✓' : '✕'}
      </div>
      
      <h2 className="email-verification-title">
        {status === 'success' ? 'Email Verified!' : 'Verification Failed'}
      </h2>
      
      <p className="email-verification-message">
        {message}
      </p>

      {status === 'success' ? (
        <Button
          variant="primary"
          onClick={handleContinue}
          fullWidth
        >
          Continue to Dashboard
        </Button>
      ) : (
        <>
          <Button
            variant="primary"
            onClick={handleResend}
            disabled={isResending}
            fullWidth
          >
            {isResending ? 'Resending...' : 'Resend Verification Email'}
          </Button>
          
          <div className="email-verification-footer">
            <Link to="/login" className="email-verification-link">
              Back to Login
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default EmailVerification;