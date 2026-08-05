# Tasks Guide

Manage your tasks and action items with iCan's comprehensive Kanban-style task management system.

## Current Implementation Status

### ✅ Available Features
- **Kanban Board**: Four-column Kanban board (To Do, In Progress, Review, Done)
- **Task Creation**: Comprehensive task creation with all fields
- **Task Editing**: Full task editing capabilities
- **Task Categories**: Multiple categories (follow-up, research, meeting prep, administrative, development)
- **Priority Levels**: Three priority levels (low, medium, high) with color coding
- **Due Date Tracking**: Due date with relative formatting and overdue indicators
- **Reminder System**: Reminders (15min, 1hour, 1day, 1week before)
- **Search and Filtering**: Search by title, description, tags; filter by contact, status, priority, category
- **Linking**: Link tasks to contacts, appointments, interactions, and deals
- **Task Tags**: Organize tasks with tags
- **Estimated Time**: Track estimated time for tasks
- **Status Change**: Quick status change via dropdown on task cards
- **Task Statistics**: Dashboard showing total, in progress, done, and overdue tasks

### 🚧 Coming Soon
- Drag-and-drop task movement between columns
- Task templates for common tasks
- Task dependencies
- Subtasks
- Time tracking (actual time vs estimated)
- Task assignments
- Task automation

## Kanban Board Overview

The Kanban board displays tasks in four columns based on their status:

