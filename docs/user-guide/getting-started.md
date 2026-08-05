# Getting Started with iCan

Welcome to iCan! This guide will help you get started with the platform and set up your professional networking system.

## Platform Access

### For Users

To access the iCan platform:

1. **Visit the Landing Page**: Navigate to the platform URL
2. **Sign Up**: Create a new account with your email and password
3. **Create Organization**: Enter your organization name during registration
4. **Verify Email**: Complete email verification to activate your account
5. **Login**: Sign in with your credentials to access your organization's data

**Note**: Each organization has its own isolated data. Your contacts, appointments, and other data are separate from other organizations.

### For Developers

#### Prerequisites
- Node.js 16+ installed
- Modern web browser (Chrome, Firefox, Safari, Edge)

#### Setup Instructions

1. **Clone or download the iCan platform**
   ```bash
   git clone <repository-url>
   cd ican
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## First-Time Setup

### Account Registration

1. Click the "Sign Up" button on the landing page
2. Fill in the registration form:
   - Full Name (required)
   - Email (required)
   - Password (minimum 8 characters)
   - Confirm Password
   - Organization Name (optional)
3. Click "Create Account"
4. Verify your email address when prompted
5. Login with your credentials

### Create Your First Contact

1. Navigate to the "Contacts" view from the sidebar
2. Click the "Add Contact" button in the top navigation
3. Fill in the contact details:
   - Name (required)
   - Phone number
   - Email address
   - Company (manual text entry)
   - Industry (dropdown selection)
   - Source (LinkedIn, WhatsApp, Other)
   - Initial stage (new, contacted, meeting, negotiating, collaborating, archived)
   - Notes
4. Click "Save" to create the contact

**Note**: Company names are now entered as simple text fields rather than creating separate company records. This simplifies data management while maintaining organization capabilities.

### Import Existing Contacts

If you have existing contacts from other systems:

1. Click "Bulk Import" in the top navigation
2. Format your data as CSV: `Name, Phone, Company, Source`
3. Paste your contact data into the import area
4. Click "Import" to add all contacts at once

### Schedule Your First Appointment

1. Navigate to the Calendar view
2. Click on a date or use the "New Appointment" button
3. Fill in appointment details:
   - Title
   - Contact (optional)
   - Date and time
   - Duration
   - Location
   - Type (call, meeting, video)
   - Recurrence (optional)
   - Reminder (optional)
4. Click "Save" to schedule

### Create Your First Task

1. Navigate to the Tasks view
2. Click "New Task"
3. Fill in task details:
   - Title
   - Description
   - Due date
   - Priority (low, medium, high)
   - Category
   - Related contact (optional)
4. Click "Save" to create the task

## Understanding the Interface

### Navigation

The sidebar provides access to all main features:

- **Dashboard**: Overview of your networking activity
- **Contacts**: Manage your contact database
- **Calendar**: View and manage appointments
- **Interactions**: Log and view interaction history
- **Tasks**: Manage your task list and workflow
- **Pipeline**: Track deals and negotiations
- **Profile**: Manage your account settings and profile
- **Logout**: Sign out of your account

**Note**: Company management has been simplified. Company names are now entered directly in Contact and Deal forms as text fields with industry dropdowns for categorization.

### Dashboard

The dashboard provides:
- Total contacts count
- Active pipeline count
- Today's agenda (appointments + tasks)
- Recent interactions
- Quick stats overview

### Color Coding

The platform uses color coding to represent different aspects:

- **Blue (#5B8DEF)**: Interactions and communication
- **Green (#34D399)**: Contacts and relationships
- **Orange (#F0B429)**: Appointments and scheduling
- **Purple (#8B5CF6)**: Negotiations and deals

## Basic Workflows

### Contact Management Workflow

1. **Add Contact**: Create new contact profiles
2. **Interact**: Log interactions with contacts
3. **Follow Up**: Create tasks for follow-up actions
4. **Schedule**: Book appointments directly from contact profiles
5. **Track**: Monitor relationship progress through the pipeline

### Deal Management Workflow

1. **Identify Opportunity**: Create contact and initial interaction
2. **Qualify**: Move to appropriate pipeline stage
3. **Track**: Add deal value, probability, and next steps
4. **Schedule**: Book meetings and follow-ups
5. **Close**: Mark as won/lost and analyze results

## Tips for Success

1. **Start Small**: Begin with core contacts and gradually expand
2. **Be Consistent**: Log interactions regularly for accurate tracking
3. **Use Templates**: Create task templates for common workflows
4. **Set Reminders**: Use appointment reminders to stay on schedule
5. **Review Regularly**: Check dashboard and pipeline weekly for insights

## Next Steps

- Learn more about [Authentication](authentication-guide.md)
- Learn more about [Contact Management](contacts-guide.md)
- Explore [Calendar Features](calendar-guide.md)
- Understand [Interaction Tracking](interactions-guide.md)
- Master [Task Management](tasks-guide.md)
- Dive into [Negotiation Tracking](negotiations-guide.md)

## Support

For troubleshooting and common issues, see the [Troubleshooting Guide](../troubleshooting.md).
