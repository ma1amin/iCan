# Data Storage Architecture

## Overview

The iCan platform currently uses **localStorage** for data persistence as a frontend-only application with a backend-ready architecture. This approach allows the platform to function immediately without requiring a backend server, while being designed for future API integration.

## Current Storage Implementation

### Storage Technology: LocalStorage

**Why LocalStorage?**
- Zero-setup deployment
- Works entirely in the browser
- No server required
- Fast and responsive
- Sufficient for individual user data
- Perfect for prototype and development phase

### Storage Keys and Structure

#### Authentication Data
- **Key**: `ican-auth`
- **Purpose**: Stores current user session and tenant information
- **Structure**:
```javascript
{
  user: User,
  tenant: Tenant,
  lastSync: timestamp
}
```

#### User Accounts
- **Key**: `ican-users`
- **Purpose**: Stores all registered user accounts
- **Structure**: Array of User objects

#### Tenant/Organization Data
- **Key**: `ican-tenants`
- **Purpose**: Stores all organizations/tenants
- **Structure**: Array of Tenant objects

#### Email Verification Tokens
- **Key**: `ican-verification-tokens`
- **Purpose**: Stores email verification tokens
- **Structure**: Array of verification token objects

#### Application Data (Tenant-Specific)
- **Key**: `ican-data-{tenantId}`
- **Purpose**: Stores application data for each tenant
- **Structure**:
```javascript
{
  contacts: Contact[],
  appointments: Appointment[],
  interactions: Interaction[],
  tasks: Task[],
  deals: Deal[],
  companies: Company[],
  settings: Settings,
  version: string,
  lastSync: timestamp
}
```

### Multi-Tenant Data Isolation

Each tenant has its own isolated data storage:

1. **Tenant-Specific Storage Keys**: Application data is stored with tenant-specific keys
2. **Automatic Isolation**: When a user logs in, only their tenant's data is loaded
3. **Separate Storage**: Different tenants cannot access each other's data
4. **Unique Identifiers**: Each tenant has a unique ID that prefixes their data

**Example Storage Keys:**
- Tenant 1: `ican-data-tenant-abc123`
- Tenant 2: `ican-data-tenant-def456`
- Tenant 3: `ican-data-tenant-ghi789`

## Data Flow

### Registration Flow
1. User fills registration form
2. New tenant is created with unique ID
3. New user is created linked to tenant
4. Verification token is generated
5. All data stored in localStorage
6. User receives verification email (mock)

### Login Flow
1. User enters credentials
2. System validates against stored users
3. User's tenant is retrieved
4. Session data stored in `ican-auth`
5. Tenant-specific data loaded from `ican-data-{tenantId}`
6. User redirected to dashboard

### Data Persistence
1. All data changes trigger automatic save
2. Data saved to tenant-specific storage key
3. Changes persist across browser sessions
4. No server required for data storage

## Data Capacity

### LocalStorage Limitations
- **Storage Limit**: ~5-10MB per domain
- **Browser Compatibility**: All modern browsers
- **Data Types**: Only strings (requires JSON serialization)
- **Persistence**: Persists until cleared by user or browser

### Current Data Usage
- **User Data**: ~1KB per user
- **Tenant Data**: ~2KB per tenant
- **Application Data**: ~100KB per tenant (typical usage)
- **Verification Tokens**: ~1KB per token

### Storage Optimization
- Data is JSON serialized
- Only essential data stored
- No unnecessary duplication
- Efficient data structures

## Security Considerations

### Current Security Model
- **Client-Side Storage**: Data stored in user's browser
- **No Server Transmission**: Data never leaves the browser
- **Local Isolation**: Data isolated by tenant ID
- **Password Storage**: Stored in localStorage (development only)

### Security Limitations
- **Not Secure for Production**: LocalStorage is not encrypted
- **Client-Side Validation**: Validation can be bypassed
- **No Server-Side Security**: No server-side authentication
- **Data Access**: Anyone with browser access can view data

### Security for Production
When moving to production with backend:
- Implement server-side authentication
- Use encrypted database storage
- Add proper authorization checks
- Implement data encryption at rest
- Add audit logging
- Use secure password hashing
- Implement proper session management

## Backend Integration Path

### Phase 1: Current State (Frontend-Only)
- ✅ LocalStorage for all data
- ✅ Multi-tenant architecture (client-side)
- ✅ Backend-ready data structures
- ✅ REST API-ready interfaces

