# Calendar and Appointments Guide

Master appointment scheduling and calendar management with iCan's comprehensive calendar system.

## Current Implementation Status

### ✅ Available Features
- **Calendar Views**: Three calendar views (Month, Week, Day)
- **Appointment CRUD**: Create, edit, and delete appointments
- **Recurring Events**: Support for daily, weekly, and monthly recurrence
- **Reminder System**: Reminders (15min, 1hour, 1day before)
- **Search and Filtering**: Search by title, filter by contact and type
- **Contact Integration**: Link appointments to contacts
- **Navigation**: Navigate between months, weeks, and days
- **Responsive Design**: Mobile-friendly calendar views

### 🚧 Coming Soon
- Drag-and-drop appointment rescheduling
- External calendar sync (Google, Outlook)
- Appointment templates
- Availability management
- Color-coded appointment types
- Multiple reminder support per appointment

## Calendar Views

### Month View
- Displays entire month at a glance
- Shows appointment indicators (dots for multiple appointments)
- Navigate between months using Previous/Next buttons
- Click any day to create new appointment
- Today highlighted with special styling
- Appointment count for days with multiple events

### Week View
- Detailed view of current week (7 days)
- Shows appointment list for each day
- Appointment time, title, and contact name displayed
- Navigate between weeks
- Click on appointments to edit
- Click on day header to create appointment

### Day View
- Focused view of single day
- Large display of day name and date
- Detailed appointment list with time, title, contact, and location
- Navigate between days
- Comprehensive appointment information

## Creating Appointments

### Basic Appointment

1. Navigate to Calendar view
2. Click "New Appointment" button or click on any date
3. Fill in required fields:
   - **Title** (required): Appointment name
   - **Start Time** (required): When the appointment begins
   - **End Time** (required): When the appointment ends
4. Add optional details:
   - **Location**: Physical or virtual location
   - **Type**: Call, meeting, video conference, etc.
   - **Contact**: Related contact (optional)
   - **Status**: Scheduled, completed, or cancelled
   - **Recurrence**: No recurrence, daily, weekly, or monthly
   - **Reminder**: 15min, 1hour, 1day before, or none
   - **Description**: Additional details or agenda
5. Click "Create Appointment"

### Recurring Appointments

For regular meetings or appointments:

1. Create appointment as above
2. Set "Recurrence" field:
   - **None**: One-time appointment
   - **Daily**: Repeats every day
   - **Weekly**: Repeats every week on same day
   - **Monthly**: Repeats every month on same date
3. Set reminder if needed
4. Click "Create Appointment"

**Note**: Currently, all recurrence patterns are treated as indefinite. Individual occurrence editing coming soon.

### Appointment Types

Choose the appropriate type for better organization:

- **Call**: Phone call or voice conversation
- **Meeting**: In-person meeting
- **Video**: Video conference or virtual meeting
- **Other**: Custom appointment type

## Managing Appointments

### Editing Appointments

1. Click on any appointment to open details
2. Modify any fields as needed
3. Click "Save Changes" to update

### Deleting Appointments

1. Open appointment details by clicking on it
2. Click "Delete" button
3. Confirm deletion
4. **Note**: This action cannot be undone

### Rescheduling

Currently, rescheduling is done by editing the appointment:

1. Open appointment details
2. Edit the Start Time and End Time fields
3. Click "Save Changes"

**Coming soon**: Drag-and-drop rescheduling in Week and Day views.

## Reminders

Never miss an appointment with customizable reminders:

### Setting Reminders

1. Create or edit appointment
2. Set "Reminder" field:
   - **None**: No reminder
   - **15min**: 15 minutes before appointment
   - **1hour**: 1 hour before appointment
   - **1day**: 1 day before appointment
3. Click "Save"

**Note**: Currently, reminders are stored with the appointment. Browser notification support coming soon.

## Calendar Filtering

### Search Appointments

1. Use the search bar at the top of the calendar
2. Type in appointment title or description
3. Calendar updates in real-time to show matching appointments

### Filter by Contact

View appointments for specific contacts:

1. Use the contact filter dropdown
2. Select specific contact or "All Contacts"
3. Calendar updates to show filtered results

### Filter by Type

Focus on specific appointment types:

1. Use the type filter dropdown
2. Select type (Call, Meeting, Video, etc.)
3. Calendar shows only selected type

### Clearing Filters

- Clear search text to remove search filter
- Select "All Contacts" to remove contact filter
- Select "All Types" to remove type filter

## Integration with Contacts

### Contact-Linked Appointments

Link appointments to contacts for better context:

1. When creating appointment, select related contact from dropdown
2. Appointment appears in contact's activity timeline
3. Contact name displayed on appointment in calendar views
4. Quick access to contact information

### Viewing Contact Appointments

To see all appointments for a specific contact:

1. Go to Contacts view
2. Click on the contact
3. View activity timeline
4. Appointments are displayed with interactions and tasks

## Appointment Fields Reference

| Field | Required | Description |
|-------|----------|-------------|
| Title | Yes | Name or subject of the appointment |
| Start Time | Yes | When the appointment begins |
| End Time | Yes | When the appointment ends |
| Location | No | Physical address or virtual meeting link |
| Type | No | Call, meeting, video, or other |
| Contact | No | Related contact (dropdown selection) |
| Status | No | Scheduled, completed, or cancelled |
| Recurrence | No | None, daily, weekly, or monthly |
| Reminder | No | None, 15min, 1hour, or 1day before |
| Description | No | Agenda, notes, or additional details |

## Best Practices

1. **Be Specific**: Use clear, descriptive titles
2. **Add Context**: Include agenda items in description
3. **Set Reminders**: Use reminders for important appointments
4. **Link Contacts**: Always link to relevant contacts
5. **Review Regularly**: Check calendar weekly for planning
6. **Use Recurrence**: Set up recurring events for regular meetings
7. **Filter Wisely**: Use filters to focus on specific types of appointments

## Tips and Tricks

- **Quick Create**: Click on any date to quickly create appointment for that day
- **View Switching**: Toggle between Month, Week, and Day views for different perspectives
- **Today's Date**: Current date is highlighted in calendar views
- **Navigation**: Use Previous/Next buttons to navigate between periods
- **Multiple Appointments**: Days with multiple appointments show a count indicator

## Troubleshooting

**Appointments Not Showing**: Check filters (search, contact, type) and ensure you're viewing the correct date range
**Cannot Edit Appointment**: Make sure you're clicking on the appointment, not the day
**Date/Time Issues**: Ensure end time is after start time
**Contact Not in Dropdown**: Create the contact first in Contacts view

For more help, see the [Troubleshooting Guide](../troubleshooting.md).
