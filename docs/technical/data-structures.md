# Data Structures Reference

Complete reference for all data structures used in the iCan platform.

## Overview

The iCan platform uses a consistent data structure design with:

- **Unique Identifiers**: All entities have unique `id` fields
- **Timestamps**: Creation and update timestamps for tracking
- **Relationships**: Foreign key relationships between entities
- **Validation**: Type validation and required field enforcement
- **Extensibility**: Optional fields for future enhancements

## Core Data Types

### BaseEntity

Base structure for all entities:

```typescript
interface BaseEntity {
  id: string;              // Unique identifier
  createdAt: number;       // Creation timestamp (Unix epoch)
  updatedAt: number;       // Last update timestamp (Unix epoch)
}
```

## Contact Data Structure

### Contact

Complete contact information:

```typescript
interface Contact extends BaseEntity {
  // Basic Information
  name: string;                    // Required: Full name
  phone?: string;                 // Optional: Phone number
  email?: string;                 // Optional: Email address
  company?: string;               // Optional: Company name
  location?: string;              // Optional: Geographic location
  industry?: string;              // Optional: Industry sector

  // Professional Details
  source: 'whatsapp' | 'linkedin' | 'other';  // Required: Contact source
  stage: ContactStage;            // Required: Relationship stage
  tags: string[];                 // Optional: Custom tags
  lastContactDate?: number;       // Optional: Last interaction timestamp

  // Additional Information
  notes?: string;                 // Optional: Free-form notes
  relationshipStrength?: number;  // Optional: Calculated strength (0-100)
}

type ContactStage = 'New' | 'Contacted' | 'Meeting' | 'Negotiating' | 'Collaborating' | 'Archived';
```

### ContactValidation

Validation rules for contacts:

```typescript
const contactValidation = {
  name: {
    required: true,
    minLength: 1,
    maxLength: 100
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    maxLength: 100
  },
  phone: {
    pattern: /^\+?[\d\s\-()]+$/,
    maxLength: 20
  },
  company: {
    maxLength: 100
  },
  notes: {
    maxLength: 2000
  }
};
```

## Appointment Data Structure

### Appointment

Calendar appointment with full scheduling capabilities:

```typescript
interface Appointment extends BaseEntity {
  // Basic Information
  title: string;                  // Required: Appointment title
  contactId?: string;             // Optional: Related contact ID
  description?: string;           // Optional: Detailed description

  // Scheduling
  startTime: number;              // Required: Start timestamp
  endTime: number;                // Required: End timestamp
  location?: string;              // Optional: Physical or virtual location
  type: AppointmentType;          // Required: Appointment type

  // Recurrence
  recurrence?: RecurrencePattern; // Optional: Recurrence settings

  // Reminders
  reminder?: Reminder;            // Optional: Reminder settings

  // Status
  status: AppointmentStatus;      // Required: Current status
}

type AppointmentType = 'call' | 'meeting' | 'video' | 'email' | 'task' | 'other';
type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';

interface RecurrencePattern {
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'custom';
  interval: number;               // Number of periods between occurrences
  endDate?: number;               // Optional: End date for recurrence
  occurrences?: number;           // Optional: Total number of occurrences
  customDays?: number[];          // Optional: Custom days (0-6, Sunday-Saturday)
}

interface Reminder {
  timing: '15min' | '1hour' | '1day' | 'custom';
  customMinutes?: number;        // Required if timing is 'custom'
}
```

### AppointmentValidation

Validation rules for appointments:

```typescript
const appointmentValidation = {
  title: {
    required: true,
    minLength: 1,
    maxLength: 200
  },
  startTime: {
    required: true,
    type: 'timestamp'
  },
  endTime: {
    required: true,
    type: 'timestamp',
    custom: (value, field) => value > field.startTime
  },
  description: {
    maxLength: 2000
  },
  location: {
    maxLength: 500
  }
};
```

## Interaction Data Structure

### Interaction

Complete interaction logging:

```typescript
interface Interaction extends BaseEntity {
  // Basic Information
  contactId: string;              // Required: Related contact ID
  type: InteractionType;          // Required: Interaction type
  direction: InteractionDirection; // Required: Communication direction

  // Content
  subject?: string;               // Optional: Interaction subject
  content?: string;               // Optional: Detailed content
  timestamp: number;             // Required: When interaction occurred

  // Duration (for calls/meetings)
  duration?: number;              // Optional: Duration in minutes

  // Outcome
  outcome: InteractionOutcome;    // Required: Interaction result

  // Links
  appointmentId?: string;         // Optional: Related appointment ID
}

type InteractionType = 'call' | 'email' | 'message' | 'meeting' | 'other';
type InteractionDirection = 'inbound' | 'outbound';
type InteractionOutcome = 'follow-up_required' | 'awaiting_response' | 'completed' | 'no_response' | 'not_interested' | 'custom';
```