### Phase 2: Backend Integration
- **Authentication API**: Replace localStorage auth with API calls
- **Data API**: Replace localStorage with REST API calls
- **Real Database**: Migrate to PostgreSQL/MySQL/MongoDB
- **Server-Side Validation**: Add server-side validation
- **Secure Password Storage**: Implement bcrypt/argon2

### Phase 3: Production Features
- **Encrypted Storage**: Data encryption at rest
- **API Rate Limiting**: Prevent abuse
- **Backup Systems**: Automated backups
- **Monitoring**: Application monitoring
- **CDN Integration**: Static asset delivery

## Database Schema (Future)

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  tenant_id UUID REFERENCES tenants(id),
  role VARCHAR(50) NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  avatar TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tenants Table
```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  plan VARCHAR(50) NOT NULL,
  settings JSONB,
  created_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Contacts Table
```sql
CREATE TABLE contacts (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  email VARCHAR(255),
  company VARCHAR(255),
  location VARCHAR(255),
  industry VARCHAR(100),
  source VARCHAR(50),
  stage VARCHAR(50),
  tags TEXT[],
  last_contact_date TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Data Backup and Export

### Current Backup Methods
- **Manual Export**: Users can export data to JSON
- **Browser Storage**: Data persists in browser
- **Manual Backup**: Users can manually backup localStorage

### Export Functionality
```javascript
// Export all tenant data
const exportData = () => {
  const data = {
    user: currentUser,
    tenant: currentTenant,
    contacts: allContacts,
    appointments: allAppointments,
    interactions: allInteractions,
    tasks: allTasks,
    deals: allDeals,
    companies: allCompanies,
    settings: currentSettings,
    exportDate: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ican-backup-${tenant.id}-${Date.now()}.json`;
  a.click();
};
```

## Data Migration

### Version Migration
- **Data Version**: Stored in each data object
- **Migration Logic**: Applied on data load
- **Backward Compatibility**: Maintained through version checks

### Example Migration
```javascript
const migrateData = (data) => {
  // Handle old companies format
  if (data.companies && !Array.isArray(data.companies)) {
    data.companies = Object.values(data.companies);
  }
  
  // Add new fields
  if (!data.settings.theme) {
    data.settings.theme = 'dark';
  }
  
  return data;
};
```

## Performance Considerations

### Current Performance
- **Load Time**: Instant (local storage)
- **Write Time**: Fast (no network calls)
- **Capacity**: Sufficient for typical usage
- **Latency**: Zero (no network)

### Performance Optimization
- **Lazy Loading**: Load data only when needed
- **Debounced Saves**: Prevent excessive writes
- **Efficient Updates**: Only update changed data
- **Memory Management**: Clean up unused data

## Future Enhancements

### Planned Features
- **Cloud Sync**: Optional cloud backup
- **Offline Support**: Service worker implementation
- **Data Compression**: Reduce storage usage
- **Incremental Sync**: Only sync changes
- **Conflict Resolution**: Handle data conflicts
- **Version History**: Track data changes

### Backend Features
- **API Rate Limiting**: Prevent abuse
- **Data Encryption**: End-to-end encryption
- **Access Control**: Fine-grained permissions
- **Audit Logging**: Track all data access
- **Real-time Sync**: WebSocket integration
- **Data Sharding**: Scale for large datasets

## Troubleshooting

### Common Issues

**Data Not Persisting**
- Check browser localStorage settings
- Ensure cookies/storage are enabled
- Check browser security settings

**Data Loss**
- Browser cache clearing
- Private browsing mode
- Storage quota exceeded

**Multi-Tenant Issues**
- Verify tenant ID is correct
- Check storage key format
- Ensure proper tenant association

### Debug Tools
```javascript
// Check all stored data
console.log('Auth Data:', localStorage.getItem('ican-auth'));
console.log('Users:', localStorage.getItem('ican-users'));
console.log('Tenants:', localStorage.getItem('ican-tenants'));
console.log('All Storage Keys:', Object.keys(localStorage));
```

## Conclusion

The current localStorage implementation provides a solid foundation for the iCan platform:
- **Immediate Functionality**: Works without backend
- **Multi-Tenant Ready**: Proper tenant isolation
- **Backend-Ready**: Designed for API integration
- **Scalable Path**: Clear migration path to production database

This architecture allows the platform to be used immediately while preparing for future backend integration with proper security, scalability, and production features.