### To Do
- Tasks that need to be started
- Color: Gray (#4B5266)

### In Progress
- Tasks currently being worked on
- Color: Blue (#5B8DEF)

### Review
- Tasks that need review or approval
- Color: Yellow (#F0B429)

### Done
- Completed tasks
- Color: Green (#34D399)

## Creating Tasks

### Manual Creation

1. Navigate to Tasks view
2. Click "New Task" button
3. Fill in required fields:
   - **Title** (required): Task name
   - **Status**: To Do, In Progress, Review, or Done
   - **Priority**: Low, Medium, or High
4. Add optional details:
   - **Due Date**: When the task is due
   - **Reminder**: 15min, 1hour, 1day, or 1week before
   - **Estimated Time**: Time estimate in minutes
   - **Category**: Follow-up, Research, Meeting Prep, Administrative, Development
   - **Contact**: Related contact
   - **Related Appointment**: Link to calendar appointment
   - **Related Interaction**: Link to interaction
   - **Related Deal**: Link to deal
   - **Tags**: Comma-separated tags for organization
   - **Description**: Task details and requirements
5. Click "Create Task"

### Task from Interaction

When you log an interaction with "Follow-up Required" outcome:
1. Navigate to the interaction
2. Create a follow-up task to track the required action
3. Link the task to the interaction for context

## Managing Tasks

### Viewing Tasks

**Kanban Board**: Shows tasks organized by status
- Four columns for different statuses (To Do, In Progress, Review, Done)
- Task cards with key information
- Priority indicators (colored dots)
- Due date with relative formatting
- Contact name if linked
- Tags display
- **Drag and drop** tasks between columns to change status
- **Status dropdown** on task cards for quick status changes
- Click to edit/view details
- **"Done" tasks** cannot be moved back to other columns (terminal state)

**Task Statistics**: Dashboard at top of Tasks view
- Total tasks count
- In Progress count (blue)
- Done count (green)
- Overdue count (red)

### Editing Tasks

1. Click on any task card to open details
2. Modify any fields as needed
3. Click "Save Changes" to update

### Changing Task Status

**Quick Status Change**:
1. Find the status dropdown on the task card
2. Select new status from dropdown
3. Task moves to appropriate column

**Edit Task**:
1. Open task details by clicking on the card
2. Change status field
3. Click "Save Changes"

### Deleting Tasks

1. Open task details by clicking on the card
2. Click "Delete Task" button
3. Confirm deletion
4. **Note**: This action cannot be undone

## Task Categories

Organize tasks by category for better management:

### Follow-up
- Tasks related to following up with contacts
- Generated from interactions with "Follow-up Required" outcome
- High priority typically

### Research
- Research and investigation tasks
- Information gathering
- Market research

### Meeting Prep
- Preparation for meetings
- Agenda creation
- Material preparation

### Administrative
- Administrative tasks
- Documentation
- Organizational tasks

### Development
- Development and technical tasks
- Feature implementation
- Bug fixes

## Priority Levels

Assign priority to tasks for better focus:

### Low
- Tasks that can be done when time permits
- Color: Gray (#4B5266)

### Medium
- Standard priority tasks
- Color: Yellow (#F0B429)

### High
- Urgent tasks requiring immediate attention
- Color: Red (#E06166)

## Search and Filtering

### Search Tasks

1. Use the search bar at the top of Tasks view
2. Type in task title, description, or tags
3. Kanban board updates in real-time to show matching tasks

### Filter by Contact

View tasks for specific contacts:

1. Use the contact filter dropdown
2. Select specific contact or "All Contacts"
3. Board shows only tasks with that contact

### Filter by Status

Focus on specific statuses:

1. Use the status filter dropdown
2. Select status (To Do, In Progress, Review, Done)
3. Board shows only tasks with that status

### Filter by Priority

View tasks by priority:

1. Use the priority filter dropdown
2. Select priority (Low, Medium, High)
3. Board shows only tasks with that priority

### Filter by Category

View tasks by category:

1. Use the category filter dropdown
2. Select category
3. Board shows only tasks with that category

### Clearing Filters

- Clear search text to remove search filter
- Select "All Contacts" to remove contact filter
- Select "All Statuses" to remove status filter
- Select "All Priorities" to remove priority filter
- Select "All Categories" to remove category filter

## Task Fields Reference

| Field | Required | Description |
|-------|----------|-------------|
| Title | Yes | Task name or description |
| Status | No | To Do, In Progress, Review, or Done |
| Priority | No | Low, Medium, or High |
| Due Date | No | When the task is due |
| Reminder | No | 15min, 1hour, 1day, or 1week before |
| Estimated Time | No | Time estimate in minutes |
| Category | No | Follow-up, Research, Meeting Prep, Administrative, Development |
| Contact | No | Related contact (dropdown selection) |
| Related Appointment | No | Link to calendar appointment |
| Related Interaction | No | Link to interaction |
| Related Deal | No | Link to deal |
| Tags | No | Comma-separated tags for organization |
| Description | No | Task details and requirements |

## Due Date Formatting

Due dates are displayed with relative formatting for quick understanding:

- **Overdue**: Due date is in the past (displayed in red)
- **Today**: Due today
- **Tomorrow**: Due tomorrow
- **X days**: Due in X days (up to 7 days)
- **Date**: Absolute date for more than 7 days away

## Best Practices

1. **Set Priorities**: Always set appropriate priority levels
2. **Use Categories**: Categorize tasks for better organization
3. **Set Due Dates**: Set due dates for time-sensitive tasks
4. **Link to Contacts**: Link tasks to related contacts for context
5. **Use Tags**: Use tags for additional organization
6. **Update Status**: Keep task status current as work progresses
7. **Review Regularly**: Review tasks daily to prioritize work

## Integration with Other Features

### Contact Integration
- Tasks appear in contact activity timeline
- Contact name displayed on task cards
- Filter tasks by contact

### Calendar Integration
- Link tasks to appointments for meeting prep
- Link tasks to calendar events
- Schedule-related task management

### Interaction Integration
- Create follow-up tasks from interactions
- Link tasks to interactions for context
- Track action items from communications

### Deal Integration
- Link tasks to deals for negotiation follow-ups
- Track deal-related action items
- Pipeline task management

## Tips and Tricks

- **Quick Status Change**: Use the dropdown on task cards for fast status updates
- **Overdue Indicators**: Overdue tasks are highlighted in red
- **Priority Colors**: Priority indicators use color coding for quick scanning
- **Tag Search**: Search by tags to find related tasks
- **Multi-Filter**: Combine multiple filters for precise task views
- **Statistics**: Use the statistics dashboard to track progress

## Troubleshooting

**Task Not Showing**: Check filters and ensure task exists in correct status column
**Cannot Edit Task**: Make sure you're clicking on the task card
**Due Date Issues**: Ensure due date is in the future
**Status Not Changing**: Use the dropdown on the task card or edit the task
**Contact Not in Dropdown**: Create the contact first in Contacts view

For more help, see the [Troubleshooting Guide](../troubleshooting.md).
