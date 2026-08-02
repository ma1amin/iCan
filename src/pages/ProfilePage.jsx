import React from 'react';
import AppShell from '../components/layout/AppShell';
import UserProfile from '../components/user/UserProfile';

const ProfilePage = () => {
  return (
    <AppShell>
      <UserProfile />
    </AppShell>
  );
};

export default ProfilePage;