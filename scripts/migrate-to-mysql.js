/**
 * Data Migration Script for MySQL Transition
 * 
 * This script helps migrate data from any existing storage to the new MySQL database
 * with proper multi-tenant architecture.
 * 
 * Usage: node scripts/migrate-to-mysql.js
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrateData() {
  try {
    console.log('Starting data migration to MySQL...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
    
    // Test database connection
    await prisma.$connect();
    console.log('✓ Connected to MySQL database');
    
    // Check if any data exists
    const userCount = await prisma.user.count();
    const tenantCount = await prisma.tenant.count();
    
    console.log(`Current data: ${userCount} users, ${tenantCount} tenants`);
    
    if (userCount === 0 && tenantCount === 0) {
      console.log('Database is empty. Migration not needed.');
      console.log('You can start by registering users through the application.');
    } else {
      console.log('Database already contains data.');
      console.log('If you want to reset the database, run: npx prisma migrate reset --force');
    }
    
    // Additional migration logic can be added here if needed
    // For example:
    // - Migrating from localStorage to MySQL
    // - Migrating from another database
    // - Adding tenant IDs to existing data
    
    console.log('Migration check completed successfully!');
    
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
migrateData();