# Authentication Guide

Complete guide to using the iCan platform authentication system, user registration, login, and profile management.

## Table of Contents

- [Getting Started](#getting-started)
- [Registration](#registration)
- [Login](#login)
- [Email Verification](#email-verification)
- [User Profile](#user-profile)
- [Organizations](#organizations)
- [Security](#security)
- [Troubleshooting](#troubleshooting)

## Getting Started

The iCan platform requires user authentication to access its features. You can register for a free account, verify your email, and start managing your professional relationships immediately.

### Accessing the Platform

1. **Landing Page**: Visit the platform homepage at the main URL
2. **Sign Up**: Click the "Sign Up" button to create a new account
3. **Login**: If you already have an account, click "Login" to sign in

## Registration

### Creating a New Account

1. Click the "Sign Up" button on the landing page
2. Fill in the registration form:
   - **Full Name**: Your complete name
   - **Email**: A valid email address (will be used for verification)
   - **Password**: Minimum 8 characters
   - **Confirm Password**: Re-enter your password
   - **Organization Name** (optional): Your company or organization name

3. Click "Create Account"

### Organization Creation

When you register, you can either:
- **Create a new organization**: Enter your organization name to create a new tenant
- **Skip organization creation**: Your personal account will be associated with a default organization

### Account Setup

After registration:
1. You'll receive a verification email (currently simulated in development)
2. Click the verification link to activate your account
3. You'll be redirected to complete your profile setup
4. Start using the platform immediately

## Login

### Signing In

1. Click the "Login" button on the landing page
2. Enter your email and password
3. Click "Sign In"

### Session Management

- Sessions are maintained in your browser
- You'll stay logged in until you explicitly logout
- Sessions persist across browser restarts
- Use the logout button in the sidebar to end your session

### Password Recovery

If you forget your password:
1. Click "Forgot Password" on the login page (coming soon)
2. Enter your email address
3. Check your email for password reset instructions
4. Follow the link to reset your password

## Email Verification

### Why Verification Matters

Email verification ensures:
- Account security and authenticity
- Delivery of important notifications
- Recovery options for lost passwords
- Prevention of spam accounts

### Verification Process

1. Register for an account
2. Check your email for the verification link
3. Click the verification link
4. Your account is now verified and fully functional

### Resending Verification

If you didn't receive the verification email:
1. Log in to your account
2. Go to your profile page
3. Look for the email verification status
4. Click "Resend Verification Email" if needed

### Development Mode

In the current development version, email verification is simulated:
- Verification tokens are logged to the browser console
- You can manually test verification using the console output
- The verification link is displayed in the console for testing

## User Profile

### Accessing Your Profile

1. Click on "Profile" in the sidebar navigation
2. Or access it directly at `/profile`

### Profile Information

Your profile includes:
- **Name**: Your full name
- **Email**: Your registered email address
- **Email Verification Status**: Whether your email is verified
- **Avatar**: Your profile picture
- **Organization**: Your organization/tenant information

### Editing Your Profile

1. Go to your profile page
2. Click "Edit Profile"
3. Update your information:
   - **Name**: Change your display name
   - **Avatar**: Upload a new profile picture
4. Click "Save Changes"

### Avatar Upload

1. Click "Edit Profile" on your profile page
2. Click "Upload Avatar"
3. Select an image file (JPG, PNG, etc.)
4. The image will be automatically resized and displayed

### Changing Your Password

1. Go to your profile page
2. Click "Change Password" in the Security section
3. Enter your current password
4. Enter your new password (minimum 8 characters)
5. Confirm your new password
6. Click "Update Password"

### Deleting Your Account

⚠️ **Warning**: Deleting your account is irreversible and will permanently delete all your data including contacts, appointments, interactions, tasks, and deals.

To delete your account:

1. Go to your profile page
2. Scroll to the "Danger Zone" section
3. Click "Delete Account"
4. In the confirmation modal:
   - Type "DELETE ACCOUNT" (you must type this exactly, copy/paste is disabled)
   - Enter your password to verify your identity
5. Click "Delete Account" to confirm
6. Your account and all associated data will be permanently deleted
7. You will be redirected to the landing page

**Important Notes:**
- If you created an organization, it will also be deleted
- All your data will be permanently removed from the system
- There is no way to recover your account after deletion
- This action cannot be undone

### Organization Information

Your profile displays:
- **Organization Name**: Your company or organization name
- **Plan**: Your subscription plan (Free, Pro, Enterprise)
- **Member Since**: When you joined the organization

## Organizations

### Multi-Tenant Architecture

iCan uses a multi-tenant architecture:
- Each organization has its own isolated data
- Users belong to one organization
- Organization admins can manage team members (coming soon)
- Data is automatically filtered by organization

### Organization Roles

- **Admin**: Full access to all features and settings
- **Member**: Standard access to platform features
- **Viewer**: Read-only access to data (coming soon)

### Creating an Organization

When you register:
- You can create a new organization by entering a name
- You become the admin of your organization
- You can invite team members later (coming soon)

### Joining an Organization

Currently, users create their own organizations during registration. In future updates:
- Team invitations will be supported
- Users can join existing organizations
- Organization discovery will be available

## Security

### Password Requirements

- Minimum 8 characters
- Should include a mix of letters, numbers, and special characters
- Cannot be the same as your email
- Avoid common passwords

### Session Security

- Sessions are stored securely in your browser
- Sessions expire after a period of inactivity (configurable)
- Logout ends your session immediately
- Cross-site request protection is implemented

### Data Privacy

- Your data is stored in your browser's localStorage
- Data is isolated by organization
- Export functionality allows you to backup your data
- Account deletion removes all your data

### Best Practices

- Use a strong, unique password
- Enable email verification
- Keep your profile information updated
- Use the logout button in the header when on shared devices
- Regularly export your data for backup
- Be extremely careful with account deletion - it's irreversible
- Consider backup before account deletion

## Troubleshooting

### Registration Issues

**Problem**: Can't create an account
- **Solution**: Ensure your email is valid and password meets requirements
- **Solution**: Check that all required fields are filled
- **Solution**: Try a different browser if the issue persists

### Login Issues

**Problem**: Can't log in
- **Solution**: Verify your email and password are correct
- **Solution**: Check if your email is verified
- **Solution**: Reset your password if needed
- **Solution**: Clear your browser cache and cookies

### Email Verification Issues

**Problem**: Didn't receive verification email
- **Solution**: Check your spam folder
- **Solution**: Resend the verification email from your profile
- **Solution**: Ensure your email address is correct

**Problem**: Verification link expired
- **Solution**: Request a new verification email
- **Solution**: Verification links expire after 24 hours

### Profile Issues

**Problem**: Can't update profile
- **Solution**: Ensure you're logged in
- **Solution**: Check your internet connection
- **Solution**: Try refreshing the page

**Problem**: Avatar won't upload
- **Solution**: Ensure the image file is valid (JPG, PNG)
- **Solution**: Check file size (under 5MB)
- **Solution**: Try a different image format

### Session Issues

**Problem**: Keep getting logged out
- **Solution**: Check your browser settings for cookie permissions
- **Solution**: Ensure localStorage is enabled
- **Solution**: Try a different browser

**Problem**: Can't logout
- **Solution**: Clear your browser cache and cookies
- **Solution**: Try the logout button again
- **Solution**: Contact support if the issue persists

## Getting Help

If you encounter issues not covered in this guide:

1. Check the [Troubleshooting Guide](../troubleshooting.md)
2. Review the [Getting Started Guide](getting-started.md)
3. Contact support through the platform
4. Check the FAQ section on the landing page

## Future Enhancements

Coming soon to the authentication system:

- **Social Authentication**: Login with Google, GitHub, LinkedIn
- **Two-Factor Authentication**: Enhanced security with 2FA
- **Password Strength Meter**: Real-time password strength feedback
- **Team Invitations**: Invite team members to your organization
- **Audit Logs**: Track user activity within organizations
- **Single Sign-On**: Enterprise SSO integration