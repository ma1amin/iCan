import React from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage = () => {
  return (
    <AuthLayout
      title="Create Account"
      subtitle="Start organizing your professional network today"
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;