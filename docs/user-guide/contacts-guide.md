# Contact Management Guide

Learn how to effectively manage your professional contacts using iCan's comprehensive contact management system.

## Current Implementation Status

### ✅ Available Features
- **Contact CRUD Operations**: Create, read, update, and delete contacts
- **Search and Filtering**: Real-time search across contact fields
- **Bulk Import**: CSV import with validation
- **Export**: Export to CSV and JSON formats
- **Contact Detail View**: View all contact information with activity timeline
- **Tags and Notes**: Add custom tags and detailed notes
- **Stage Management**: Track relationship progress through stages

### 🚧 Coming Soon
- Company grouping and management
- Quick actions (call, email from contact view)
- Advanced saved filters
- Contact enrichment
- Merge duplicate contacts

## Contact Fields

Each contact in iCan includes the following information:

### Basic Information
- **Name** (required): Contact's full name
- **Phone**: Contact phone number
- **Email**: Email address
- **Company**: Company or organization name
- **Location**: Geographic location or region
- **Industry**: Industry sector or field

### Professional Details
- **Source**: How you connected (LinkedIn, WhatsApp, Other)
- **Stage**: Current relationship stage
- **Tags**: Custom tags for categorization (comma-separated)

### Additional Information
- **Notes**: Free-form notes about the contact

## Creating Contacts

### Single Contact Creation

1. Navigate to Contacts view
2. Click "Add Contact" button in the top navigation
3. Fill in the required fields (at minimum: Name)
4. Add optional information as available
5. Select initial stage and source
6. Click "Create Contact"

### Bulk Import

Import multiple contacts at once using CSV format:

1. Click "Import" button in the Contacts view
2. Format your data: `Name, Phone, Email, Company, Location, Industry, Source, Stage, Tags, Notes`
3. Example format:
   ```
   John Smith, +1234567890, john@example.com, Tech Corp, San Francisco, Technology, LinkedIn, New, VIP, Senior developer
   Jane Doe, +0987654321, jane@example.com, Startup Inc, New York, Finance, WhatsApp, Contacted, Lead, Investor
   ```
4. Paste your data into the text area
5. Click "Import" to process
6. Review any validation errors and correct if needed
7. Valid contacts will be automatically added

## Managing Contacts

### Viewing Contacts

**List View**: Shows all contacts in a searchable list with key information
- **Search**: Search by name, company, phone, or email in real-time
- **Filter by Source**: Filter contacts by LinkedIn, WhatsApp, or Other
- **Filter by Stage**: Filter by relationship stage (New, Contacted, Meeting, etc.)
- **Live Count**: See total contacts and filtered results count

**Detail View**: Comprehensive view of single contact including:
- All contact information (email, phone, company, location, industry)
- Current stage and source with color-coded badges
- Tags displayed as chips
- Activity timeline (appointments, interactions, tasks)
- Quick access to edit and delete actions

### Editing Contacts

1. Click on any contact in the list to open detail view
2. Click the "Edit Contact" button
3. Modify any fields as needed
4. Click "Save Changes" to update

### Deleting Contacts

1. Open contact detail view
2. Click "Delete Contact" button
3. Confirm deletion
4. **Note**: This action cannot be undone

## Contact Stages

Contacts progress through these stages:

1. **New**: Initial contact, no interaction yet
2. **Contacted**: First interaction completed
3. **Meeting**: Meeting scheduled or completed
4. **Negotiating**: Active business discussion
5. **Collaborating**: Formal relationship established
6. **Archived**: Relationship inactive or concluded

## Contact Sources

Track where contacts came from:

- **LinkedIn**: Connections from LinkedIn platform
- **WhatsApp**: Contacts from WhatsApp
- **Other**: Any other source

## Tags and Categorization

Use tags to categorize contacts:
- Add tags in the contact form (comma-separated)
- Examples: "VIP", "Lead", "Partner", "Investor", "Developer"
- Tags are displayed as colored chips in the detail view

## Export and Import

### Export Contacts

1. Go to Contacts view
2. Click "Export CSV" or "Export JSON" button
3. File will download automatically with timestamp
4. Format includes all contact fields

### Import Contacts

1. Click "Import" button in Contacts view
2. Paste CSV data with headers
3. System validates each contact
4. Shows errors for invalid entries
5. Valid contacts are imported automatically

**CSV Format Requirements**:
- First row must be headers
- Fields: Name, Phone, Email, Company, Location, Industry, Source, Stage, Tags, Notes
- Name is the only required field
- Tags should be separated by semicolons

## Best Practices

1. **Keep Information Current**: Regularly update contact details
2. **Use Stages Appropriately**: Update stages as relationships progress
3. **Add Context**: Use notes to remember important details
4. **Tag Strategically**: Use tags for meaningful categorization
5. **Regular Review**: Review contact list monthly for cleanup
6. **Backup Data**: Export contacts regularly for backup

## Integration with Other Features

Contacts integrate with all iCan features (coming soon):

- **Calendar**: Schedule appointments directly from contacts
- **Interactions**: Log interactions linked to specific contacts
- **Tasks**: Create follow-up tasks for contacts
- **Pipeline**: Track deals and opportunities per contact
- **Companies**: Group and manage by organization

## Troubleshooting

**Import Fails**: Check CSV format and ensure headers match exactly
**Validation Errors**: Review error messages for specific field issues
**Contact Not Saving**: Ensure name field is filled (required field)
**Search Not Working**: Clear filters and try again

For more help, see the [Troubleshooting Guide](../troubleshooting.md).
