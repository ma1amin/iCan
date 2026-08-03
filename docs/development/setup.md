# Development Setup Guide

Complete guide for setting up the iCan platform development environment.

## Prerequisites

### Required Software

- **Node.js**: Version 16.0 or higher
- **npm**: Version 7.0 or higher (comes with Node.js)
- **Git**: For version control
- **Code Editor**: VS Code recommended
- **MySQL**: Version 8.0 or higher (for database)

### Optional but Recommended

- **Google Chrome**: For development and testing
- **React Developer Tools**: Browser extension for React debugging

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ican
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies including:
- React 18.2.0
- React DOM 18.2.0
- React Scripts 5.0.1
- Lucide React 0.263.1
- date-fns 2.30.0
- Express.js 5.2.1
- Prisma 7.9.1
- @prisma/client 7.9.1
- bcryptjs 3.0.3
- jsonwebtoken 9.0.3
- cors 2.8.6
- concurrently 10.0.4
- dotenv 17.4.2
- @hello-pangea/dnd 16.6.0 (drag and drop for tasks)
- react-router-dom 6.26.1 (client-side routing)

### 3. Database Setup

The platform uses MySQL with Prisma ORM. To set up the database:

#### Install MySQL Locally
1. Download and install MySQL from https://dev.mysql.com/downloads/mysql/
2. Start MySQL service
3. Create a database for the application:
```sql
CREATE DATABASE ican_db;
```

#### Configure Database Connection
Update the `.env` file with your MySQL credentials:
```
DATABASE_URL="mysql://root:your_password@localhost:3306/ican_db?schema=public"
```

#### Apply Database Migrations
```bash
# Generate Prisma Client
npx prisma generate

# Apply database migrations
npx prisma migrate dev --name init
```

### 5. Data Migration (Optional)

If you need to migrate data or check database status:

```bash
# Run MySQL migration script
npm run migrate:mysql
```

This script will:
- Verify database connection
- Check existing data
- Provide migration guidance
- Help with data transfer scenarios

The database connection is configured in the `.env` file. The default setup uses local MySQL instance.

### 6. Start Development Servers

The platform uses a dual-server architecture (frontend + API):

```bash
# Start both frontend and API servers together
npm run dev
```

This will start:
- **Frontend**: React development server on `http://localhost:3000`
- **API**: Express.js API server on `http://localhost:3001`

Alternatively, you can run them separately:

```bash
# Start API server only
npm run server

# Start frontend only (in another terminal)
npm start
```

### 5. Verify Installation

### 4. Verify Installation

Open your browser and navigate to `http://localhost:3000`. You should see the iCan platform loading screen.

## Project Structure

```
ican/
├── src/
│   ├── components/          # React components
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

## Development Scripts

### Available NPM Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject (one-way operation)
npm run eject
```

### Development Server

The development server includes:
- Hot module replacement
- Error overlay
- Source maps
- Auto-reload on file changes

## Development Tools

### VS Code Extensions

Recommended VS Code extensions for development:

- **ESLint**: JavaScript/React linting
- **Prettier**: Code formatting
- **Auto Rename Tag**: HTML tag auto-rename
- **Bracket Pair Colorizer**: Bracket matching
- **GitLens**: Git integration
- **React/Redux Snippets**: React code snippets

### ESLint Configuration

The project uses ESLint for code quality:

```json
{
  "extends": [
    "react-app",
    "react-app/jest"
  ]
}
```

### Prettier Configuration

For consistent code formatting (optional):

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

## Coding Standards

### File Naming

