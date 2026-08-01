# Coding Standards

Comprehensive coding standards and best practices for the iCan platform development.

## General Principles

### Code Quality

- **Readability First**: Write code that others can understand
- **Keep It Simple**: Avoid over-engineering
- **DRY**: Don't Repeat Yourself
- **SOLID Principles**: Follow SOLID principles when applicable
- **Performance**: Consider performance implications

### Documentation

- Document complex logic
- Use JSDoc for functions
- Comment on "why", not "what"
- Keep comments up to date

## JavaScript/React Standards

### File Organization

```javascript
// 1. Imports
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

// 2. Component imports
import Button from '../common/Button';
import Card from '../common/Card';

// 3. Utility imports
import { formatDate } from '../utils/helpers';
import { validateContact } from '../utils/validation';

// 4. Type imports
import { CONTACT_STAGES } from '../types/contacts';

// 5. Component
function MyComponent({ prop1, prop2 }) {
  // Component logic
}

// 6. Exports
export default MyComponent;
export { MyComponent };
```

### Component Structure

```jsx
import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * Component description
 * @param {Object} props - Component props
 * @param {string} props.title - Component title
 * @param {Function} props.onClick - Click handler
 */
function MyComponent({ title, onClick }) {
  // 1. Hooks
  const [state, setState] = useState(null);
  const { data } = useAppContext();

  // 2. Derived state
  const derivedValue = useMemo(() => {
    return computeValue(data);
  }, [data]);

  // 3. Effects
  useEffect(() => {
    // Effect logic
    return () => {
      // Cleanup
    };
  }, [dependencies]);

  // 4. Event handlers
  const handleClick = () => {
    setState(newValue);
    onClick?.();
  };

  // 5. Render helpers
  const renderContent = () => {
    return <div>{state}</div>;
  };

  // 6. Conditional rendering
  if (!state) {
    return <LoadingSpinner />;
  }

  // 7. Main render
  return (
    <div className="my-component">
      <h1>{title}</h1>
      {renderContent()}
    </div>
  );
}

// Prop types
MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func
};

// Default props
MyComponent.defaultProps = {
  onClick: () => {}
};

export default MyComponent;
```

### Hooks Usage

```jsx
// useState - Simple state
const [count, setCount] = useState(0);
const [user, setUser] = useState({ name: '', email: '' });

// useEffect - Side effects
useEffect(() => {
  document.title = `Count: ${count}`;
  return () => {
    // Cleanup
  };
}, [count]);

// useContext - Context consumption
const { contacts, addContact } = useAppContext();

// useMemo - Expensive calculations
const sortedContacts = useMemo(() => {
  return contacts.sort((a, b) => a.name.localeCompare(b.name));
}, [contacts]);

// useCallback - Function memoization
const handleClick = useCallback(() => {
  console.log('Clicked');
}, []);

// useRef - DOM refs and mutable values
const inputRef = useRef(null);
const previousValue = useRef(value);

// useReducer - Complex state logic
const [state, dispatch] = useReducer(reducer, initialState);
```

### Event Handlers

```jsx
// Named handlers for clarity
const handleInputChange = (e) => {
  setValue(e.target.value);
};

const handleFormSubmit = (e) => {
  e.preventDefault();
  onSubmit(formData);
};

const handleDelete = (id) => {
  if (window.confirm('Are you sure?')) {
    deleteItem(id);
  }
};

// Async handlers
const handleAsyncAction = async () => {
  try {
    setLoading(true);
    await fetchData();
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setLoading(false);
  }
};
```

## CSS Standards

### Naming Conventions

```css
/* BEM-like naming */
.component-name {}
.component-name--modifier {}
.component-name__element {}

/* Utility classes */
.text-center {}
.flex {}
.mt-4 {}

/* State classes */
.is-active {}
.is-disabled {}
.is-loading {}
```

### Organization

```css
/* 1. Variables */
:root {
  --color-primary: #5B8DEF;
  --spacing-md: 16px;
}

/* 2. Reset */
* {
  box-sizing: border-box;
}

/* 3. Base styles */
body {
  font-family: 'Inter', sans-serif;
}

/* 4. Layout */
.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* 5. Components */
.button {
  /* Button styles */
}

.card {
  /* Card styles */
}

/* 6. Utilities */
.text-center {
  text-align: center;
}

/* 7. Responsive */
@media (max-width: 768px) {
  /* Mobile styles */
}
```

### Best Practices

- Use CSS variables for theming
- Prefer classes over IDs
- Avoid !important
- Use relative units (rem, em, %)
- Mobile-first responsive design
- Use flexbox and grid for layout

## File Naming

### Components

```javascript
// PascalCase for components
ContactCard.jsx
ContactList.jsx
AppointmentForm.jsx
```

### Hooks

```javascript
// camelCase with 'use' prefix
useContacts.js
useAppointments.js
useLocalStorage.js
```

### Utilities

```javascript
// camelCase
storage.js
validation.js
helpers.js
```

### Types

```javascript
// camelCase
contacts.js
appointments.js
interactions.js
```

## Imports

### Import Order

