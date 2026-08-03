# iCan Platform

A comprehensive digital life and networking organization platform where the acronym represents: I (Interact), C (Contact/Connect), A (Arrange/Appointment), N (Negotiate).

## Version

**Current Version: 3.0.2** (MySQL migration and role system enhancement - 2026-08-03)

## Vision

The iCan platform helps professionals manage their relationships, appointments, tasks, and business negotiations in one unified system.

## Features

### ✅ Implemented
- **MySQL Database**: Complete database implementation with Prisma ORM
  - Multi-tenant architecture with tenant isolation
  - Comprehensive schema with 10 models (users, tenants, contacts, companies, appointments, interactions, tasks, deals, verification tokens, password reset tokens)
  - Performance indexes on frequently queried fields
  - Foreign key relationships with cascade/delete
  - JSON support for flexible data (tags, settings, etc.)
  - Database migration system
- **Express.js API Server**: RESTful API with authentication
  - Authentication endpoints (register, login, verify-email, profile management, account deletion)
  - Full CRUD operations for all entities
  - JWT authentication with secure token management
  - Multi-tenant isolation on all API routes
  - Protected routes with middleware
  - Error handling and validation
- **API Integration**: Complete frontend API integration
  - AuthContext uses API calls instead of localStorage
  - AppContext uses API calls for all CRUD operations
  - Centralized API client library with token management
  - Parallel data loading for better performance
  - Real-time data updates without localStorage polling
- **Authentication System**: Multi-tenant SaaS authentication
  - User registration with email/password
  - User login with validation
  - Email verification system (mock implementation)
  - Multi-tenant architecture with organization support
  - Protected routes for authenticated users
  - Session management with JWT tokens
  - User roles (Admin, Member, Viewer)
  - Logout functionality
- **Landing Page**: Comprehensive public-facing marketing page
  - Hero section with platform value proposition
  - Features grid showcasing I-C-A-N capabilities
  - Testimonials section with user reviews
  - Pricing section (Free, Pro, Enterprise tiers)
  - FAQ section with common questions
  - Call-to-action buttons for sign up and login
  - Theme toggle integration
  - Fully responsive design
- **User Profile System**: Complete user account management
  - Profile information display and editing
  - Avatar upload functionality
  - Password change modal
  - Tenant/organization information display
  - Email verification status
  - Security settings with logout
  - Account deletion with two-step confirmation
  - Type "DELETE ACCOUNT" confirmation (prevents copy/paste)
  - Password verification for account deletion
  - Comprehensive data cleanup on deletion
- **Theme Toggle**: Light/dark theme switching
  - Theme toggle button in header (works on all pages)
  - CSS variable-based theming system
  - Theme persistence in localStorage
  - Smooth theme transitions
  - System preference detection
  - Theme color meta tag updates
- **Header**: Enhanced header with logout functionality
  - Logout button in header action area
  - Consistent placement across all pages
  - Better accessibility than sidebar logout
- **Footer**: Consistent branding across all pages
  - "Developed with ❤️ By InfoLogix" branding
  - "All Rights Reserved © 2026" copyright notice
  - Responsive design
  - Integrated into all authenticated pages
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
- **Pipeline & Negotiations**: Deal tracking with sales pipeline
  - Pipeline view with seven stages (Prospecting, Qualification, Proposal, Negotiation, Closing, Won, Lost)
  - Deal creation and editing with comprehensive form
  - Deal value tracking with multiple currencies
  - Probability tracking with auto-suggestions based on stage
  - Expected close date tracking
  - Competitor tracking
  - Next steps management
  - Search and filter by name, contact, stage, and currency
  - Link deals to contacts
  - Deal tags for organization
  - Sales funnel visualization with stage totals
  - Deal statistics dashboard (total deals, pipeline value, won deals, won value, avg probability)
- **Companies View**: Company grouping and management
  - Company creation and editing with comprehensive form
  - Company information (name, industry, size, location, website, founded year, revenue, employee count)
  - Company cards with key information and stats
  - Company detail view with associated contacts and deals
  - Search and filter by name, industry, and size
  - Company tags for organization
  - Company overview with contact count, deal count, and pipeline value
  - Contact and deal association tracking