### InteractionValidation

Validation rules for interactions:

```typescript
const interactionValidation = {
  contactId: {
    required: true,
    exists: 'contacts'
  },
  subject: {
    maxLength: 200
  },
  content: {
    maxLength: 5000
  },
  duration: {
    min: 0,
    max: 1440  // Max 24 hours
  }
};
```

## Task Data Structure

### Task

Comprehensive task management:

```typescript
interface Task extends BaseEntity {
  // Basic Information
  title: string;                  // Required: Task title
  description?: string;           // Optional: Detailed description

  // Status and Priority
  status: TaskStatus;             // Required: Current status
  priority: TaskPriority;         // Required: Priority level

  // Scheduling
  dueDate?: number;               // Optional: Due timestamp
  reminder?: Reminder;             // Optional: Reminder settings

  // Time Tracking
  estimatedTime?: number;         // Optional: Estimated minutes
  actualTime?: number;            // Optional: Actual minutes spent

  // Context
  contactId?: string;             // Optional: Related contact ID
  category: TaskCategory;         // Required: Task category
  tags: string[];                 // Optional: Custom tags

  // Linked Items
  linkedItems?: {
    appointments?: string[];      // Related appointment IDs
    interactions?: string[];      // Related interaction IDs
    deals?: string[];             // Related deal IDs
  };

  // Completion
  completedAt?: number;           // Optional: Completion timestamp
}

type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
type TaskPriority = 'low' | 'medium' | 'high';
type TaskCategory = 'follow-up' | 'research' | 'meeting_prep' | 'administrative' | 'development' | 'custom';
```

### TaskValidation

Validation rules for tasks:

```typescript
const taskValidation = {
  title: {
    required: true,
    minLength: 1,
    maxLength: 200
  },
  description: {
    maxLength: 2000
  },
  dueDate: {
    type: 'timestamp',
    custom: (value) => value > Date.now()
  },
  estimatedTime: {
    min: 0,
    max: 10080  // Max 1 week in minutes
  }
};
```

## Deal Data Structure

### Deal

Business opportunity and negotiation tracking:

```typescript
interface Deal extends BaseEntity {
  // Basic Information
  name: string;                   // Required: Deal name
  contactId: string;              // Required: Primary contact ID
  company?: string;               // Optional: Company name
  stage: DealStage;               // Required: Pipeline stage

  // Value and Probability
  value: number;                  // Required: Deal value
  currency: string;               // Required: Currency code (ISO 4217)
  probability: number;            // Required: Win probability (0-100)

  // Timing
  expectedCloseDate?: number;     // Optional: Expected close timestamp

  // Details
  description?: string;           // Optional: Deal description
  nextSteps?: NextStep[];         // Optional: Planned next steps
  competitors?: Competitor[];     // Optional: Competitor information
  source?: string;                // Optional: Deal source
  tags: string[];                 // Optional: Custom tags
}

type DealStage = 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closing' | 'won' | 'lost';

interface NextStep {
  id: string;
  action: string;
  dueDate?: number;
  assignee?: string;
  completed: boolean;
}

interface Competitor {
  name: string;
  strengths?: string;
  weaknesses?: string;
  offering?: string;
  pricing?: string;
}
```

### DealValidation

Validation rules for deals:

```typescript
const dealValidation = {
  name: {
    required: true,
    minLength: 1,
    maxLength: 200
  },
  contactId: {
    required: true,
    exists: 'contacts'
  },
  value: {
    required: true,
    min: 0
  },
  probability: {
    required: true,
    min: 0,
    max: 100
  },
  currency: {
    required: true,
    pattern: /^[A-Z]{3}$/,
    default: 'USD'
  }
};
```

## Company Data Structure

### Company

Company-level information:

```typescript
interface Company {
  name: string;                   // Required: Company name
  notes?: string;                 // Optional: Company-level notes
  industry?: string;              // Optional: Industry sector
  size?: string;                  // Optional: Company size
  location?: string;              // Optional: Headquarters location
  website?: string;               // Optional: Company website
  createdAt: number;              // Creation timestamp
  updatedAt: number;              // Last update timestamp
}
```

## Settings Data Structure

### UserSettings

Application-wide settings:

