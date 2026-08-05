# Data Storage Architecture

## Overview

The iCan platform uses **MySQL** as the primary database with **Prisma ORM** for data access. This provides a scalable, production-ready backend with multi-tenant architecture, strong data integrity, and complex query capabilities.

## Current Storage Implementation

### Storage Technology: MySQL with Prisma ORM

**Why MySQL with Prisma?**
- **Scalability**: Handles large datasets efficiently
- **Multi-Tenant**: Built-in support for tenant isolation
- **Data Integrity**: ACID compliance for transaction safety
- **Complex Queries**: Excellent for complex business queries
- **Performance**: Proven scalability to billions of records
- **Type Safety**: Prisma provides type-safe database access
- **Developer Experience**: Excellent tooling and migrations
- **Wide Adoption**: Industry-standard with extensive community support
- **Admin Management**: Separate admin authentication and management system
- **Feedback System**: User feedback with ratings and priority management

### Database Schema

The platform uses 13 main models:

#### Core Models
- **Tenant**: Multi-tenant organization management
- **User**: User accounts with authentication
- **VerificationToken**: Email verification system
- **PasswordResetToken**: Password recovery system
- **Admin**: Platform administrator accounts for management
- **Notification**: Admin notifications for feedback and system events

#### Business Models
- **Contact**: Contact management
- **Company**: Company/organization tracking
- **Appointment**: Calendar and scheduling
- **Interaction**: Communication logging
- **Task**: Task management
- **Deal**: Pipeline and negotiations
- **Feedback**: User feedback system with ratings and priorities

### Multi-Tenant Data Isolation

Each tenant has completely isolated data:
- **Tenant-Specific Queries**: All queries include `tenantId` filter
- **Foreign Key Relationships**: Data is isolated via foreign keys
- **API-Level Isolation**: API routes enforce tenant access
- **Cascade Deletes**: Proper data cleanup when tenants are deleted

**Example Query:**
```javascript
// All contacts are automatically filtered by tenantId
const contacts = await prisma.contact.findMany({
  where: { tenantId: user.tenantId }
});
```

## API Architecture

### RESTful API Design

The platform uses Express.js with RESTful API endpoints:

#### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email` - Email verification
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `DELETE /api/auth/account` - Delete account

#### CRUD Endpoints
- **Contacts**: GET, POST, PUT, DELETE `/api/contacts`
- **Companies**: GET, POST, PUT, DELETE `/api/companies`
- **Appointments**: GET, POST, PUT, DELETE `/api/appointments`
- **Interactions**: GET, POST, PUT, DELETE `/api/interactions`
- **Tasks**: GET, POST, PUT, DELETE `/api/tasks`
- **Deals**: GET, POST, PUT, DELETE `/api/deals`

### Authentication

**JWT Token Flow:**
1. User logs in → Server validates credentials
2. Server generates JWT token with user/tenant info
3. Token stored in localStorage
4. Token included in Authorization header for API calls
5. Server validates token on protected routes

**Token Structure:**
```javascript
{
  userId: string,
  email: string,
  tenantId: string
}
```

## Data Migration

### localStorage to MySQL Migration

The platform includes a migration script to migrate existing localStorage data to MySQL:

**Migration Script Location:** `scripts/migrate-local-to-api.js`

**How to Use:**
1. Start the API server: `npm run server`
2. Login to the application with your existing account
3. Open browser console
4. Load the migration script
5. Run: `migrateLocalStorageToAPI()`

**Migration Process:**
1. Validates authentication token
2. Loads data from localStorage
3. Migrates in dependency order (companies → contacts → appointments, etc.)
4. Maps relationships using names to IDs
5. Reports success/failure for each entity
6. Offers option to clear localStorage after migration

**Data Mapping:**
- Companies: Direct migration with all fields
- Contacts: Maps company names to IDs
- Appointments: Maps contact names to IDs
- Interactions: Maps contact names to IDs
- Tasks: Maps contact names to IDs
- Deals: Maps contact and company names to IDs

## Data Access

### Frontend API Integration

The platform uses a centralized API client library:

**Location:** `src/lib/api.js`

**Features:**
- Automatic token inclusion in requests
- Centralized error handling
- Type-safe API calls
- Separate modules for each entity

**Example Usage:**
```javascript
import { contactsAPI } from '../lib/api';

// Get all contacts
const { contacts } = await contactsAPI.getAll();

// Create contact
const { contact } = await contactsAPI.create(contactData);
```

### Direct Database Access

For direct database access (seeds, scripts):

**Prisma Client Location:** `src/lib/prisma.js`

**Example Usage:**
```javascript
import prisma from '../lib/prisma';

// Direct database query
const contacts = await prisma.contact.findMany({
  where: { tenantId: user.tenantId },
  include: { company: true }
});
```

## Data Storage

### Database Configuration

**Connection String:** Stored in `.env` file
```
DATABASE_URL="postgres://user:password@host:port/database"
```

**Environment Variables:**
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT token secret
- `NODE_ENV` - Environment (development/production)
- `REACT_APP_API_URL` - Frontend API URL

### Database Migrations

**Prisma Migrations:** Located in `prisma/migrations/`

**Run Migrations:**
```bash
npx prisma migrate dev --name migration_name
```

**Production Migrations:**
```bash
npx prisma migrate deploy
```

## Security Considerations

### Current Security Model
- **Password Storage**: Hashed with bcryptjs
- **Authentication**: JWT tokens with expiration
- **Multi-Tenant Isolation**: Database-level tenant isolation
- **API Security**: Protected routes with JWT middleware
- **Input Validation**: Prisma schema validation
- **SQL Injection**: Protected by Prisma ORM

