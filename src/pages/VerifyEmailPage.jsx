import React from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import EmailVerification from '../components/auth/EmailVerification';

const VerifyEmailPage = () => {
  return (
    <AuthLayout
      title="Verify Email"
      subtitle="Complete your registration by verifying your email"
    >
      <EmailVerification />
    </AuthLayout>
  );
};

export default VerifyEmailPage;