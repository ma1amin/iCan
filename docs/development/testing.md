# Testing Guide

Comprehensive testing guide for the iCan platform including unit tests, integration tests, and end-to-end testing.

## Testing Philosophy

### Testing Pyramid

```
        E2E Tests (few)
       /             \
    Integration Tests (more)
   /                   \
Unit Tests (most)
```

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test component interactions and data flow
- **E2E Tests**: Test complete user workflows

### Testing Principles

- **Fast**: Tests should run quickly
- **Isolated**: Each test should be independent
- **Repeatable**: Tests should produce consistent results
- **Self-Validating**: Tests should have clear pass/fail criteria
- **Timely**: Tests should be written alongside code

## Setup

### Testing Tools

The project uses:

- **Jest**: Testing framework
- **React Testing Library**: Component testing utilities
- **Cypress**: End-to-end testing (optional)

### Configuration

Jest is configured by default with Create React App. Additional configuration can be added in `package.json`:

```json
{
  "jest": {
    "collectCoverageFrom": [
      "src/**/*.{js,jsx}",
      "!src/index.js",
      "!src/reportWebVitals.js"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 70,
        "functions": 70,
        "lines": 70,
        "statements": 70
      }
    }
  }
}
```

## Unit Testing

### Testing Utility Functions

```javascript
// utils/helpers.js
export const formatDate = (date, format) => {
  // Implementation
};

// utils/helpers.test.js
import { formatDate } from './helpers';

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2024-01-15');
    const result = formatDate(date, 'YYYY-MM-DD');
    expect(result).toBe('2024-01-15');
  });

  it('handles invalid dates', () => {
    const result = formatDate(null, 'YYYY-MM-DD');
    expect(result).toBe('');
  });

  it('handles different formats', () => {
    const date = new Date('2024-01-15');
    expect(formatDate(date, 'MM/DD/YYYY')).toBe('01/15/2024');
    expect(formatDate(date, 'DD-MM-YYYY')).toBe('15-01-2024');
  });
});
```

### Testing Custom Hooks

```javascript
// hooks/useContacts.js
export const useContacts = () => {
  const { contacts, addContact } = useAppContext();
  // Implementation
};

// hooks/useContacts.test.js
import { renderHook, act } from '@testing-library/react';
import { useContacts } from './useContacts';
import { AppProvider } from '../context/AppContext';

const wrapper = ({ children }) => (
  <AppProvider>{children}</AppProvider>
);

describe('useContacts', () => {
  it('returns contacts array', () => {
    const { result } = renderHook(() => useContacts(), { wrapper });
    expect(Array.isArray(result.current.contacts)).toBe(true);
  });

  it('adds contact correctly', () => {
    const { result } = renderHook(() => useContacts(), { wrapper });
    
    act(() => {
      result.current.addContact({ name: 'John Doe' });
    });
    
    expect(result.current.contacts).toHaveLength(1);
    expect(result.current.contacts[0].name).toBe('John Doe');
  });
});
```

### Testing Validation Functions

```javascript
// utils/validation.js
export const validateContact = (contact) => {
  const errors = {};
  if (!contact.name) errors.name = 'Name is required';
  if (contact.email && !isValidEmail(contact.email)) {
    errors.email = 'Invalid email format';
  }
  return { isValid: Object.keys(errors).length === 0, errors };
};

// utils/validation.test.js
import { validateContact } from './validation';

describe('validateContact', () => {
  it('passes validation with valid data', () => {
    const contact = { name: 'John Doe', email: 'john@example.com' };
    const result = validateContact(contact);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('fails validation with missing name', () => {
    const contact = { email: 'john@example.com' };
    const result = validateContact(contact);
    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBe('Name is required');
  });

  it('fails validation with invalid email', () => {
    const contact = { name: 'John Doe', email: 'invalid-email' };
    const result = validateContact(contact);
    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBe('Invalid email format');
  });
});
```

## Component Testing

### Testing Basic Components

```jsx
// components/common/Button.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  const defaultProps = {
    children: 'Click me',
    onClick: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders button with text', () => {
    render(<Button {...defaultProps} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    render(<Button {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('renders primary variant correctly', () => {
    render(<Button {...defaultProps} variant="primary" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn-primary');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button {...defaultProps} disabled />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('shows loading state', () => {
    render(<Button {...defaultProps} loading />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});
```

### Testing Complex Components

```jsx
// components/contacts/ContactList.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ContactList from './ContactList';
import { AppProvider } from '../../context/AppContext';

const mockContacts = [
  { id: '1', name: 'John Doe', company: 'Tech Corp' },
  { id: '2', name: 'Jane Smith', company: 'Startup Inc' }
];

const renderWithProvider = (component) => {
  return render(
    <AppProvider>
      {component}
    </AppProvider>
  );
};

describe('ContactList', () => {
  it('renders contact list', () => {
    renderWithProvider(<ContactList contacts={mockContacts} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('filters contacts by search query', () => {
    renderWithProvider(<ContactList contacts={mockContacts} />);
    
    const searchInput = screen.getByPlaceholderText('Search contacts...');
    fireEvent.change(searchInput, { target: { value: 'John' } });
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
  });

  it('calls onContactClick when contact is clicked', () => {
    const handleContactClick = jest.fn();
    renderWithProvider(
      <ContactList 
        contacts={mockContacts} 
        onContactClick={handleContactClick}
      />
    );
    
    fireEvent.click(screen.getByText('John Doe'));
    expect(handleContactClick).toHaveBeenCalledWith('1');
  });

  it('shows empty state when no contacts', () => {
    renderWithProvider(<ContactList contacts={[]} />);
    expect(screen.getByText('No contacts found')).toBeInTheDocument();
  });
});
```

