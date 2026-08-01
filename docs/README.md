# iCan Platform

A comprehensive digital life and networking organization platform where the acronym represents: I (Interact), C (Contact/Connect), A (Arrange/Appointment), N (Negotiate).

## Vision

The iCan platform helps professionals manage their relationships, appointments, tasks, and business negotiations in one unified system.

## Features

### ✅ Implemented
- **Contact Management**: Full CRUD operations with comprehensive contact profiles
  - Create, edit, and delete contacts
  - Search and filter by name, company, source, and stage
  - Contact detail view with activity timeline
  - Bulk import from CSV with validation
  - Export to CSV and JSON formats
  - Tags, notes, and detailed contact information
- **Calendar & Appointments**: Full calendar functionality
  - Three calendar views (Month, Week, Day)
  - Appointment creation and editing with validation
  - Recurring event support (daily, weekly, monthly)
  - Reminder system (15min, 1hour, 1day before)
  - Search and filter appointments by title, contact, and type
  - Integration with contacts
  - Color-coded appointment display
- **Interaction History**: Complete interaction logging and tracking
  - Interaction logging with multiple types (call, email, message, meeting)
  - Interaction timeline with chronological display
  - Quick-log buttons in contact detail view
  - Search and filter by subject, contact, type, and outcome
  - Outcome tracking for interactions
  - Link interactions to appointments
  - Direction tracking (inbound/outbound)
- **Task Management**: Kanban-style task board with comprehensive features
  - Kanban board with four columns (To Do, In Progress, Review, Done)
  - Task creation and editing with validation
  - Task categories (follow-up, research, meeting prep, administrative, development)
  - Priority levels (low, medium, high) with color coding
  - Due date tracking with overdue indicators
  - Reminder system (15min, 1hour, 1day, 1week before)
  - Search and filter by title, contact, status, priority, and category
  - Link tasks to contacts, appointments, interactions, and deals
  - Task tags for organization
  - Estimated time tracking
  - Status change via dropdown on task cards
  - Task statistics dashboard
- **Dashboard**: Real-time statistics for contacts, appointments, tasks, and deals
- **Responsive Design**: Mobile-friendly interface with adaptive layouts
- **Data Persistence**: LocalStorage for offline data persistence

### 🚧 In Progress / Coming Soon
- **Enhanced Negotiation**: Deal tracking with values and probabilities

## Getting Started

### Prerequisites

- Node.js 16+ installed
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm start
```

3. Open browser to `http://localhost:3000`

## Project Structure

```
ican/
├── src/
│   ├── components/          # React components
│   │   ├── common/          # Reusable UI components
│   │   ├── layout/          # Layout components
│   │   ├── contacts/        # Contact management
│   │   ├── calendar/        # Calendar and appointments
│   │   ├── interactions/    # Interaction history
│   │   ├── tasks/           # Task management
│   │   ├── negotiations/    # Deal tracking
│   │   └── dashboard/       # Dashboard and analytics
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── context/            # React Context providers
│   ├── types/              # Type definitions
│   ├── styles/             # Global styles
│   ├── App.jsx             # Main application component
│   └── index.js            # Application entry point
├── docs/                   # Documentation
├── public/                 # Static assets
└── package.json            # Dependencies and scripts
```

## Documentation

Comprehensive documentation is available in the `docs/` folder:

- **Platform Overview**: `docs/platform-overview.md`
- **User Guides**: `docs/user-guide/`
  - Getting Started
  - Contacts Guide
  - Calendar Guide
  - Interactions Guide
  - Tasks Guide
  - Negotiations Guide
- **Technical Documentation**: `docs/technical/`
  - Architecture
  - Data Structures
  - API Reference
  - Component Library
- **Development Documentation**: `docs/development/`
  - Setup Guide
  - Coding Standards
  - Testing Guide
  - Deployment Guide
- **Troubleshooting**: `docs/troubleshooting.md`

## Technology Stack

- **Frontend**: React 18 with modern hooks
- **State Management**: React Context API
- **Styling**: CSS with custom design system
- **Date Handling**: Custom date utilities
- **Storage**: LocalStorage with optional cloud sync

## Color Scheme

The platform uses a color scheme that represents the four I-C-A-N pillars:

- **Interact (Blue)**: #5B8DEF - Communication and interactions
- **Contact (Green)**: #34D399 - Relationships and connections
- **Arrange (Orange)**: #F0B429 - Scheduling and organization
- **Negotiate (Purple)**: #8B5CF6 - Business and deals

## Contributing

Contributions are welcome! Please follow the coding standards outlined in the development documentation.

## License

Proprietary - All rights reserved

## Support

For support and troubleshooting, see the documentation in the `docs/` folder or contact the development team.
