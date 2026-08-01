# Component Library Reference

Complete reference for all reusable UI components in the iCan platform.

## Component Categories

### Common Components
Reusable UI components used across the application.

### Layout Components
Structural components for application layout.

### Feature Components
Domain-specific components for each feature area.

## Common Components

### Button

Standardized button component with multiple variants.

#### Props

```typescript
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}
```

#### Variants

- **primary**: Main action button, blue background
- **secondary**: Secondary action, gray background
- **ghost**: Transparent background, visible on hover
- **danger**: Destructive action, red background

#### Sizes

- **small**: Compact button (32px height)
- **medium**: Standard button (40px height)
- **large**: Large button (48px height)

#### Examples

```jsx
// Primary button
<Button variant="primary" onClick={handleClick}>
  Save Changes
</Button>

// Button with icon
<Button variant="secondary" icon={<Plus />}>
  Add Item
</Button>

// Loading state
<Button variant="primary" loading={isLoading}>
  Processing
</Button>

// Danger button
<Button variant="danger" onClick={handleDelete}>
  Delete
</Button>
```

### Modal

Modal dialog component for overlays and dialogs.

#### Props

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}
```

#### Sizes

- **small**: 400px max width
- **medium**: 600px max width
- **large**: 800px max width

#### Examples

```jsx
<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Edit Contact"
  size="medium"
>
  <ContactForm contact={selectedContact} onSave={handleSave} />
</Modal>
```

### Card

Card container component for grouping content.

#### Props

```typescript
interface CardProps {
  children: React.ReactNode;
  title?: string;
  actions?: React.ReactNode;
  padding?: 'none' | 'small' | 'medium' | 'large';
  hoverable?: boolean;
  onClick?: () => void;
  border?: boolean;
}
```

#### Examples

```jsx
// Basic card
<Card>
  <p>Card content here</p>
</Card>

// Card with title and actions
<Card
  title="Contact Information"
  actions={<Button onClick={handleEdit}>Edit</Button>}
>
  <ContactDetails contact={contact} />
</Card>

// Hoverable card
<Card hoverable onClick={handleCardClick}>
  <ContactSummary contact={contact} />
</Card>
```

### Badge

Status and category badge component.

#### Props

```typescript
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'small' | 'medium';
  color?: string;
}
```

#### Variants

- **default**: Gray badge
- **success**: Green badge
- **warning**: Orange badge
- **error**: Red badge
- **info**: Blue badge

#### Examples

```jsx
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge color="#5B8DEF">Custom</Badge>
```

### Avatar

User/contact avatar display component.

#### Props

```typescript
interface AvatarProps {
  name?: string;
  src?: string;
  size?: 'small' | 'medium' | 'large';
  initials?: string;
  onClick?: () => void;
}
```

#### Sizes

- **small**: 32px diameter
- **medium**: 40px diameter
- **large**: 48px diameter

#### Examples

```jsx
// With initials
<Avatar name="John Doe" size="medium" />

// With image
<Avatar src="/path/to/image.jpg" size="large" />

// Custom initials
<Avatar initials="JD" size="small" />
```

### Icon

Icon wrapper component using Lucide icons.

#### Props

```typescript
interface IconProps {
  name: string;
  size?: number;
  color?: string;
  onClick?: () => void;
}
```

#### Examples

```jsx
<Icon name="User" size={20} />
<Icon name="Settings" size={24} color="#8B92A8" />
<Icon name="X" size={16} onClick={handleClose} />
```

## Form Components

### Input

Standard text input component.

#### Props

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
  fullWidth?: boolean;
  icon?: React.ReactNode;
}
```

#### Examples

```jsx
<Input
  label="Name"
  value={name}
  onChange={setName}
  placeholder="Enter name"
  required
/>

<Input
  label="Email"
  type="email"
  value={email}
  onChange={setEmail}
  error={emailError}
  icon={<Mail />}
/>
```

### Select

Dropdown select component.

#### Props

```typescript
interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  fullWidth?: boolean;
}
```

#### Examples

```jsx
<Select
  label="Status"
  value={status}
  onChange={setStatus}
  options={[
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ]}
/>
```

### Textarea

Multi-line text input component.

#### Props

```typescript
interface TextareaProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  fullWidth?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
}
```

#### Examples

```jsx
<Textarea
  label="Notes"
  value={notes}
  onChange={setNotes}
  placeholder="Enter notes..."
  rows={4}
/>
```

### Checkbox

Checkbox input component.

#### Props

```typescript
interface CheckboxProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  error?: string;
}
```

#### Examples

```jsx
<Checkbox
  label="Enable notifications"
  checked={notificationsEnabled}
  onChange={setNotificationsEnabled}
/>
```

### DatePicker

Date picker component.

#### Props

```typescript
interface DatePickerProps {
  label?: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  fullWidth?: boolean;
  minDate?: Date;
  maxDate?: Date;
}
```

#### Examples

