# API Reference

Complete reference for all functions, hooks, and utilities available in the iCan platform.

## Context API

### AppContext

Global application state management using React Context API with MySQL database integration via API.

#### Context Value

```typescript
interface AppContextValue {
  // State
  contacts: Contact[];
  appointments: Appointment[];
  interactions: Interaction[];
  tasks: Task[];
  deals: Deal[];
  companies: Record<string, Company>;
  currentView: string;
  loading: boolean;
  error: string | null;

  // Actions (All API calls to MySQL database)
  addContact: (contact: Contact) => Promise<{success: boolean, contact?: Contact, error?: string}>;
  updateContact: (id: string, updates: Partial<Contact>) => Promise<{success: boolean, contact?: Contact, error?: string}>;
  deleteContact: (id: string) => Promise<{success: boolean, error?: string}>;
  addAppointment: (appointment: Appointment) => Promise<{success: boolean, appointment?: Appointment, error?: string}>;
  updateAppointment: (id: string, updates: Partial<Appointment>) => Promise<{success: boolean, appointment?: Appointment, error?: string}>;
  deleteAppointment: (id: string) => Promise<{success: boolean, error?: string}>;
  addInteraction: (interaction: Interaction) => Promise<{success: boolean, interaction?: Interaction, error?: string}>;
  updateInteraction: (id: string, updates: Partial<Interaction>) => Promise<{success: boolean, interaction?: Interaction, error?: string}>;
  deleteInteraction: (id: string) => Promise<{success: boolean, error?: string}>;
  addTask: (task: Task) => Promise<{success: boolean, task?: Task, error?: string}>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<{success: boolean, task?: Task, error?: string}>;
  deleteTask: (id: string) => Promise<{success: boolean, error?: string}>;
  addDeal: (deal: Deal) => Promise<{success: boolean, deal?: Deal, error?: string}>;
  updateDeal: (id: string, updates: Partial<Deal>) => Promise<{success: boolean, deal?: Deal, error?: string}>;
  deleteDeal: (id: string) => Promise<{success: boolean, error?: string}>;
  setCurrentView: (view: string) => void;
  loadData: () => Promise<void>;
}
```

### AdminAuthContext

Admin authentication context for platform management access.

#### Context Value

```typescript
interface AdminAuthContextValue {
  // State
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  adminLogin: (username: string, password: string) => Promise<{success: boolean, error?: string}>;
  adminLogout: () => void;
}
```

#### Usage

```jsx
import { useAdminAuthContext } from '../context/AdminAuthContext';

function AdminLogin() {
  const { adminLogin, admin, isAuthenticated } = useAdminAuthContext();

  const handleLogin = async () => {
    const result = await adminLogin('admin', 'password');
    if (result.success) {
      // Admin logged in successfully
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>Welcome, {admin?.name}</div>
      ) : (
        <button onClick={handleLogin}>Admin Login</button>
      )}
    </div>
  );
}
```

#### Usage

