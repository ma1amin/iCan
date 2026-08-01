// Import/Export utilities for contacts

/**
 * Parse CSV data and convert to contact objects
 * Format: Name, Phone, Email, Company, Location, Industry, Source, Stage, Tags, Notes
 */
export const parseCSV = (csvText) => {
  const lines = csvText.split('\n').map(line => line.trim()).filter(Boolean);
  
  if (lines.length === 0) {
    return [];
  }

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const contacts = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    
    if (values.length === 0 || values.every(v => !v)) {
      continue;
    }

    const contact = {};
    headers.forEach((header, index) => {
      contact[header] = values[index] || '';
    });

    // Map CSV fields to contact structure
    const mappedContact = {
      name: contact.name || '',
      phone: contact.phone || '',
      email: contact.email || '',
      company: contact.company || '',
      location: contact.location || '',
      industry: contact.industry || '',
      source: normalizeSource(contact.source),
      stage: normalizeStage(contact.stage),
      tags: contact.tags ? contact.tags.split(';').map(t => t.trim()).filter(Boolean) : [],
      notes: contact.notes || ''
    };

    if (mappedContact.name) {
      contacts.push(mappedContact);
    }
  }

  return contacts;
};

/**
 * Normalize source value
 */
const normalizeSource = (source) => {
  if (!source) return 'whatsapp';
  const normalized = source.toLowerCase();
  if (normalized.includes('linkedin')) return 'linkedin';
  if (normalized.includes('whatsapp')) return 'whatsapp';
  return 'other';
};

/**
 * Normalize stage value
 */
const normalizeStage = (stage) => {
  if (!stage) return 'New';
  const normalized = stage.toLowerCase();
  const stages = ['new', 'contacted', 'meeting', 'negotiating', 'collaborating', 'archived'];
  return stages.find(s => normalized.includes(s)) || 'New';
};

/**
 * Convert contacts to CSV format
 */
export const contactsToCSV = (contacts) => {
  const headers = ['Name', 'Phone', 'Email', 'Company', 'Location', 'Industry', 'Source', 'Stage', 'Tags', 'Notes'];
  
  const csvRows = [headers.join(',')];
  
  contacts.forEach(contact => {
    const row = [
      contact.name || '',
      contact.phone || '',
      contact.email || '',
      contact.company || '',
      contact.location || '',
      contact.industry || '',
      contact.source || '',
      contact.stage || '',
      contact.tags ? contact.tags.join(';') : '',
      contact.notes || ''
    ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(',');
    
    csvRows.push(row);
  });

  return csvRows.join('\n');
};

/**
 * Convert contacts to JSON format
 */
export const contactsToJSON = (contacts) => {
  return JSON.stringify(contacts, null, 2);
};

/**
 * Download data as file
 */
export const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Export contacts to CSV
 */
export const exportContactsCSV = (contacts) => {
  const csv = contactsToCSV(contacts);
  const filename = `contacts-export-${new Date().toISOString().split('T')[0]}.csv`;
  downloadFile(csv, filename, 'text/csv');
};

/**
 * Export contacts to JSON
 */
export const exportContactsJSON = (contacts) => {
  const json = contactsToJSON(contacts);
  const filename = `contacts-export-${new Date().toISOString().split('T')[0]}.json`;
  downloadFile(json, filename, 'application/json');
};

/**
 * Validate contact data
 */
export const validateContact = (contact) => {
  const errors = {};

  if (!contact.name || !contact.name.trim()) {
    errors.name = 'Name is required';
  }

  if (contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
    errors.email = 'Invalid email format';
  }

  if (contact.phone && !/^\+?[\d\s\-()]+$/.test(contact.phone)) {
    errors.phone = 'Invalid phone format';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
