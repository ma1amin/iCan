import React, { useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { Input } from '../common/Form';
import Button from '../common/Button';
import Modal from '../common/Modal';
import './UserProfile.css';

const UserProfile = () => {
  const { user, tenant, updateUserProfile, logout, deleteAccount } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    avatar: user?.avatar || ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [deleteForm, setDeleteForm] = useState({
    confirmationText: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleEdit = () => {
    setEditForm({
      name: user?.name || '',
      avatar: user?.avatar || ''
    });
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    setError('');
    setSuccess('');

    try {
      const result = await updateUserProfile(editForm);
      
      if (result.success) {
        setSuccess('Profile updated successfully');
        setIsEditing(false);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }
  };

  const handlePasswordChange = async () => {
    setError('');
    setSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    // In production, this would verify current password and update via API
    setSuccess('Password updated successfully (mock)');
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setIsPasswordModalOpen(false);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDeleteAccount = async () => {
    setError('');
    setSuccess('');

    if (deleteForm.confirmationText !== 'DELETE ACCOUNT') {
      setError('Please type "DELETE ACCOUNT" to confirm');
      return;
    }

    try {
      const result = await deleteAccount(deleteForm.password);
      
      if (result.success) {
        setSuccess('Account deleted successfully');
        setIsDeleteModalOpen(false);
        
        // Redirect to landing page after a short delay
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) {
    return <div className="user-profile-loading">Loading...</div>;
  }

  return (
    <div className="user-profile">
      <div className="user-profile-header">
        <h1 className="user-profile-title">User Profile</h1>
        <p className="user-profile-subtitle">Manage your account settings and preferences</p>
      </div>

      {error && (
        <div className="user-profile-error">
          {error}
        </div>
      )}

      {success && (
        <div className="user-profile-success">
          {success}
        </div>
      )}

      <div className="user-profile-content">
        {/* Profile Information */}
        <div className="user-profile-section">
          <div className="user-profile-section-header">
            <h2 className="user-profile-section-title">Profile Information</h2>
            {!isEditing && (
              <Button variant="primary" size="small" onClick={handleEdit}>
                Edit Profile
              </Button>
            )}
          </div>

          <div className="user-profile-avatar-section">
            <div className="user-profile-avatar-display">
              {editForm.avatar ? (
                <img src={editForm.avatar} alt="Avatar" className="user-profile-avatar-image" />
              ) : (
                <div className="user-profile-avatar-placeholder">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            {isEditing && (
              <div className="user-profile-avatar-upload">
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="user-profile-avatar-input"
                />
                <label htmlFor="avatar-upload" className="user-profile-avatar-label">
                  Upload Avatar
                </label>
              </div>
            )}
          </div>

          <div className="user-profile-fields">
            {isEditing ? (
              <>
                <Input
                  label="Full Name"
                  value={editForm.name}
                  onChange={(value) => setEditForm(prev => ({ ...prev, name: value }))}
                  fullWidth
                />
                <div className="user-profile-actions">
                  <Button variant="ghost" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleSaveProfile}>
                    Save Changes
                  </Button>
                </div>
              </>
            ) : (
              <div className="user-profile-field-group">
                <div className="user-profile-field">
                  <label className="user-profile-field-label">Name</label>
                  <div className="user-profile-field-value">{user.name}</div>
                </div>
                <div className="user-profile-field">
                  <label className="user-profile-field-label">Email</label>
                  <div className="user-profile-field-value">{user.email}</div>
                </div>
                <div className="user-profile-field">
                  <label className="user-profile-field-label">Role</label>
                  <div className="user-profile-field-value">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </div>
                </div>
                <div className="user-profile-field">
                  <label className="user-profile-field-label">Email Verified</label>
                  <div className="user-profile-field-value">
                    {user.emailVerified ? '✓ Verified' : '✗ Not Verified'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tenant Information */}
        {tenant && (
          <div className="user-profile-section">
            <h2 className="user-profile-section-title">Organization</h2>
            <div className="user-profile-field-group">
              <div className="user-profile-field">
                <label className="user-profile-field-label">Organization Name</label>
                <div className="user-profile-field-value">{tenant.name}</div>
              </div>
              <div className="user-profile-field">
                <label className="user-profile-field-label">Plan</label>
                <div className="user-profile-field-value">
                  {tenant.plan.charAt(0).toUpperCase() + tenant.plan.slice(1)}
                </div>
              </div>
              <div className="user-profile-field">
                <label className="user-profile-field-label">Member Since</label>
                <div className="user-profile-field-value">
                  {new Date(tenant.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security */}
        <div className="user-profile-section">
          <h2 className="user-profile-section-title">Security</h2>
          <div className="user-profile-security-actions">
            <Button variant="secondary" onClick={() => setIsPasswordModalOpen(true)}>
              Change Password
            </Button>
            <Button variant="ghost" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="user-profile-section user-profile-section-danger">
          <h2 className="user-profile-section-title">Danger Zone</h2>
          <p className="user-profile-section-description">
            These actions are irreversible. Please be careful.
          </p>
          <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>
            Delete Account
          </Button>
        </div>
      </div>

      {/* Password Change Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Change Password"
        size="small"
      >
        <div className="user-profile-password-form">
          <Input
            label="Current Password"
            type="password"
            value={passwordForm.currentPassword}
            onChange={(value) => setPasswordForm(prev => ({ ...prev, currentPassword: value }))}
            fullWidth
          />
          <Input
            label="New Password"
            type="password"
            value={passwordForm.newPassword}
            onChange={(value) => setPasswordForm(prev => ({ ...prev, newPassword: value }))}
            fullWidth
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={passwordForm.confirmPassword}
            onChange={(value) => setPasswordForm(prev => ({ ...prev, confirmPassword: value }))}
            fullWidth
          />
          <div className="user-profile-modal-actions">
            <Button variant="ghost" onClick={() => setIsPasswordModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handlePasswordChange}>
              Update Password
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Account"
        size="small"
      >
        <div className="user-profile-delete-form">
          <p className="user-profile-delete-warning">
            This action is irreversible. All your data, including contacts, appointments, interactions, tasks, and deals will be permanently deleted.
          </p>
          
          <div className="user-profile-delete-step">
            <label className="user-profile-delete-label">
              Type <strong>DELETE ACCOUNT</strong> to confirm:
            </label>
            <Input
              type="text"
              value={deleteForm.confirmationText}
              onChange={(value) => setDeleteForm(prev => ({ ...prev, confirmationText: value }))}
              placeholder="DELETE ACCOUNT"
              fullWidth
              onPaste={(e) => e.preventDefault()}
              onCopy={(e) => e.preventDefault()}
              className="user-profile-delete-input"
            />
          </div>

          <div className="user-profile-delete-step">
            <label className="user-profile-delete-label">
              Enter your password to confirm:
            </label>
            <Input
              type="password"
              value={deleteForm.password}
              onChange={(value) => setDeleteForm(prev => ({ ...prev, password: value }))}
              placeholder="Your password"
              fullWidth
            />
          </div>

          {error && (
            <div className="user-profile-error">
              {error}
            </div>
          )}

          {success && (
            <div className="user-profile-success">
              {success}
            </div>
          )}

          <div className="user-profile-modal-actions">
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={handleDeleteAccount}
              disabled={deleteForm.confirmationText !== 'DELETE ACCOUNT' || !deleteForm.password}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserProfile;