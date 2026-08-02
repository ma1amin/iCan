/**
 * Data Migration Script: localStorage to PostgreSQL API
 * 
 * This script migrates existing localStorage data to the PostgreSQL database via the API.
 * Run this in the browser console after logging in with your existing account.
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('ican-token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
};

// Migration functions
const migrateCompanies = async (companies) => {
  console.log('🏢 Migrating companies...');
  let successCount = 0;
  let errorCount = 0;

  for (const company of companies) {
    try {
      const companyData = {
        name: company.name,
        industry: company.industry,
        size: company.size,
        location: company.location,
        website: company.website,
        foundedYear: company.foundedYear,
        revenue: company.revenue,
        employeeCount: company.employeeCount,
        description: company.description,
        tags: company.tags || [],
        notes: company.notes
      };

      await apiCall('/companies', {
        method: 'POST',
        body: JSON.stringify(companyData),
      });

      successCount++;
      console.log(`✅ Migrated company: ${company.name}`);
    } catch (error) {
      errorCount++;
      console.error(`❌ Failed to migrate company ${company.name}:`, error.message);
    }
  }

  console.log(`🏢 Companies: ${successCount} succeeded, ${errorCount} failed`);
  return { successCount, errorCount };
};

const migrateContacts = async (contacts, companies) => {
  console.log('👥 Migrating contacts...');
  let successCount = 0;
  let errorCount = 0;

  // Create company name to ID mapping
  const companyMap = {};
  companies.forEach(company => {
    companyMap[company.name] = company.id;
  });

  for (const contact of contacts) {
    try {
      const contactData = {
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        location: contact.location,
        industry: contact.industry,
        source: contact.source,
        stage: contact.stage,
        tags: contact.tags || [],
        lastContactDate: contact.lastContactDate ? new Date(contact.lastContactDate).toISOString() : null,
        notes: contact.notes,
        companyId: contact.company && companyMap[contact.company] ? companyMap[contact.company] : null
      };

      await apiCall('/contacts', {
        method: 'POST',
        body: JSON.stringify(contactData),
      });

      successCount++;
      console.log(`✅ Migrated contact: ${contact.name}`);
    } catch (error) {
      errorCount++;
      console.error(`❌ Failed to migrate contact ${contact.name}:`, error.message);
    }
  }

  console.log(`👥 Contacts: ${successCount} succeeded, ${errorCount} failed`);
  return { successCount, errorCount };
};

const migrateAppointments = async (appointments, contacts) => {
  console.log('📅 Migrating appointments...');
  let successCount = 0;
  let errorCount = 0;

  // Create contact name to ID mapping
  const contactMap = {};
  contacts.forEach(contact => {
    contactMap[contact.name] = contact.id;
  });

  for (const appointment of appointments) {
    try {
      const appointmentData = {
        title: appointment.title,
        description: appointment.description,
        startTime: new Date(appointment.startTime).toISOString(),
        endTime: new Date(appointment.endTime).toISOString(),
        location: appointment.location,
        type: appointment.type,
        recurrence: appointment.recurrence,
        reminder: appointment.reminder,
        status: appointment.status,
        contactId: appointment.contactId && contactMap[appointment.contactId] ? contactMap[appointment.contactId] : null
      };

      await apiCall('/appointments', {
        method: 'POST',
        body: JSON.stringify(appointmentData),
      });

      successCount++;
      console.log(`✅ Migrated appointment: ${appointment.title}`);
    } catch (error) {
      errorCount++;
      console.error(`❌ Failed to migrate appointment ${appointment.title}:`, error.message);
    }
  }

  console.log(`📅 Appointments: ${successCount} succeeded, ${errorCount} failed`);
  return { successCount, errorCount };
};

const migrateInteractions = async (interactions, contacts) => {
  console.log('💬 Migrating interactions...');
  let successCount = 0;
  let errorCount = 0;

  // Create contact name to ID mapping
  const contactMap = {};
  contacts.forEach(contact => {
    contactMap[contact.name] = contact.id;
  });

  for (const interaction of interactions) {
    try {
      const interactionData = {
        type: interaction.type,
        direction: interaction.direction,
        subject: interaction.subject,
        content: interaction.content,
        timestamp: new Date(interaction.timestamp).toISOString(),
        duration: interaction.duration,
        outcome: interaction.outcome,
        contactId: interaction.contactId && contactMap[interaction.contactId] ? contactMap[interaction.contactId] : null,
        appointmentId: interaction.appointmentId || null
      };

      await apiCall('/interactions', {
        method: 'POST',
        body: JSON.stringify(interactionData),
      });

      successCount++;
      console.log(`✅ Migrated interaction: ${interaction.subject || 'No subject'}`);
    } catch (error) {
      errorCount++;
      console.error(`❌ Failed to migrate interaction:`, error.message);
    }
  }

  console.log(`💬 Interactions: ${successCount} succeeded, ${errorCount} failed`);
  return { successCount, errorCount };
};

const migrateTasks = async (tasks, contacts) => {
  console.log('✅ Migrating tasks...');
  let successCount = 0;
  let errorCount = 0;

  // Create contact name to ID mapping
  const contactMap = {};
  contacts.forEach(contact => {
    contactMap[contact.name] = contact.id;
  });

  for (const task of tasks) {
    try {
      const taskData = {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null,
        reminder: task.reminder,
        estimatedTime: task.estimatedTime,
        actualTime: task.actualTime,
        category: task.category,
        tags: task.tags || [],
        linkedItems: task.linkedItems,
        contactId: task.contactId && contactMap[task.contactId] ? contactMap[task.contactId] : null
      };

      await apiCall('/tasks', {
        method: 'POST',
        body: JSON.stringify(taskData),
      });

      successCount++;
      console.log(`✅ Migrated task: ${task.title}`);
    } catch (error) {
      errorCount++;
      console.error(`❌ Failed to migrate task ${task.title}:`, error.message);
    }
  }

  console.log(`✅ Tasks: ${successCount} succeeded, ${errorCount} failed`);
  return { successCount, errorCount };
};

const migrateDeals = async (deals, contacts, companies) => {
  console.log('💰 Migrating deals...');
  let successCount = 0;
  let errorCount = 0;

  // Create contact name to ID mapping
  const contactMap = {};
  contacts.forEach(contact => {
    contactMap[contact.name] = contact.id;
  });

  // Create company name to ID mapping
  const companyMap = {};
  companies.forEach(company => {
    companyMap[company.name] = company.id;
  });

  for (const deal of deals) {
    try {
      const dealData = {
        name: deal.name,
        value: deal.value,
        currency: deal.currency,
        probability: deal.probability,
        expectedCloseDate: deal.expectedCloseDate ? new Date(deal.expectedCloseDate).toISOString() : null,
        stage: deal.stage,
        source: deal.source,
        competitors: deal.competitors || [],
        nextSteps: deal.nextSteps || [],
        tags: deal.tags || [],
        notes: deal.notes,
        contactId: deal.contactId && contactMap[deal.contactId] ? contactMap[deal.contactId] : null,
        companyId: deal.company && companyMap[deal.company] ? companyMap[deal.company] : null
      };

      await apiCall('/deals', {
        method: 'POST',
        body: JSON.stringify(dealData),
      });

      successCount++;
      console.log(`✅ Migrated deal: ${deal.name}`);
    } catch (error) {
      errorCount++;
      console.error(`❌ Failed to migrate deal ${deal.name}:`, error.message);
    }
  }

  console.log(`💰 Deals: ${successCount} succeeded, ${errorCount} failed`);
  return { successCount, errorCount };
};

// Main migration function
const migrateLocalStorageToAPI = async () => {
  console.log('🚀 Starting data migration from localStorage to PostgreSQL API...');
  console.log('='.repeat(60));

  try {
    // Check if user is authenticated
    const token = localStorage.getItem('ican-token');
    if (!token) {
      throw new Error('No authentication token found. Please login first.');
    }

    // Verify token is valid
    await apiCall('/auth/me');
    console.log('✅ Authentication verified');

    // Load data from localStorage
    const storageKey = 'ican-data';
    const stored = localStorage.getItem(storageKey);
    
    if (!stored) {
      console.log('⚠️ No localStorage data found. Nothing to migrate.');
      return;
    }

    const data = JSON.parse(stored);
    console.log('📦 Loaded data from localStorage');
    console.log(`   - Companies: ${data.companies?.length || 0}`);
    console.log(`   - Contacts: ${data.contacts?.length || 0}`);
    console.log(`   - Appointments: ${data.appointments?.length || 0}`);
    console.log(`   - Interactions: ${data.interactions?.length || 0}`);
    console.log(`   - Tasks: ${data.tasks?.length || 0}`);
    console.log(`   - Deals: ${data.deals?.length || 0}`);
    console.log('='.repeat(60));

    // Migrate in dependency order
    const results = {};

    // 1. Migrate companies first (no dependencies)
    if (data.companies && data.companies.length > 0) {
      results.companies = await migrateCompanies(data.companies);
      
      // Reload companies to get their IDs
      const companiesRes = await apiCall('/companies');
      data.companies = companiesRes.companies;
    }

    // 2. Migrate contacts (depends on companies)
    if (data.contacts && data.contacts.length > 0) {
      results.contacts = await migrateContacts(data.contacts, data.companies || []);
      
      // Reload contacts to get their IDs
      const contactsRes = await apiCall('/contacts');
      data.contacts = contactsRes.contacts;
    }

    // 3. Migrate appointments (depends on contacts)
    if (data.appointments && data.appointments.length > 0) {
      results.appointments = await migrateAppointments(data.appointments, data.contacts || []);
    }

    // 4. Migrate interactions (depends on contacts)
    if (data.interactions && data.interactions.length > 0) {
      results.interactions = await migrateInteractions(data.interactions, data.contacts || []);
    }

    // 5. Migrate tasks (depends on contacts)
    if (data.tasks && data.tasks.length > 0) {
      results.tasks = await migrateTasks(data.tasks, data.contacts || []);
    }

    // 6. Migrate deals (depends on contacts and companies)
    if (data.deals && data.deals.length > 0) {
      results.deals = await migrateDeals(data.deals, data.contacts || [], data.companies || []);
    }

    // Summary
    console.log('='.repeat(60));
    console.log('🎉 Migration completed!');
    console.log('Summary:');
    Object.entries(results).forEach(([entity, { successCount, errorCount }]) => {
      console.log(`   ${entity}: ${successCount} succeeded, ${errorCount} failed`);
    });

    // Ask if user wants to backup and clear localStorage
    const shouldClear = confirm('Migration completed! Would you like to clear the old localStorage data? (Cancel to keep it as backup)');
    if (shouldClear) {
      localStorage.removeItem(storageKey);
      console.log('🗑️ LocalStorage data cleared');
    } else {
      console.log('💾 LocalStorage data kept as backup');
    }

    return results;
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Stack trace:', error);
    throw error;
  }
};

// Make it available globally
window.migrateLocalStorageToAPI = migrateLocalStorageToAPI;

console.log('🔧 Migration script loaded! Run migrateLocalStorageToAPI() to start migration.');
console.log('📝 Make sure you are logged in before running the migration.');