```javascript
// 1. React and core libraries
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// 2. Third-party libraries
import { format } from 'date-fns';
import { Check, X } from 'lucide-react';

// 3. Internal imports - components
import Button from '../common/Button';
import Card from '../common/Card';

// 4. Internal imports - hooks
import { useAppContext } from '../context/AppContext';
import { useContacts } from '../hooks/useContacts';

// 5. Internal imports - utils
import { formatDate } from '../utils/helpers';
import { validateContact } from '../utils/validation';

// 6. Internal imports - types
import { CONTACT_STAGES } from '../types/contacts';

// 7. Styles
import './styles.css';
```

### Absolute vs Relative Imports

```javascript
// Use relative imports for same-level files
import Button from './Button';
import { formatDate } from './helpers';

// Use absolute imports for cross-references
import Button from '../common/Button';
import { useAppContext } from '../../context/AppContext';
```

## Error Handling

### Try-Catch Patterns

```javascript
// Async operations
const fetchData = async () => {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

// With user feedback
const handleAction = async () => {
  try {
    setLoading(true);
    await performAction();
    showSuccess('Action completed');
  } catch (error) {
    showError('Action failed: ' + error.message);
  } finally {
    setLoading(false);
  }
};
```

### Error Boundaries

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

## Performance

### Optimization Techniques

```jsx
// React.memo for expensive components
const ExpensiveComponent = React.memo(function ExpensiveComponent({ data }) {
  return <div>{/* expensive rendering */}</div>;
});

// useMemo for expensive calculations
const sortedList = useMemo(() => {
  return largeList.sort((a, b) => a.value - b.value);
}, [largeList]);

// useCallback for function references
const handleClick = useCallback(() => {
  console.log('Clicked');
}, [dependencies]);

// Code splitting
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

// Virtual scrolling for long lists
import { FixedSizeList } from 'react-window';
```

### Anti-Patterns

```jsx
// AVOID: Inline function definitions in render
{items.map(item => (
  <Button onClick={() => handleClick(item.id)}>Edit</Button>
))}

// PREFER: useCallback or separate handlers
const handleItemClick = useCallback((id) => {
  handleClick(id);
}, [handleClick]);

{items.map(item => (
  <Button onClick={() => handleItemClick(item.id)}>Edit</Button>
))}
```

## Testing Standards

### Test Structure

```jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  const defaultProps = {
    title: 'Test Title',
    onClick: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders without crashing', () => {
      render(<MyComponent {...defaultProps} />);
      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('renders loading state when loading', () => {
      render(<MyComponent {...defaultProps} loading />);
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('calls onClick when button is clicked', () => {
      render(<MyComponent {...defaultProps} />);
      fireEvent.click(screen.getByRole('button'));
      expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
    });

    it('updates state when input changes', async () => {
      render(<MyComponent {...defaultProps} />);
      const input = screen.getByLabelText('Name');
      fireEvent.change(input, { target: { value: 'John' } });
      await waitFor(() => {
        expect(input.value).toBe('John');
      });
    });
  });

  describe('edge cases', () => {
    it('handles empty data gracefully', () => {
      render(<MyComponent {...defaultProps} data={[]} />);
      expect(screen.getByText('No data')).toBeInTheDocument();
    });
  });
});
```

## Security Standards

### Input Validation

```javascript
// Validate user input
const sanitizeInput = (input) => {
  return input.trim().replace(/[<>]/g, '');
};

// Validate email format
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Validate phone format
const isValidPhone = (phone) => {
  return /^\+?[\d\s\-()]+$/.test(phone);
};
```

### Data Handling

```javascript
// Never store sensitive data in localStorage
// Use environment variables for secrets
const apiUrl = process.env.REACT_APP_API_URL;

// Sanitize data before rendering
const safeHTML = (html) => {
  return { __html: html };
};

// Use HTTPS in production
const apiEndpoint = process.env.NODE_ENV === 'production' 
  ? 'https://api.example.com' 
  : 'http://localhost:3001';
```

## Git Standards

### Commit Messages

```
feat: add contact search functionality
fix: resolve appointment creation bug
docs: update API documentation
style: format code with Prettier
refactor: optimize contact list rendering
test: add unit tests for contact form
chore: update dependencies
perf: improve data fetching performance
ci: add GitHub Actions workflow
build: update webpack configuration
revert: revert previous commit
```

### Branch Naming

```
feature/add-contact-search
bugfix/appointment-creation-error
hotfix/security-patch
refactor/optimize-performance
docs/update-readme
test/add-unit-tests
```

## Code Review Checklist

### Functionality
- [ ] Does the code work as intended?
- [ ] Are edge cases handled?
- [ ] Is error handling appropriate?

### Code Quality
- [ ] Is the code readable and maintainable?
- [ ] Are variable names descriptive?
- [ ] Is there unnecessary complexity?

### Performance
- [ ] Are there performance concerns?
- [ ] Can calculations be memoized?
- [ ] Is re-rendering optimized?

### Security
- [ ] Are inputs validated?
- [ ] Is sensitive data protected?
- [ ] Are there security vulnerabilities?

### Testing
- [ ] Are there appropriate tests?
- [ ] Do tests cover edge cases?
- [ ] Are tests reliable?

### Documentation
- [ ] Is complex code documented?
- [ ] Are API docs updated?
- [ ] Are comments helpful?

These coding standards ensure consistency, quality, and maintainability across the iCan platform codebase.