- **Dashboard**: Real-time statistics for contacts, appointments, tasks, and deals
- **Responsive Design**: Mobile-friendly interface with adaptive layouts
- **Data Persistence**: LocalStorage for offline data persistence
- **Backend-Ready Architecture**: Designed for future API integration

## Getting Started

### Prerequisites

- Node.js 16+ installed
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development servers (frontend + API):
```bash
npm run dev
```

3. Open browser to `http://localhost:3000`

The API server will run on `http://localhost:3001` and the frontend on `http://localhost:3000`.

### Development Setup

The platform uses a full-stack architecture with:
- **Frontend**: React (port 3000)
- **Backend**: Express.js API (port 3001)
- **Database**: PostgreSQL with Prisma ORM

To run components separately:
```bash
# Start API server only
npm run server

# Start frontend only
npm start
```

## Project Structure

```
ican/
├── src/
│   ├── components/          # React components
│   │   ├── common/          # Reusable UI components (Button, Modal, Form, Card, Footer, ThemeToggle)
│   │   ├── layout/          # Layout components (AppShell, Sidebar, Header)
│   │   ├── contacts/        # Contact management (ContactsView, ContactForm, ContactDetail, CompaniesView)
│   │   ├── calendar/        # Calendar and appointments (CalendarView, AppointmentForm)
│   │   ├── interactions/    # Interaction history (InteractionsView, InteractionForm)
│   │   ├── tasks/           # Task management (TasksView, TaskForm, KanbanBoard)
│   │   ├── negotiations/    # Deal tracking (DealsView, DealForm, PipelineView)
│   │   ├── user/            # User profile (UserProfile)
│   │   ├── auth/            # Authentication (LoginForm, RegisterForm, AuthLayout, EmailVerification, ProtectedRoute)
│   │   ├── landing/         # Landing page (LandingPage)
│   │   └── dashboard/       # Dashboard and analytics
│   ├── pages/               # Page components (LoginPage, RegisterPage, VerifyEmailPage, ProfilePage)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   │   ├── api.js          # API client library
│   │   ├── auth.js         # Authentication utilities
│   │   └── prisma.js       # Prisma client configuration
│   ├── utils/              # Utility functions
│   ├── context/            # React Context providers (AppContext, AuthContext)
│   ├── types/              # Type definitions (contacts, appointments, interactions, tasks, deals, companies, users, tenants)
│   ├── styles/             # Global styles
│   ├── App.jsx             # Main application component with routing
│   └── index.js            # Application entry point
├── scripts/                # Utility scripts
│   └── migrate-local-to-api.js  # Data migration script
├── prisma/                 # Prisma ORM configuration
│   ├── schema.prisma       # Database schema
│   ├── migrations/         # Database migrations
│   └── prisma.config.ts    # Prisma configuration
├── docs/                   # Documentation
├── public/                 # Static assets
├── server.js               # Express.js API server
└── package.json            # Dependencies and scripts
```

## Documentation

Comprehensive documentation is available in the `docs/` folder:

- **Platform Overview**: `docs/platform-overview.md`
- **User Guides**: `docs/user-guide/`
  - Getting Started
  - Authentication Guide
  - Contacts Guide
  - Calendar Guide
  - Interactions Guide
  - Tasks Guide
  - Negotiations Guide
- **Technical Documentation**: `docs/technical/`
  - Architecture
  - Data Storage
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
- **Routing**: React Router DOM for client-side routing
- **State Management**: React Context API (AppContext, AuthContext)
- **Authentication**: Custom auth system with multi-tenant support and JWT tokens
- **Database**: PostgreSQL with Prisma ORM
- **API**: Express.js RESTful API
- **Security**: bcryptjs for password hashing, jsonwebtoken for JWT
- **Styling**: CSS with custom design system and CSS variables for theming
- **Date Handling**: Custom date utilities
- **Type Safety**: Type definitions for all data structures

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
