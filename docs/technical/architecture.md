# iCan Platform Architecture

Technical documentation for the iCan platform architecture, component structure, and system design.

## System Architecture

### Overall Architecture

The iCan platform follows a modern React-based architecture with:

- **Component-Based UI**: Modular React components for maintainability
- **Context-Based State Management**: React Context API for global state
- **LocalStorage Persistence**: Client-side data storage
- **Modular Design**: Separated concerns and reusable components

### Technology Stack

- **Frontend Framework**: React 18.2.0
- **Build Tool**: React Scripts 5.0.1
- **State Management**: React Context API
- **Styling**: CSS with custom design system
- **Icons**: Lucide React 0.263.1
- **Date Handling**: date-fns 2.30.0
- **Type Safety**: PropTypes (with TypeScript interfaces in types/)

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
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   ├── context/             # React Context providers
│   ├── types/               # TypeScript interfaces/PropTypes
│   ├── styles/              # Global styles
│   ├── App.jsx              # Main application component
│   └── index.js             # Application entry point
├── docs/                    # Documentation
├── public/                  # Static assets
└── package.json             # Dependencies and scripts
```

## Component Architecture

### Component Hierarchy

```
App
└── AppProvider (Context)
    └── AppShell
        ├── Sidebar
        ├── Header
        └── Main Content Area
            ├── Dashboard
            ├── Contacts
            ├── Calendar
            ├── Interactions
            ├── Tasks
            ├── Pipeline
            └── Companies
