# iCan Platform

A comprehensive digital life and networking organization platform where the acronym represents: I (Interact), C (Contact/Connect), A (Arrange/Appointment), N (Negotiate).

## Vision

The iCan platform helps professionals manage their relationships, appointments, tasks, and business negotiations in one unified system.

## Features

- **Contact Management**: Comprehensive contact profiles with detailed information
- **Calendar & Appointments**: Full calendar integration with recurring events
- **Interaction History**: Complete log of all interactions with contacts
- **Task Management**: Kanban-style task board with priority tracking
- **Enhanced Negotiation**: Deal tracking with values and probabilities
- **Dashboard**: I-C-A-N focused metrics and insights

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