```jsx
import { useAppContext } from '../context/AppContext';

function MyComponent() {
  const { contacts, addContact, loading } = useAppContext();

  if (loading) return <div>Loading...</div>;

  const handleAddContact = () => {
    const newContact = emptyContact();
    newContact.name = 'John Doe';
    addContact(newContact);
  };

  return (
    <div>
      <button onClick={handleAddContact}>Add Contact</button>
      <ul>
        {contacts.map(contact => (
          <li key={contact.id}>{contact.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Custom Hooks

### useContacts

Hook for contact management operations.

```typescript
function useContacts(): {
  contacts: Contact[];
  addContact: (contact: Contact) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  getContact: (id: string) => Contact | undefined;
  searchContacts: (query: string) => Contact[];
  filterContacts: (filters: ContactFilters) => Contact[];
}
```

#### Example

```jsx
function ContactList() {
  const { contacts, searchContacts } = useContacts();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = searchContacts(searchQuery);

  return (
    <div>
      <input 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search contacts..."
      />
      <ul>
        {filteredContacts.map(contact => (
          <li key={contact.id}>{contact.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### useAppointments

Hook for appointment management operations.

```typescript
function useAppointments(): {
  appointments: Appointment[];
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  getAppointmentsForDate: (date: Date) => Appointment[];
  getAppointmentsForContact: (contactId: string) => Appointment[];
  getUpcomingAppointments: () => Appointment[];
}
```

### useInteractions

Hook for interaction management operations.

```typescript
function useInteractions(): {
  interactions: Interaction[];
  addInteraction: (interaction: Interaction) => void;
  updateInteraction: (id: string, updates: Partial<Interaction>) => void;
  deleteInteraction: (id: string) => void;
  getInteractionsForContact: (contactId: string) => Interaction[];
  getRecentInteractions: (limit?: number) => Interaction[];
}
```

### useTasks

Hook for task management operations.

```typescript
function useTasks(): {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTasksByStatus: (status: TaskStatus) => Task[];
  getTasksByPriority: (priority: TaskPriority) => Task[];
  getOverdueTasks: () => Task[];
  getTasksForContact: (contactId: string) => Task[];
}
```

### useDeals

Hook for deal management operations.

```typescript
function useDeals(): {
  deals: Deal[];
  addDeal: (deal: Deal) => void;
  updateDeal: (id: string, updates: Partial<Deal>) => void;
  deleteDeal: (id: string) => void;
  getDealsByStage: (stage: DealStage) => Deal[];
  getDealsForContact: (contactId: string) => Deal[];
  getPipelineValue: () => { total: number; weighted: number };
  getWonDeals: () => Deal[];
  getLostDeals: () => Deal[];
}
```

## API Functions

### Feedback API

Functions for user feedback submission and management.

```typescript
const feedbackAPI = {
  getAll: () => Promise<{feedback: Feedback[]}>;
  getById: (id: string) => Promise<{feedback: Feedback}>;
  submit: (feedbackData: FeedbackData) => Promise<{feedback: Feedback}>;
}
```

#### Usage

```jsx
import { feedbackAPI } from '../lib/api';

async function submitFeedback() {
  try {
    const result = await feedbackAPI.submit({
      subject: 'bug_report',
      category: 'login',
      content: 'Login page is not working',
      rating: 3,
      priority: 'high'
    });
    console.log('Feedback submitted:', result.feedback);
  } catch (error) {
    console.error('Failed to submit feedback:', error);
  }
}
```

### Admin API

Functions for admin platform management.

```typescript
const adminAPI = {
  getStats: () => Promise<{stats: AdminStats}>;
  getUsers: (filters?: UserFilters) => Promise<{users: User[], pagination: Pagination}>;
  getUserById: (id: string) => Promise<{user: User}>;
  updateUserPlan: (id: string, plan: string) => Promise<{success: boolean}>;
  deleteUser: (id: string) => Promise<{success: boolean}>;
  getFeedback: (filters?: FeedbackFilters) => Promise<{feedback: Feedback[], pagination: Pagination}>;
  replyToFeedback: (id: string, reply: string) => Promise<{feedback: Feedback}>;
  updateFeedbackStatus: (id: string, status: string) => Promise<{feedback: Feedback}>;
  updateFeedbackPriority: (id: string, priority: string) => Promise<{feedback: Feedback}>;
  deleteFeedback: (id: string) => Promise<{success: boolean}>;
  getNotifications: () => Promise<{notifications: Notification[], unreadCount: number}>;
  markNotificationRead: (id: string) => Promise<{success: boolean}>;
  markAllNotificationsRead: () => Promise<{success: boolean}>;
  deleteNotification: (id: string) => Promise<{success: boolean}>;
}
```

## Utility Functions

### Storage Utilities

#### `saveData(data: AppData): Promise<void>`

Save application data to localStorage.

```javascript
import { saveData } from '../utils/storage';

await saveData({
  contacts: [],
  appointments: [],
  interactions: [],
  tasks: [],
  deals: [],
  companies: {},
  settings: defaultSettings,
  version: '1.0.0'
});
```

#### `loadData(): Promise<AppData | null>`

Load application data from localStorage.

```javascript
import { loadData } from '../utils/storage';

const data = await loadData();
if (data) {
  console.log('Loaded', data.contacts.length, 'contacts');
}
```

#### `exportData(): Promise<string>`

Export data as JSON string.

```javascript
import { exportData } from '../utils/storage';

const jsonData = await exportData();
const blob = new Blob([jsonData], { type: 'application/json' });
const url = URL.createObjectURL(blob);
// Download logic...
```

#### `importData(jsonData: string): Promise<void>`

Import data from JSON string.

```javascript
import { importData } from '../utils/storage';

await importData(jsonString);
```

### Validation Utilities

#### `validateContact(contact: Contact): ValidationResult`

Validate contact data.

```javascript
import { validateContact } from '../utils/validation';

const result = validateContact(newContact);
if (!result.isValid) {
  console.error('Validation errors:', result.errors);
}
```

#### `validateAppointment(appointment: Appointment): ValidationResult`

Validate appointment data.

```javascript
import { validateAppointment } from '../utils/validation';

const result = validateAppointment(newAppointment);
if (!result.isValid) {
  console.error('Validation errors:', result.errors);
}
```

#### `validateTask(task: Task): ValidationResult`

Validate task data.

```javascript
import { validateTask } from '../utils/validation';

const result = validateTask(newTask);
if (!result.isValid) {
  console.error('Validation errors:', result.errors);
}
```

#### `validateDeal(deal: Deal): ValidationResult`

Validate deal data.

```javascript
import { validateDeal } from '../utils/validation';

const result = validateDeal(newDeal);
if (!result.isValid) {
  console.error('Validation errors:', result.errors);
}
```

### Date Utilities

#### `formatDate(date: Date | number, format: string): string`

Format date according to specified format.

```javascript
import { formatDate } from '../utils/helpers';

const formatted = formatDate(new Date(), 'YYYY-MM-DD');
// Returns: '2024-01-15'
```

#### `getWeekStart(date: Date): Date`

Get start of week for given date.

```javascript
import { getWeekStart } from '../utils/helpers';

const weekStart = getWeekStart(new Date());
```

#### `getWeekEnd(date: Date): Date`

Get end of week for given date.

```javascript
import { getWeekEnd } from '../utils/helpers';

const weekEnd = getWeekEnd(new Date());
```

#### `getMonthStart(date: Date): Date`

Get start of month for given date.

```javascript
import { getMonthStart } from '../utils/helpers';

const monthStart = getMonthStart(new Date());
```

#### `getMonthEnd(date: Date): Date`

Get end of month for given date.

```javascript
import { getMonthEnd } from '../utils/helpers';

const monthEnd = getMonthEnd(new Date());
```

### Search Utilities

#### `searchContacts(contacts: Contact[], query: string): Contact[]`

Search contacts by multiple fields.

```javascript
import { searchContacts } from '../utils/helpers';

const results = searchContacts(contacts, 'John');
// Searches name, company, email, phone
```

#### `filterByDateRange(items: any[], startDate: Date, endDate: Date, dateField: string): any[]`

Filter items by date range.

```javascript
import { filterByDateRange } from '../utils/helpers';

const filtered = filterByDateRange(appointments, startDate, endDate, 'startTime');
```

### Calculation Utilities

#### `calculateRelationshipStrength(contact: Contact, interactions: Interaction[]): number`

Calculate relationship strength score (0-100).

```javascript
import { calculateRelationshipStrength } from '../utils/helpers';

const strength = calculateRelationshipStrength(contact, interactions);
// Returns: 0-100 based on interaction frequency and recency
```

#### `calculatePipelineValue(deals: Deal[]): { total: number; weighted: number }`

Calculate total and weighted pipeline value.

```javascript
import { calculatePipelineValue } from '../utils/helpers';

const { total, weighted } = calculatePipelineValue(deals);
// Weighted = sum of (deal value * probability / 100)
```

#### `calculateTaskCompletionRate(tasks: Task[]): number`

Calculate task completion rate as percentage.

```javascript
import { calculateTaskCompletionRate } from '../utils/helpers';

const rate = calculateTaskCompletionRate(tasks);
// Returns: 0-100 percentage
```

## Component Props

### Button

Standard button component with variants.

```typescript
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  loading?: boolean;
}
```

### Modal

Modal dialog component.

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  showCloseButton?: boolean;
}
```

### Card

Card container component.

```typescript
interface CardProps {
  children: React.ReactNode;
  title?: string;
  actions?: React.ReactNode;
  padding?: 'none' | 'small' | 'medium' | 'large';
  hoverable?: boolean;
  onClick?: () => void;
}
```

### Form

Form input components.

```typescript
interface InputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'phone' | 'date' | 'datetime';
  disabled?: boolean;
  error?: string;
  required?: boolean;
}

interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  required?: boolean;
}

interface TextareaProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  error?: string;
  required?: boolean;
}
```

## Constants

### ICAN_COLORS

Color scheme for I-C-A-N pillars.

```javascript
export const ICAN_COLORS = {
  interact: '#5B8DEF',   // Blue
  contact: '#34D399',    // Green
  arrange: '#F0B429',    // Orange
  negotiate: '#8B5CF6'   // Purple
};
```

### UI_COLORS

General UI color scheme.

```javascript
export const UI_COLORS = {
  background: '#0B0E14',
  surface: '#141821',
  border: '#1B1F2B',
  textPrimary: '#E6E9F0',
  textSecondary: '#8B92A8',
  textMuted: '#545B70',
  success: '#34D399',
  warning: '#F0B429',
  error: '#E06166',
  info: '#5B8DEF'
};
```

### SPACING

Consistent spacing scale.

```javascript
export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px'
};
```

### FONT_SIZES

Typography scale.

```javascript
export const FONT_SIZES = {
  xs: '12px',
  sm: '14px',
  md: '16px',
  lg: '18px',
  xl: '24px',
  xxl: '32px',
  display: '48px'
};
```

## Error Handling

### Error Types

```typescript
class ValidationError extends Error {
  constructor(public field: string, message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageError';
  }
}

class NotFoundError extends Error {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`);
    this.name = 'NotFoundError';
  }
}
```

### Error Handling Example

```javascript
try {
  await saveData(data);
} catch (error) {
  if (error instanceof StorageError) {
    console.error('Storage error:', error.message);
    // Handle storage error
  } else {
    console.error('Unexpected error:', error);
    // Handle other errors
  }
}
```

## Performance Optimization

### Memoization

Use React.memo for expensive components:

```jsx
import React, { memo } from 'react';

const ExpensiveComponent = memo(function ExpensiveComponent({ data }) {
  // Expensive rendering logic
  return <div>{/* ... */}</div>;
});
```

### useMemo and useCallback

Optimize expensive calculations and callbacks:

```jsx
import { useMemo, useCallback } from 'react';

function MyComponent({ items }) {
  const sortedItems = useMemo(() => {
    return items.sort((a, b) => a.value - b.value);
  }, [items]);

  const handleClick = useCallback((id) => {
    console.log('Clicked', id);
  }, []);

  return <div>{/* ... */}</div>;
}
```

### Lazy Loading

Code splitting for heavy components:

```jsx
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

This API reference provides comprehensive documentation for all functions, hooks, and utilities available in the iCan platform.