```

### Component Categories

#### Common Components
Reusable UI components used across the application:

- **Button**: Standardized button with variants
- **Modal**: Modal dialog component
- **Form**: Form input components
- **Card**: Card container component
- **Badge**: Status and category badges
- **Avatar**: User/contact avatar display

#### Layout Components
Structural components for application layout:

- **AppShell**: Main application layout wrapper
- **Sidebar**: Navigation sidebar
- **Header**: Application header with actions
- **Navigation**: Navigation menu component

#### Feature Components
Domain-specific components for each feature area:

- **Contacts**: ContactList, ContactDetail, ContactForm
- **Calendar**: CalendarView, AppointmentForm, MonthView, WeekView, DayView
- **Interactions**: InteractionList, InteractionForm, InteractionTimeline
- **Tasks**: TaskDashboard, TaskBoard, TaskForm
- **Negotiations**: DealPipeline, DealForm, DealAnalytics
- **Dashboard**: Dashboard, StatsCards, AgendaView, ActivityFeed

## State Management

### Context Architecture

The application uses React Context API for state management:

#### AppContext
Global application state including:

- **contacts**: Array of contact objects
- **appointments**: Array of appointment objects
- **interactions**: Array of interaction objects
- **tasks**: Array of task objects
- **deals**: Array of deal objects
- **companies**: Object with company data
- **currentView**: Current active view
- **loading**: Loading state
- **error**: Error state

#### Context Actions

Actions available in AppContext:

- **addContact**: Create new contact
- **updateContact**: Update existing contact
- **deleteContact**: Remove contact
- **addAppointment**: Create new appointment
- **updateAppointment**: Update appointment
- **deleteAppointment**: Remove appointment
- **addInteraction**: Log new interaction
- **updateInteraction**: Update interaction
- **deleteInteraction**: Remove interaction
- **addTask**: Create new task
- **updateTask**: Update task
- **deleteTask**: Remove task
- **addDeal**: Create new deal
- **updateDeal**: Update deal
- **deleteDeal**: Remove deal
- **setCurrentView**: Change current view
- **loadData**: Load data from storage
- **saveData**: Save data to storage

### Custom Hooks

Custom hooks for accessing and manipulating state:

#### useContacts
- Access contacts array
- Contact CRUD operations
- Contact filtering and search

#### useAppointments
- Access appointments array
- Appointment CRUD operations
- Calendar date utilities

#### useInteractions
- Access interactions array
- Interaction CRUD operations
- Interaction filtering

#### useTasks
- Access tasks array
- Task CRUD operations
- Task filtering and sorting

#### useDeals
- Access deals array
- Deal CRUD operations
- Pipeline calculations

## Data Structures

### Contact Structure
```javascript
{
  id: string,
  name: string,
  phone: string,
  email: string,
  company: string,
  location: string,
  industry: string,
  source: 'whatsapp' | 'linkedin' | 'other',
  stage: 'New' | 'Contacted' | 'Meeting' | 'Negotiating' | 'Collaborating' | 'Archived',
  tags: string[],
  lastContactDate: timestamp,
  notes: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Appointment Structure
```javascript
{
  id: string,
  title: string,
  contactId: string,
  description: string,
  startTime: timestamp,
  endTime: timestamp,
  location: string,
  type: 'call' | 'meeting' | 'video' | 'email' | 'task' | 'other',
  recurrence: {
    frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'custom',
    interval: number,
    endDate: timestamp,
    occurrences: number
  },
  reminder: {
    timing: '15min' | '1hour' | '1day' | 'custom',
    customMinutes: number
  },
  status: 'scheduled' | 'completed' | 'cancelled',
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Interaction Structure
```javascript
{
  id: string,
  contactId: string,
  type: 'call' | 'email' | 'message' | 'meeting' | 'other',
  direction: 'inbound' | 'outbound',
  subject: string,
  content: string,
  timestamp: timestamp,
  duration: number,
  outcome: 'follow-up_required' | 'awaiting_response' | 'completed' | 'no_response' | 'not_interested' | 'custom',
  appointmentId: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Task Structure
```javascript
{
  id: string,
  title: string,
  description: string,
  status: 'todo' | 'in_progress' | 'review' | 'done',
  priority: 'low' | 'medium' | 'high',
  dueDate: timestamp,
  reminder: {
    timing: 'ontime' | '1day' | '3days' | '1week' | 'custom',
    customMinutes: number
  },
  estimatedTime: number,
  actualTime: number,
  contactId: string,
  category: 'follow-up' | 'research' | 'meeting_prep' | 'administrative' | 'development' | 'custom',
  tags: string[],
  linkedItems: {
    appointments: string[],
    interactions: string[],
    deals: string[]
  },
  createdAt: timestamp,
  updatedAt: timestamp,
  completedAt: timestamp
}
```

### Deal Structure
```javascript
{
  id: string,
  name: string,
  contactId: string,
  company: string,
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closing' | 'won' | 'lost',
  value: number,
  currency: string,
  probability: number,
  expectedCloseDate: timestamp,
  description: string,
  nextSteps: [{
    id: string,
    action: string,
    dueDate: timestamp,
    assignee: string,
    completed: boolean
  }],
  competitors: [{
    name: string,
    strengths: string,
    weaknesses: string,
    offering: string,
    pricing: string
  }],
  source: string,
  tags: string[],
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Data Persistence

### Storage Strategy

The application uses LocalStorage for data persistence:

- **Storage Key**: 'ican-data'
- **Data Format**: JSON
- **Auto-save**: Automatic save on state changes
- **Load on Startup**: Data loaded on application initialization

### Storage Structure
```javascript
{
  contacts: Contact[],
  appointments: Appointment[],
  interactions: Interaction[],
  tasks: Task[],
  deals: Deal[],
  companies: { [companyName]: string },
  settings: {
    theme: 'dark' | 'light',
    currency: string,
    dateFormat: string,
    defaultReminder: string
  },
  version: string
}
```

### Backup and Restore

- **Export**: Export data to JSON file
- **Import**: Import data from JSON file
- **Backup**: Automatic backup creation
- **Restore**: Restore from backup

## Styling Architecture

### Design System

The platform uses a custom design system with:

- **Color Palette**: I-C-A-N themed colors
- **Typography**: Space Grotesk, Inter, JetBrains Mono
- **Spacing**: Consistent spacing scale
- **Components**: Reusable component styles
- **Responsive**: Mobile-first responsive design

### Color Scheme

- **Interact (Blue)**: #5B8DEF
- **Contact (Green)**: #34D399
- **Arrange (Orange)**: #F0B429
- **Negotiate (Purple)**: #8B5CF6
- **Background**: #0B0E14
- **Surface**: #141821
- **Border**: #1B1F2B
- **Text Primary**: #E6E9F0
- **Text Secondary**: #8B92A8

### Typography

- **Display**: Space Grotesk (headings, titles)
- **Body**: Inter (body text, UI elements)
- **Mono**: JetBrains Mono (code, data, numbers)

## Performance Considerations

### Optimization Strategies

- **Code Splitting**: Lazy loading for heavy components
- **Memoization**: React.memo for expensive components
- **Virtual Scrolling**: For long lists
- **Debouncing**: For search inputs
- **Lazy Loading**: Progressive data loading

### Large Dataset Handling

- **Pagination**: For large contact/task lists
- **Indexing**: Indexed data structures for search
- **Caching**: Computed values caching
- **Cleanup**: Old data archival

## Security Considerations

### Client-Side Security

- **Input Validation**: All user inputs validated
- **XSS Prevention**: React's built-in XSS protection
- **Data Sanitization**: Data sanitization before storage
- **Secure Storage**: Sensitive data handling considerations

### Data Privacy

- **Local Storage**: Data stored locally on user device
- **No Cloud Sync**: Optional cloud sync with user consent
- **Export Control**: User controls data export
- **Clear Data**: User can clear all data

## Accessibility

### WCAG Compliance

- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader**: ARIA labels and roles
- **Color Contrast**: WCAG AA compliant contrast ratios
- **Focus Management**: Proper focus handling
- **Semantic HTML**: Proper semantic elements

## Browser Compatibility

### Supported Browsers

- **Chrome**: Latest 2 versions
- **Firefox**: Latest 2 versions
- **Safari**: Latest 2 versions
- **Edge**: Latest 2 versions

### Progressive Enhancement

- **Core Functionality**: Works without JavaScript
- **Enhanced Experience**: Enhanced with JavaScript
- **Fallbacks**: Graceful degradation for older browsers

## Testing Strategy

### Testing Levels

- **Unit Tests**: Component and function testing
- **Integration Tests**: Feature integration testing
- **E2E Tests**: End-to-end user flows
- **Accessibility Tests**: Accessibility compliance testing

### Testing Tools

- **Jest**: Unit testing framework
- **React Testing Library**: Component testing
- **Cypress**: E2E testing
- **axe**: Accessibility testing

## Deployment

### Build Process

- **Development**: `npm start` - Development server
- **Production**: `npm run build` - Production build
- **Test**: `npm test` - Run tests

### Deployment Targets

- **Static Hosting**: Netlify, Vercel, GitHub Pages
- **CDN**: CDN deployment for static assets
- **PWA**: Progressive Web App capabilities

## Future Enhancements

### Planned Improvements

- **TypeScript Migration**: Full TypeScript adoption
- **State Management**: Redux or Zustand for complex state
- **Backend Integration**: API integration for cloud features
- **Real-time Sync**: WebSocket for real-time updates
- **Offline Support**: Service Worker for offline functionality
- **Mobile App**: React Native mobile application

### Scalability Considerations

- **Database Integration**: Backend database for large datasets
- **API Architecture**: RESTful API design
- **Authentication**: User authentication and authorization
- **Multi-tenancy**: Support for multiple users/organizations