### Testing Forms

```jsx
// components/contacts/ContactForm.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ContactForm from './ContactForm';

describe('ContactForm', () => {
  const defaultProps = {
    onSubmit: jest.fn(),
    onCancel: jest.fn()
  };

  it('renders form fields', () => {
    render(<ContactForm {...defaultProps} />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<ContactForm {...defaultProps} />);
    
    const submitButton = screen.getByText('Save');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    render(<ContactForm {...defaultProps} />);
    
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'john@example.com' }
    });
    
    fireEvent.click(screen.getByText('Save'));
    
    await waitFor(() => {
      expect(defaultProps.onSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com'
      });
    });
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(<ContactForm {...defaultProps} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });
});
```

## Integration Testing

### Testing Data Flow

```jsx
// testing integration between components and context
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AppProvider } from '../context/AppContext';
import ContactList from '../components/contacts/ContactList';
import ContactForm from '../components/contacts/ContactForm';

describe('Contact Integration', () => {
  it('adds contact and updates list', async () => {
    render(
      <AppProvider>
        <ContactList />
        <ContactForm />
      </AppProvider>
    );

    // Open form
    fireEvent.click(screen.getByText('Add Contact'));

    // Fill form
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'John Doe' }
    });

    // Submit form
    fireEvent.click(screen.getByText('Save'));

    // Wait for update
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });
});
```

### Testing Component Interactions

```jsx
describe('Calendar Integration', () => {
  it('creates appointment and updates calendar', async () => {
    render(
      <AppProvider>
        <CalendarView />
        <AppointmentForm />
      </AppProvider>
    );

    // Open appointment form
    fireEvent.click(screen.getByText('New Appointment'));

    // Fill form
    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Team Meeting' }
    });
    fireEvent.change(screen.getByLabelText('Date'), {
      target: { value: '2024-01-15' }
    });

    // Submit
    fireEvent.click(screen.getByText('Save'));

    // Verify calendar update
    await waitFor(() => {
      expect(screen.getByText('Team Meeting')).toBeInTheDocument();
    });
  });
});
```

## End-to-End Testing

### Cypress Setup

Install Cypress:

```bash
npm install --save-dev cypress
```

### E2E Test Example

```javascript
// cypress/e2e/contact-workflow.cy.js
describe('Contact Workflow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('creates and views a new contact', () => {
    // Navigate to contacts
    cy.get('[data-testid="nav-contacts"]').click();

    // Click add contact
    cy.get('[data-testid="add-contact"]').click();

    // Fill form
    cy.get('[data-testid="contact-name"]').type('John Doe');
    cy.get('[data-testid="contact-email"]').type('john@example.com');
    cy.get('[data-testid="contact-company"]').type('Tech Corp');

    // Submit
    cy.get('[data-testid="save-contact"]').click();

    // Verify contact appears in list
    cy.contains('John Doe').should('be.visible');
    cy.contains('john@example.com').should('be.visible');
  });

  it('searches for a contact', () => {
    // Create contact first
    cy.createContact('John Doe', 'john@example.com');

    // Search
    cy.get('[data-testid="search-input"]').type('John');

    // Verify search results
    cy.contains('John Doe').should('be.visible');
    cy.contains('Jane Smith').should('not.exist');
  });

  it('deletes a contact', () => {
    // Create contact
    cy.createContact('John Doe', 'john@example.com');

    // Delete
    cy.get('[data-testid="contact-delete"]').first().click();
    cy.get('[data-testid="confirm-delete"]').click();

    // Verify deletion
    cy.contains('John Doe').should('not.exist');
  });
});
```

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm test -- --watch
```

### Run Tests with Coverage

```bash
npm test -- --coverage
```

### Run Specific Test File

```bash
npm test ContactList.test.jsx
```

### Run Cypress E2E Tests

```bash
npx cypress open
```

## Test Coverage

### Coverage Goals

- **Statements**: 70%+
- **Branches**: 70%+
- **Functions**: 70%+
- **Lines**: 70%+

### Coverage Report

Generate coverage report:

```bash
npm test -- --coverage
```

View coverage report in `coverage/lcov-report/index.html`.

## Best Practices

### DO

- Write tests alongside code
- Test user behavior, not implementation
- Use descriptive test names
- Keep tests simple and focused
- Mock external dependencies
- Test edge cases and error conditions

### DON'T

- Test implementation details
- Write fragile tests that break easily
- Test third-party libraries
- Over-mock components
- Write tests that are too complex
- Ignore test failures

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v2
        with:
          files: ./coverage/lcov.info
```

## Troubleshooting

### Common Issues

**Tests timing out:**
```javascript
// Increase timeout
it('slow test', () => {
  // ...
}, 10000); // 10 second timeout
```

**Mock functions not being called:**
```javascript
// Use waitFor for async operations
await waitFor(() => {
  expect(mockFn).toHaveBeenCalled();
});
```

**DOM updates not detected:**
```javascript
// Use act for state updates
await act(async () => {
  await userEvent.click(button);
});
```

This testing guide provides comprehensive coverage for testing all aspects of the iCan platform.