### Security Features
- **Password Hashing**: bcryptjs with salt rounds
- **JWT Tokens**: 7-day expiration, secure storage
- **Tenant Isolation**: All queries filtered by tenantId
- **Protected Routes**: JWT middleware on all protected endpoints
- **CORS**: Configured for frontend API access
- **Environment Variables**: Sensitive data in .env (not committed)

### Production Security Recommendations
- **HTTPS**: Required for production deployment
- **Strong JWT Secret**: Use environment variable with secure random string
- **Database Security**: Enable SSL/TLS for database connections
- **Rate Limiting**: Add rate limiting to API endpoints
- **Input Validation**: Add additional server-side validation
- **Audit Logging**: Log all data access and modifications
- **Regular Backups**: Automated database backups

## Performance Considerations

### Current Performance
- **Database**: PostgreSQL with indexes on frequently queried fields
- **API**: Express.js with async/await for non-blocking operations
- **Frontend**: Parallel data loading with Promise.all
- **Caching**: Future enhancement for database query caching

### Performance Optimization
- **Indexes**: Added on tenantId, foreign keys, and frequently queried fields
- **Query Optimization**: Prisma generates optimized SQL queries
- **Parallel Loading**: Frontend loads data in parallel
- **Connection Pooling**: Prisma manages database connections efficiently
- **Lazy Loading**: Components load data when needed

### Future Performance Enhancements
- **Read Replicas**: Add read replicas for scaling read operations
- **Query Caching**: Implement Redis caching for frequently accessed data
- **Database Partitioning**: Partition large tables by tenantId
- **Connection Pooling**: Tune connection pool settings
- **Query Optimization**: Add database-specific optimizations

## Scalability

### Current Scalability
- **Vertical Scaling**: Add more resources to single server
- **Database Scaling**: PostgreSQL handles large datasets efficiently
- **Multi-Tenant**: Architecture supports many tenants
- **API Scaling**: Express.js can be scaled with load balancers

### Scalability Path
- **Phase 1**: Single PostgreSQL instance (current)
- **Phase 2**: Read replicas for read-heavy workloads
- **Phase 3**: Database partitioning by tenantId
- **Phase 4**: Horizontal scaling with load balancers
- **Phase 5**: Database sharding across multiple servers

### Scalability Features
- **Tenant Isolation**: Each tenant's data is separate
- **Index Strategy**: Optimized for multi-tenant queries
- **Connection Pooling**: Efficient database connection management
- **API Stateless**: API can be scaled horizontally
- **Frontend Static**: Can be served via CDN

## Backup and Recovery

### Current Backup Strategy
- **Database Backups**: Manual PostgreSQL backups
- **Export Functionality**: Users can export data to JSON
- **Migration Script**: Can be used for data transfer

### Production Backup Recommendations
- **Automated Backups**: Daily automated database backups
- **Point-in-Time Recovery**: Configure PITR for PostgreSQL
- **Backup Rotation**: Keep multiple backup versions
- **Offsite Storage**: Store backups in secure offsite location
- **Backup Testing**: Regularly test backup restoration

### Export Functionality
Users can export their data from the frontend:
- Contacts, appointments, interactions, tasks, deals
- All data in JSON format
- Complete data for backup purposes

## Troubleshooting

### Common Issues

**Database Connection Issues**
- Check DATABASE_URL in .env file
- Ensure PostgreSQL server is running
- Verify connection credentials
- Check database permissions

**API Connection Issues**
- Ensure API server is running on port 3001
- Check REACT_APP_API_URL in .env
- Verify CORS configuration
- Check browser console for errors

**Migration Issues**
- Ensure you're logged in before running migration
- Check that API server is running
- Verify localStorage contains data
- Check browser console for migration errors

**Multi-Tenant Issues**
- Verify tenantId is included in all queries
- Check API middleware is enforcing tenant access
- Ensure JWT token contains correct tenantId
- Check database foreign key relationships

### Debug Tools
```javascript
// Check database connection
npx prisma db push

// Regenerate Prisma client
npx prisma generate

// View database schema
npx prisma studio

// Check API health
fetch('http://localhost:3001/api/health')
```

## Future Enhancements

### Planned Database Features
- **Row-Level Security**: PostgreSQL RLS for additional security
- **Database Triggers**: Automatic timestamp updates
- **Stored Procedures**: Complex database operations
- **Materialized Views**: Performance optimization for complex queries
- **Full-Text Search**: Enhanced search capabilities

### Planned API Features
- **GraphQL**: Alternative to REST API
- **WebSockets**: Real-time updates
- **File Upload**: Enhanced file handling
- **Bulk Operations**: Bulk import/export
- **Advanced Filtering**: Complex query parameters

### Planned Security Features
- **Two-Factor Authentication**: Enhanced security
- **API Rate Limiting**: Prevent abuse
- **IP Whitelisting**: Additional security layer
- **Audit Logging**: Comprehensive activity logging
- **Session Management**: Enhanced session controls

## Conclusion

The PostgreSQL implementation provides a solid, scalable foundation for the iCan platform:
- **Production-Ready Database**: PostgreSQL with Prisma ORM
- **Multi-Tenant Architecture**: Complete tenant isolation
- **Secure Authentication**: JWT tokens with password hashing
- **Scalable API**: RESTful API with proper security
- **Data Migration**: Path from localStorage to PostgreSQL
- **Performance Optimized**: Indexes and query optimization
- **Future-Ready**: Clear path for scaling and enhancements

This architecture allows the platform to scale to production with enterprise-grade database capabilities while maintaining the developer-friendly Prisma ORM for easy data access.