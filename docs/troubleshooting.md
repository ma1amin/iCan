# Troubleshooting Guide

Common issues and solutions for the iCan platform.

## Table of Contents

- [Installation Issues](#installation-issues)
- [Database & API Issues](#database--api-issues)
- [Data Issues](#data-issues)
- [Form Issues](#form-issues)
- [Performance Issues](#performance-issues)
- [UI/UX Issues](#uiux-issues)
- [Sync Issues](#sync-issues)
- [Browser Issues](#browser-issues)
- [Mobile Issues](#mobile-issues)
- [Admin Authentication Issues](#admin-authentication-issues)
- [Feedback System Issues](#feedback-system-issues)

## Installation Issues

### Node.js Version Incompatible

**Problem**: Installation fails due to Node.js version incompatibility.

**Solution**:
```bash
# Check Node.js version
node --version

# Install correct version (16+)
# Using nvm (recommended)
nvm install 16
nvm use 16

# Or download from nodejs.org
```

### Port Already in Use

**Problem**: Development server fails to start because port 3000 is in use.

**Solution**:
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
PORT=3001 npm start
```

### Dependency Installation Fails

**Problem**: `npm install` fails with errors.

**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Build Fails

**Problem**: `npm run build` fails with errors.

**Solution**:
```bash
# Clear React cache
npm start -- --reset-cache

# Or manually clear cache
rm -rf node_modules/.cache
npm run build
```

## Database & API Issues

### Database Connection Failed

**Problem**: API server fails to start with database connection error.

**Solution**:
1. Ensure MySQL is running:
```bash
# Windows
net start mysql

# Mac/Linux
sudo service mysql start
# or
sudo systemctl start mysql
```

2. Check DATABASE_URL in `.env` file is correct
3. Verify MySQL is accessible:
```bash
# Test database connection
npx prisma db pull
```

4. Ensure MySQL credentials in .env match your MySQL setup
5. Create database if it doesn't exist:
```sql
CREATE DATABASE ican_db;
```

6. Check MySQL user permissions:
```sql
GRANT ALL PRIVILEGES ON ican_db.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### Prisma Migration Failed

**Problem**: Database migration fails with errors.

**Solution**:
1. Ensure MySQL database exists:
```sql
CREATE DATABASE ican_db;
```

2. Reset database and reapply migrations:
```bash
npx prisma migrate reset --force
```

3. Or resolve specific migration issues:
```bash
npx prisma migrate resolve --applied <migration-name>
```

4. Check schema.prisma for syntax errors:
```bash
npx prisma validate
```

5. Regenerate Prisma Client:
```bash
npx prisma generate
```

### API Server Not Starting

**Problem**: API server fails to start or crashes immediately.

**Solution**:
1. Check if port 3001 is already in use:
```bash
# Windows
netstat -ano | findstr :3001
taskkill /F /PID <PID>

# Mac/Linux
lsof -ti:3001 | xargs kill -9
```

2. Check server logs for specific errors
3. Verify all dependencies are installed:
```bash
npm install
```

4. Check environment variables are set in `.env` file

### 401 Unauthorized Errors

**Problem**: API calls return 401 errors even after login.

**Solution**:
1. Clear browser localStorage:
```javascript
// In browser console
localStorage.clear()
location.reload()
```

2. Re-login to get fresh JWT token
3. Check token is being stored correctly:
```javascript
// In browser console
localStorage.getItem('ican-token')
```

4. Verify token is not expired (default 24 hours)

### CORS Errors

**Problem**: Browser shows CORS errors when calling API.

**Solution**:
1. Ensure API server is running on port 3001
2. Check CORS configuration in server.js
3. Verify frontend is calling correct API URL
4. Check browser console for specific CORS errors

### Prisma Client Generation Failed

**Problem**: Prisma Client fails to generate after schema changes.

**Solution**:
1. Regenerate Prisma Client:
```bash
npx prisma generate
```

2. If that fails, reset Prisma:
```bash
rm -rf node_modules/.prisma
npx prisma generate
```

3. Ensure schema.prisma is valid:
```bash
npx prisma validate
```

## Form Issues

### Forms Not Saving Data

**Problem**: Forms (contacts, appointments, tasks, deals) fail to save with 500 Internal Server Error.

**Solution**:
1. Check server logs for specific error messages
2. Ensure form fields match database schema
3. Verify required fields are being sent
4. Check for client-generated fields (id, createdAt, updatedAt) conflicts
5. Verify field names match between form and database (e.g., companyName vs company)

**Common Causes**:
- Sending client-generated fields that conflict with Prisma auto-generated fields
- Field name mismatches (company vs companyName)
- Missing required fields
- Invalid data types

### Drag and Drop Not Working

**Problem**: Drag and drop functionality in Kanban board or Pipeline view not working.

**Solution**:
1. Check if @hello-pangea/dnd library is installed
2. Verify proper nesting of DragDropContext, Droppable, and Draggable components
3. Check for nested scroll container conflicts
4. Ensure unique draggableId for each item
5. Verify proper index assignment for draggable items

### Dropdown Menu Opens Card Form

**Problem**: Clicking dropdown menu on task/deal cards opens the detail form instead of changing status.

**Solution**:
1. Ensure onClick event has e.stopPropagation() on dropdown
2. Check event propagation is properly stopped
3. Verify dropdown is inside card click boundary

## Data Issues

### Data Not Loading

**Problem**: Application shows loading screen indefinitely.

**Solution**:
1. Check browser console for errors
2. Verify localStorage is enabled
3. Clear browser cache and reload
4. Check if data exists in localStorage:
```javascript
// In browser console
localStorage.getItem('ican-data')
```

### Data Not Saving

**Problem**: Changes are not persisted after page refresh.

**Solution**:
1. Check browser console for storage errors
2. Verify localStorage quota is not exceeded
3. Check if browser is in private/incognito mode
4. Clear localStorage and restart:
```javascript
// In browser console
localStorage.clear()
location.reload()
```

### Corrupted Data

**Problem**: Application crashes or shows unexpected behavior.

**Solution**:
1. Export current data if possible
2. Clear corrupted data:
```javascript
// In browser console
localStorage.removeItem('ican-data')
location.reload()
```
3. Import backup data
4. Check data format using browser DevTools

### Data Migration Issues

**Problem**: Data migration fails or produces errors.

**Solution**:
1. Verify data format matches expected structure
2. Check for missing required fields
3. Validate data types
4. Use migration rollback if available
5. Contact support with error details

## Performance Issues

### Slow Application Load

**Problem**: Application takes long time to load.

**Solution**:
1. Check network connection
2. Clear browser cache
3. Disable browser extensions
4. Check for large datasets:
```javascript
// In browser console
const data = JSON.parse(localStorage.getItem('ican-data'))
console.log('Contacts:', data.contacts.length)
console.log('Appointments:', data.appointments.length)
```
5. Archive old data if needed

### Laggy Interface

**Problem**: UI responds slowly to user interactions.

**Solution**:
1. Check browser performance tab for bottlenecks
2. Reduce number of contacts/tasks displayed
3. Enable virtual scrolling for long lists
4. Close other browser tabs
5. Update browser to latest version

### High Memory Usage

**Problem**: Browser uses excessive memory.

**Solution**:
1. Check for memory leaks in DevTools
2. Reduce dataset size
3. Clear browser cache
4. Restart browser
5. Check for infinite loops in code

## UI/UX Issues

### Components Not Rendering

**Problem**: Some components don't appear on screen.

**Solution**:
1. Check browser console for React errors
2. Verify component imports are correct
3. Check for missing required props
4. Ensure parent component is rendering
5. Check CSS display properties

### Styling Issues

**Problem**: Components appear unstyled or incorrectly styled.

**Solution**:
1. Verify CSS files are imported
2. Check for CSS syntax errors
3. Clear browser cache
4. Check for conflicting class names
5. Verify CSS specificity

### Responsive Design Issues

**Problem**: Layout breaks on mobile devices.

**Solution**:
1. Test on actual mobile device
2. Check viewport meta tag
3. Verify media queries are working
4. Check for fixed widths
5. Test on different screen sizes

### Modal Not Closing

**Problem**: Modal dialogs don't close when expected.

**Solution**:
1. Check if close handler is properly bound
2. Verify overlay click handler
3. Check for JavaScript errors
4. Ensure modal state is properly managed
5. Test keyboard escape key

### Blur Effects After Login

**Problem**: Blur effects appear after login or during page transitions.

**Solution**:
1. Clear browser cache and reload
2. Check for CSS filter effects in components
3. Verify transform animations are not causing blur
4. Ensure loading screens use CSS variables
5. Check for backdrop-filter properties (removed in v3.5.0)
6. Disable hardware acceleration in browser settings if persistent

**Note**: As of version 3.5.0, all blur-causing CSS effects have been eliminated from the platform.

### Theme Not Applying After Login

**Problem**: Theme doesn't switch or persist after login.

**Solution**:
1. Check localStorage for 'ican-theme' key
2. Verify theme toggle is properly connected to AppContext
3. Ensure CSS variables are defined for both themes
4. Check for hardcoded colors in component CSS files
5. Verify theme synchronization across browser tabs
6. Clear localStorage and reset theme preference

**Note**: As of version 3.5.0, all loading screens and components use CSS variables for theme consistency.

## Sync Issues

### Cloud Sync Not Working

**Problem**: Changes not syncing across devices.

**Solution**:
1. Check internet connection
2. Verify cloud service credentials
3. Check sync status in settings
4. Manual sync trigger
5. Check for sync conflicts

### Sync Conflicts

**Problem**: Conflicting changes between devices.

**Solution**:
1. Review conflict resolution options
2. Choose which version to keep
3. Merge changes manually if needed
4. Establish sync schedule to avoid conflicts
5. Use conflict resolution features

### Backup Restore Fails

**Problem**: Unable to restore from backup.

**Solution**:
1. Verify backup file integrity
2. Check file format is correct
3. Ensure sufficient storage space
4. Try restoring to clean slate
5. Contact support with backup file

## Browser Issues

### Browser Compatibility

**Problem**: Application doesn't work in specific browser.

**Solution**:
1. Check browser compatibility list
2. Update browser to latest version
3. Enable JavaScript
3. Disable conflicting extensions
4. Try in private/incognito mode
5. Use supported browser

### Console Errors

**Problem**: JavaScript errors appear in console.

**Solution**:
1. Copy error message and stack trace
2. Search for error in documentation
3. Check for common issues:
   - Missing imports
   - Undefined variables
   - Type errors
   - Network errors
4. Report bug if error persists

### LocalStorage Disabled

**Problem**: Application shows localStorage errors.

**Solution**:
1. Check browser settings
2. Enable cookies and local storage
3. Disable private/incognito mode
4. Check browser security settings
5. Try different browser

## Mobile Issues

### Touch Events Not Working

**Problem**: Touch interactions don't respond on mobile.

**Solution**:
1. Verify touch events are properly handled
2. Check for touch-action CSS property
3. Test on actual mobile device
4. Check for conflicting touch handlers
5. Ensure viewport is properly configured

### Keyboard Not Appearing

**Problem**: Virtual keyboard doesn't appear when typing.

**Solution**:
1. Check input field focus
2. Verify input field is not disabled
3. Check for keyboard suppression
4. Ensure proper input types
5. Test on different mobile devices

## Admin Authentication Issues

### Admin Login Fails with 500 Error

**Problem**: Admin login fails with 500 Internal Server Error.

**Solution**:
1. Check that ADMIN_JWT_SECRET is set in .env file
2. Verify admin account exists in database
3. Check server logs for detailed error information
4. Ensure MySQL connection is working
5. Try logging out and logging back in to generate new token

### Admin Auto-Logout on Page Refresh

**Problem**: Admin gets logged out when refreshing the page.

**Solution**:
1. Clear browser localStorage and try again
2. Log out and log back in to generate new token
3. Check that ADMIN_JWT_SECRET is consistent across server restarts
4. Verify token expiration time (24 hours)
5. Check browser console for specific error messages

### Admin Logout Takes Too Long

**Problem**: Admin logout is slow or doesn't redirect properly.

**Solution**:
1. This was fixed in v3.2.3 with immediate navigation
2. If still experiencing issues, clear browser cache
3. Check that /admin/login route is properly configured
4. Verify AdminProtectedRoute is working correctly

## Feedback System Issues

### Feedback Page Shows Dashboard Instead

**Problem**: Clicking Feedback in sidebar shows Dashboard instead of feedback list.

**Solution**:
1. This was fixed in v3.2.2 with direct route rendering
2. Clear browser cache and reload
3. Check that /feedback route is properly configured in App.jsx
4. Verify setCurrentView is being called correctly

### Admin Feedback Page Shows Error

**Problem**: Admin feedback page shows "Failed to fetch feedback" error.

**Solution**:
1. This was fixed in v3.2.3 with database relations
2. Verify Feedback model has relations to User and Tenant
3. Run `npx prisma db push` to sync schema
4. Run `npx prisma generate` to regenerate Prisma Client
5. Check server logs for detailed error information

### Feedback Formatting Issues

**Problem**: Feedback subjects and categories show underscores or lowercase.

**Solution**:
1. This was fixed in v3.2.2 with formatting functions
2. Check that formatFeedbackSubject and formatFeedbackCategory are being used
3. Verify feedback types configuration is correct
4. Clear browser cache and reload

### Feedback Submission Fails

**Problem**: User cannot submit feedback form.

**Solution**:
1. Check that user is authenticated
2. Verify API endpoint is accessible
3. Check form validation is working correctly
4. Look for onChange handler errors in console
5. Ensure all required fields are filled

### Admin Notifications Not Working

**Problem**: Admin notifications don't appear or update.

**Solution**:
1. Check that Notification model has admin relation
2. Verify admin account exists in database
3. Check that notifications are being created on feedback submission
4. Verify admin JWT token is valid
5. Check browser console for specific errors

### App Crashes on Mobile

**Problem**: Application crashes on mobile devices.

**Solution**:
1. Check browser console for errors
2. Verify memory usage
3. Reduce dataset size
4. Check for mobile-specific bugs
5. Test on different mobile browsers

## Data Export/Import Issues

### Export Fails

**Problem**: Unable to export data.

**Solution**:
1. Check browser permissions
2. Verify sufficient storage space
3. Check for data corruption
4. Try exporting smaller dataset
5. Use alternative export format

### Import Fails

**Problem**: Unable to import data.

**Solution**:
1. Verify file format is correct
2. Check file integrity
3. Validate data structure
4. Check for required fields
5. Ensure compatible data version

### Data Loss During Import

**Problem**: Data missing after import.

**Solution**:
1. Verify backup before import
2. Check import mapping
3. Validate imported data
4. Use merge instead of replace
5. Contact support with original file

## Feature-Specific Issues

### Calendar Issues

**Problem**: Calendar not displaying appointments correctly.

**Solution**:
1. Check date format settings
2. Verify timezone configuration
3. Check for recurring event errors
4. Clear calendar cache
5. Re-sync calendar data

### Contact Search Issues

**Problem**: Search not finding expected contacts.

**Solution**:
1. Check search query spelling
2. Verify search filters
3. Check indexed fields
4. Clear search cache
5. Rebuild search index

### Task Notifications Issues

**Problem**: Not receiving task reminders.

**Solution**:
1. Check notification permissions
2. Verify notification settings
3. Check browser notification settings
4. Ensure app is running
5. Test notification system

## Getting Help

### Before Contacting Support

1. Check this troubleshooting guide
2. Search documentation
3. Check browser console for errors
4. Try reproducing in different browser
5. Note exact steps to reproduce issue

### Information to Provide

When contacting support, provide:
- Browser version and type
- Operating system
- Steps to reproduce the issue
- Expected vs actual behavior
- Console errors (if any)
- Screenshots (if applicable)

### Reporting Bugs

Use the following format when reporting bugs:

```
**Description**: Brief description of the issue
**Steps to Reproduce**:
1. Step one
2. Step two
3. Step three

**Expected Behavior**: What should happen
**Actual Behavior**: What actually happens
**Environment**: Browser, OS, version
**Console Errors**: Any error messages
```

### Feature Requests

For feature requests, provide:
- Feature description
- Use case scenario
- Expected benefits
- Alternative solutions considered

## Preventive Measures

### Regular Maintenance

- Clear browser cache periodically
- Keep browser updated
- Regular data backups
- Monitor storage usage
- Review error logs

### Best Practices

- Don't exceed localStorage limits
- Keep data organized
- Regular data cleanup
- Use consistent naming
- Document custom workflows

### Data Management

- Regular backups
- Verify backup integrity
- Test restore process
- Keep multiple backup versions
- Store backups securely

This troubleshooting guide covers the most common issues and their solutions. For issues not covered here, please refer to the documentation or contact support.