- **Components**: PascalCase (e.g., `ContactCard.jsx`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useContacts.js`)
- **Utils**: camelCase (e.g., `storage.js`)
- **Types**: camelCase (e.g., `contacts.js`)

### Code Style

- Use functional components with hooks
- Prefer arrow functions
- Use template literals for strings
- Destructure props and state
- Use meaningful variable names

### Component Structure

```jsx
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

// Component imports
import Button from '../common/Button';
import Card from '../common/Card';

// Utility imports
import { formatDate } from '../utils/helpers';

function MyComponent({ prop1, prop2 }) {
  // Hooks
  const [state, setState] = useState(null);
  const { data } = useAppContext();

  // Effects
  useEffect(() => {
    // Effect logic
  }, []);

  // Event handlers
  const handleClick = () => {
    // Handler logic
  };

  // Render
  return (
    <div className="my-component">
      {/* JSX content */}
    </div>
  );
}

export default MyComponent;
```

## Debugging

### React Developer Tools

Install React Developer Tools browser extension:

1. Chrome: [Chrome Web Store](https://chrome.google.com/webstore)
2. Firefox: [Firefox Add-ons](https://addons.mozilla.org)

### Console Logging

Use console logging for debugging:

```javascript
console.log('Debug info:', data);
console.error('Error occurred:', error);
console.warn('Warning message:', warning);
```

### Breakpoint Debugging

Use VS Code debugger:

1. Set breakpoints in your code
2. Press F5 or click "Run and Debug"
3. Select "Chrome" as debug target
4. Application will launch in debug mode

## Testing

### Running Tests

```bash
npm test
```

### Writing Tests

Use React Testing Library:

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

test('Button calls onClick when clicked', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  
  fireEvent.click(screen.getByText('Click me'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

## Building for Production

### Production Build

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

### Build Optimization

The production build includes:
- Minified JavaScript
- Optimized assets
- Tree shaking
- Code splitting

### Testing Production Build

To test the production build locally:

```bash
npm install -g serve
serve -s build
```

## Git Workflow

### Branch Strategy

- `main`: Production-ready code
- `develop`: Development branch
- `feature/*`: Feature branches
- `bugfix/*`: Bug fix branches

### Commit Messages

Use conventional commit messages:

```
feat: add contact search functionality
fix: resolve appointment creation bug
docs: update API documentation
style: format code with Prettier
refactor: optimize contact list rendering
test: add unit tests for contact form
chore: update dependencies
```

### Pull Request Process

1. Create feature branch from `develop`
2. Make changes and commit
3. Push to remote
4. Create pull request
5. Request code review
6. Merge after approval

## Troubleshooting

### Common Issues

**Port 3000 already in use:**
```bash
# Kill process on port 3000
npx kill-port 3000
# Or use different port
PORT=3001 npm start
```

**Dependency conflicts:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Build errors:**
```bash
# Clear React cache
npm start -- --reset-cache
```

**Import errors:**
- Check file paths are correct
- Verify file extensions (.jsx, .js)
- Ensure proper export/import syntax

## Performance Optimization

### Development Performance

- Use React DevTools Profiler
- Monitor component re-renders
- Implement memoization where needed
- Use lazy loading for heavy components

### Build Performance

- Analyze bundle size: `npm run build -- --profile`
- Use code splitting
- Optimize images and assets
- Remove unused dependencies

## Security Best Practices

### Development Security

- Never commit sensitive data
- Use environment variables for secrets
- Keep dependencies updated
- Audit dependencies regularly
- Use HTTPS in production

### Dependency Security

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies
npm update
```

## Deployment

### Build for Deployment

```bash
npm run build
```

### Deployment Options

**Netlify:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

**Vercel:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

**GitHub Pages:**
```bash
# Install gh-pages
npm install gh-pages --save-dev

# Deploy
npm run deploy
```

## Environment Variables

### Create .env File

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=https://api.example.com
REACT_APP_ENABLE_ANALYTICS=true
```

### Access Environment Variables

```javascript
const apiUrl = process.env.REACT_APP_API_URL;
```

## Continuous Integration

### GitHub Actions Example

```yaml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm test
      - run: npm run build
```

## Additional Resources

### Documentation

- [React Documentation](https://react.dev)
- [React Hooks Guide](https://react.dev/reference/react)
- [Lucide Icons](https://lucide.dev)
- [date-fns Documentation](https://date-fns.org)

### Community

- [React Discord](https://react.dev/community)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/react)
- [GitHub Issues](https://github.com/facebook/react/issues)

This setup guide provides everything needed to start developing the iCan platform effectively.