```typescript
interface UserSettings {
  // Appearance
  theme: 'dark' | 'light';        // UI theme preference

  // Regional
  currency: string;               // Default currency (ISO 4217)
  dateFormat: string;            // Date format preference
  timezone: string;               // User timezone

  // Defaults
  defaultReminder: string;        // Default reminder timing
  defaultTaskCategory: string;    // Default task category
  defaultAppointmentType: string; // Default appointment type

  // Calendar
  calendarStartHour: number;      // Calendar day start hour (0-23)
  calendarEndHour: number;        // Calendar day end hour (0-23)
  weekStartDay: number;           // Week start day (0-6, Sunday-Saturday)

  // Notifications
  enableNotifications: boolean;   // Enable browser notifications
  notificationSound: boolean;     // Enable notification sounds

  // Data
  autoBackup: boolean;            // Enable automatic backups
  backupFrequency: string;        // Backup frequency
  lastBackup: number;             // Last backup timestamp
}
```

## Storage Data Structure

### AppData

Complete application data structure for storage:

```typescript
interface AppData {
  // Entity Arrays
  contacts: Contact[];
  appointments: Appointment[];
  interactions: Interaction[];
  tasks: Task[];
  deals: Deal[];

  // Company Data
  companies: Record<string, Company>;

  // Settings
  settings: UserSettings;

  // Metadata
  version: string;                // Data format version
  lastSync: number;              // Last sync timestamp
}
```

## Utility Types

### DateRange

Date range for filtering:

```typescript
interface DateRange {
  start: number;
  end: number;
}
```

### FilterOptions

Generic filter options:

```typescript
interface FilterOptions {
  search?: string;                // Search query
  filters?: Record<string, any>;  // Field-specific filters
  dateRange?: DateRange;         // Date range filter
  sortBy?: string;                // Sort field
  sortOrder?: 'asc' | 'desc';    // Sort order
  limit?: number;                 // Result limit
  offset?: number;                // Result offset
}
```

### PaginationOptions

Pagination for large datasets:

```typescript
interface PaginationOptions {
  page: number;                   // Current page (1-based)
  pageSize: number;              // Items per page
  totalItems?: number;           // Total items (optional)
}
```

### ApiResponse

Standard API response structure:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

## Data Migration

### Migration Versions

Version history for data structure changes:

```typescript
interface Migration {
  version: string;                // Target version
  description: string;            // Migration description
  migrate: (data: any) => any;    // Migration function
}

const migrations: Migration[] = [
  {
    version: '1.0.0',
    description: 'Initial data structure',
    migrate: (data) => data
  },
  // Future migrations...
];
```

## Index Structures

### ContactIndex

Indexed contact data for fast lookup:

```typescript
interface ContactIndex {
  byId: Record<string, Contact>;
  byCompany: Record<string, string[]>;
  byStage: Record<ContactStage, string[]>;
  bySource: Record<string, string[]>;
  byTag: Record<string, string[]>;
}
```

### AppointmentIndex

Indexed appointment data:

```typescript
interface AppointmentIndex {
  byId: Record<string, Appointment>;
  byContact: Record<string, string[]>;
  byDate: Record<string, string[]>;  // Date string -> IDs
  byType: Record<AppointmentType, string[]>;
  upcoming: string[];                  // IDs of upcoming appointments
}
```

## Computed Fields

### ContactStats

Computed contact statistics:

```typescript
interface ContactStats {
  totalContacts: number;
  activeContacts: number;
  newContactsThisWeek: number;
  contactsByStage: Record<ContactStage, number>;
  contactsBySource: Record<string, number>;
  averageRelationshipStrength: number;
}
```

### PipelineStats

Computed pipeline statistics:

```typescript
interface PipelineStats {
  totalDeals: number;
  totalValue: number;
  weightedValue: number;
  dealsByStage: Record<DealStage, number>;
  averageDealSize: number;
  averageProbability: number;
  expectedCloseValue: number;
}
```

## Validation Utilities

### Validation Result

Standard validation result:

```typescript
interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
  warnings: Record<string, string[]>;
}
```

### Validation Functions

Common validation utilities:

```typescript
const validators = {
  required: (value: any) => value !== null && value !== undefined && value !== '',
  email: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  phone: (value: string) => /^\+?[\d\s\-()]+$/.test(value),
  timestamp: (value: number) => !isNaN(value) && value > 0,
  futureDate: (value: number) => value > Date.now(),
  pastDate: (value: number) => value < Date.now(),
  range: (value: number, min: number, max: number) => value >= min && value <= max,
  minLength: (value: string, min: number) => value.length >= min,
  maxLength: (value: string, max: number) => value.length <= max
};
```

This data structure reference provides a complete foundation for implementing the iCan platform with type safety, validation, and consistent patterns across all entities.