```jsx
<DatePicker
  label="Due Date"
  value={dueDate}
  onChange={setDueDate}
  minDate={new Date()}
/>
```

## Layout Components

### AppShell

Main application layout wrapper.

#### Props

```typescript
interface AppShellProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
}
```

#### Examples

```jsx
<AppShell
  sidebar={<Sidebar />}
  header={<Header />}
>
  <MainContent />
</AppShell>
```

### Sidebar

Navigation sidebar component.

#### Props

```typescript
interface SidebarProps {
  items: NavItem[];
  currentView: string;
  onViewChange: (view: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}
```

#### Examples

```jsx
<Sidebar
  items={navItems}
  currentView={currentView}
  onViewChange={setCurrentView}
  isOpen={sidebarOpen}
  onClose={() => setSidebarOpen(false)}
/>
```

### Header

Application header component.

#### Props

```typescript
interface HeaderProps {
  title?: string;
  actions?: React.ReactNode;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}
```

#### Examples

```jsx
<Header
  title="Contacts"
  actions={
    <>
      <Button variant="ghost" onClick={handleImport}>
        Import
      </Button>
      <Button variant="primary" onClick={handleAdd}>
        Add Contact
      </Button>
    </>
  }
  showMenuButton
  onMenuClick={() => setSidebarOpen(true)}
/>
```

## Feature Components

### ContactCard

Contact display card component.

#### Props

```typescript
interface ContactCardProps {
  contact: Contact;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}
```

### AppointmentCard

Appointment display card component.

#### Props

```typescript
interface AppointmentCardProps {
  appointment: Appointment;
  contact?: Contact;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}
```

### TaskCard

Task display card component.

#### Props

```typescript
interface TaskCardProps {
  task: Task;
  contact?: Contact;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onStatusChange?: (status: TaskStatus) => void;
}
```

### DealCard

Deal display card component.

#### Props

```typescript
interface DealCardProps {
  deal: Deal;
  contact?: Contact;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onStageChange?: (stage: DealStage) => void;
}
```

## Display Components

### StatusIndicator

Visual status indicator component.

#### Props

```typescript
interface StatusIndicatorProps {
  status: string;
  color?: string;
  size?: 'small' | 'medium' | 'large';
}
```

### ProgressBar

Progress bar component.

#### Props

```typescript
interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
}
```

### EmptyState

Empty state placeholder component.

#### Props

```typescript
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}
```

#### Examples

```jsx
<EmptyState
  icon={<Users />}
  title="No contacts yet"
  description="Add your first contact to get started"
  action={<Button onClick={handleAdd}>Add Contact</Button>}
/>
```

### LoadingSpinner

Loading spinner component.

#### Props

```typescript
interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}
```

## Utility Components

### Tooltip

Tooltip component for additional information.

#### Props

```typescript
interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}
```

### Dropdown

Dropdown menu component.

#### Props

```typescript
interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
}
```

### Tabs

Tab navigation component.

#### Props

```typescript
interface TabsProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}
```

## Styling System

### Theme

The component library uses a consistent theme system:

```javascript
const theme = {
  colors: {
    primary: '#5B8DEF',
    secondary: '#34D399',
    // ... other colors
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  },
  typography: {
    fontSize: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '24px'
    }
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px'
  }
};
```

### CSS Classes

Components use consistent CSS class naming:

```css
.btn          /* Base button class */
.btn-primary   /* Primary variant */
.btn-secondary /* Secondary variant */
.btn-sm        /* Small size */
.btn-lg        /* Large size */

.card          /* Base card class */
.card-hover    /* Hoverable variant */
.card-compact  /* Compact padding */
```

## Component Patterns

### Compound Components

Some components use compound component patterns:

```jsx
<List>
  <ListItem>Item 1</ListItem>
  <ListItem>Item 2</ListItem>
  <ListItem>Item 3</ListItem>
</List>
```

### Render Props

Some components support render props for customization:

```jsx
<DataFetcher url="/api/data">
  {({ data, loading, error }) => (
    if (loading) return <LoadingSpinner />
    if (error) return <ErrorMessage />
    return <DataDisplay data={data} />
  )}
</DataFetcher>
```

### Higher-Order Components

Some functionality is provided as HOCs:

```jsx
const withLoading = (Component) => {
  return (props) => {
    if (props.loading) return <LoadingSpinner />
    return <Component {...props} />
  }
}

const ContactListWithLoading = withLoading(ContactList)
```

## Accessibility

All components follow WCAG 2.1 AA guidelines:

- **Keyboard Navigation**: Full keyboard accessibility
- **ARIA Labels**: Proper ARIA labels and roles
- **Focus Management**: Logical focus handling
- **Color Contrast**: AA compliant contrast ratios
- **Screen Reader**: Screen reader friendly

## Testing

Components are tested with:

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

test('Button calls onClick when clicked', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  
  fireEvent.click(screen.getByText('Click me'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

This component library provides a comprehensive set of reusable UI components for building the iCan platform with consistent styling and behavior.
