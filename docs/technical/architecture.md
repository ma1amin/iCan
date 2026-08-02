# iCan Platform Architecture

Technical documentation for the iCan platform architecture, component structure, and system design.

## System Architecture

### Overall Architecture

The iCan platform follows a modern React-based architecture with:

- **Component-Based UI**: Modular React components for maintainability
- **Context-Based State Management**: React Context API for global state (AppContext, AuthContext)
- **Client-Side Routing**: React Router DOM for navigation and route protection
- **Multi-Tenant Architecture**: Organization-based data isolation
- **LocalStorage Persistence**: Client-side data storage with backend-ready design
- **Modular Design**: Separated concerns and reusable components
- **Authentication System**: User registration, login, and email verification
- **Theme System**: CSS variable-based theming with light/dark modes

### Technology Stack

- **Frontend Framework**: React 18.2.0
- **Build Tool**: React Scripts 5.0.1
- **Routing**: React Router DOM
- **State Management**: React Context API (AppContext, AuthContext)
- **Authentication**: Custom multi-tenant auth system
- **Styling**: CSS with custom design system and CSS variables
- **Icons**: Lucide React 0.263.1
- **Date Handling**: date-fns 2.30.0
- **Type Safety**: PropTypes (with TypeScript interfaces in types/)
- **Storage**: LocalStorage with backend-ready architecture

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
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   ├── context/             # React Context providers (AppContext, AuthContext)
│   ├── types/               # Type definitions (contacts, appointments, interactions, tasks, deals, companies, users, tenants)
│   ├── styles/              # Global styles
│   ├── App.jsx              # Main application component with routing
│   └── index.js             # Application entry point
├── docs/                    # Documentation
├── public/                  # Static assets
└── package.json             # Dependencies and scripts
```

## Component Architecture

### Component Hierarchy

```
App (with React Router)
├── AuthProvider (Authentication Context)
│   ├── Public Routes
│   │   ├── LandingPage
│   │   ├── LoginPage
│   │   ├── RegisterPage
│   │   └── VerifyEmailPage
│   └── Protected Routes (with ProtectedRoute)
│       └── AppProvider (Application Context)
│           └── AppShell
│               ├── Sidebar
│               ├── Header
│               ├── Main Content Area
│               │   ├── Dashboard
│               │   ├── Contacts
│               │   ├── Calendar
│               │   ├── Interactions
│               │   ├── Tasks
│               │   ├── Pipeline
│               │   ├── Companies
│               │   └── ProfilePage
│               └── Footer
```

### Component Categories

#### Common Components
Reusable UI components used across the application:

- **Button**: Standardized button with variants (primary, secondary, ghost, danger)
- **Modal**: Modal dialog component
- **Form**: Form input components (Input, Select, Textarea, Checkbox)
- **Card**: Card container component
- **Footer**: Footer component with branding
- **ThemeToggle**: Theme toggle button for light/dark mode switching

#### Layout Components
Structural components for application layout:

- **AppShell**: Main application layout wrapper
- **Sidebar**: Navigation sidebar with user menu and logout
- **Header**: Page header with title, actions, and theme toggle

#### Authentication Components
User authentication and account management:

- **AuthLayout**: Layout for authentication pages
- **LoginForm**: User login form
- **RegisterForm**: User registration form
- **EmailVerification**: Email verification component
- **ProtectedRoute**: Route protection wrapper
- **UserProfile**: User profile management

#### Feature Components
Domain-specific components for each feature area:

- **Contacts**: ContactsView, ContactDetail, ContactForm, CompaniesView, CompanyDetail, CompanyForm
- **Calendar**: CalendarView, AppointmentForm
- **Interactions**: InteractionsView, InteractionForm
- **Tasks**: TasksView, TaskForm, KanbanBoard
- **Negotiations**: DealsView, DealForm, PipelineView
- **Dashboard**: Dashboard
- **Landing**: LandingPage

## State Management

### Context Architecture

The application uses React Context API for state management with two main contexts:

#### AuthContext
Authentication and user management state:

- **user**: Current authenticated user object
- **tenant**: Current user's organization/tenant
- **isAuthenticated**: Authentication status
- **isLoading**: Loading state for auth operations
- **error**: Authentication error state

#### AuthContext Actions
- **register**: Create new user account and organization
- **login**: Authenticate user with email/password
- **addCompany**: Create new company
- **updateCompany**: Update company
- **deleteCompany**: Remove company
- **setCurrentView**: Change current view
- **updateSettings**: Update application settings
- **toggleTheme**: Switch between light/dark themes
- **loadData**: Load data from storage
- **saveData**: Save data to storage

### Custom Hooks

Custom hooks for accessing and manipulating state:

#### useAuthContext
- Access authentication state
- User login/logout operations
- Profile management
- Email verification

#### useAppContext
- Access application state
- All CRUD operations for contacts, appointments, interactions, tasks, deals, companies
- Settings management
- Theme toggling
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

### User Structure
```javascript
{
  id: string,
  email: string,
  password: string,
  name: string,
  tenantId: string,
  role: 'admin' | 'member' | 'viewer',
  emailVerified: boolean,
  avatar: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Tenant Structure
```javascript
{
  id: string,
  name: string,
  slug: string,
  plan: 'free' | 'pro' | 'enterprise',
  settings: {
    theme: 'dark' | 'light',
    currency: string,
    dateFormat: string,
    timezone: string
  },
  createdBy: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

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

The application uses LocalStorage for data persistence with a multi-tenant architecture:

- **Application Data**: 'ican-data' key for application state
- **Authentication Data**: 'ican-auth' key for user sessions
- **User Data**: 'ican-users' key for user accounts
- **Tenant Data**: 'ican-tenants' key for organizations
- **Verification Tokens**: 'ican-verification-tokens' key for email verification
- **Data Format**: JSON
- **Auto-save**: Automatic save on state changes
- **Load on Startup**: Data loaded on application initialization

### Application Data Structure
```javascript
{
  contacts: Contact[],
  appointments: Appointment[],
  interactions: Interaction[],
  tasks: Task[],
  deals: Deal[],
  companies: Company[],
  settings: {
    theme: 'dark' | 'light',
    currency: string,
    dateFormat: string,
    defaultReminder: string
  },
  version: string
}
```

### Authentication Data Structure
```javascript
{
  user: User,
  tenant: Tenant,
  lastSync: timestamp
}
```

### Multi-Tenant Data Isolation

- All data entities will include `tenantId` for organization isolation
- Data filtering by tenant in data access layer
- Future backend integration will enforce tenant isolation at API level

### Backup and Restore

- **Export**: Export data to JSON file
- **Import**: Import data from JSON file
- **Backup**: Automatic backup creation
- **Restore**: Restore from backup

## Routing Architecture

### Route Structure

The application uses React Router DOM for client-side routing:

#### Public Routes
- `/` - Landing page
- `/login` - User login
- `/register` - User registration
- `/verify-email` - Email verification

#### Protected Routes
- `/dashboard` - Main dashboard
- `/contacts` - Contact management
- `/calendar` - Calendar and appointments
- `/interactions` - Interaction history
- `/tasks` - Task management
- `/pipeline` - Deal pipeline
- `/companies` - Company management
- `/profile` - User profile

### Route Protection

- **ProtectedRoute Component**: Wraps protected routes
- **Authentication Check**: Redirects unauthenticated users to login
- **Loading States**: Shows loading during auth checks
- **Redirect Logic**: Preserves intended destination after login

## Theme System

### CSS Variable Architecture

The platform uses CSS variables for theming:

#### Theme Variables
```css
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

### Authentication Security

- **Password Validation**: Minimum 8 characters required
- **Email Verification**: Email verification system for account activation
- **Session Management**: Secure session handling with localStorage
- **Multi-Tenant Isolation**: Organization-based data separation
- **Protected Routes**: Route protection for authenticated users
- **Backend-Ready**: Designed for secure backend integration

### Client-Side Security

- **Input Validation**: All user inputs validated
- **XSS Prevention**: React's built-in XSS protection
- **Data Sanitization**: Data sanitization before storage
- **Secure Storage**: Sensitive data handling considerations

### Data Privacy

- **Local Storage**: Data stored locally on user device
- **Multi-Tenant Isolation**: Data isolated by organization
- **Export Control**: User controls data export
- **Account Deletion**: User can delete account and data
- **Backend-Ready**: Designed for secure backend integration

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
