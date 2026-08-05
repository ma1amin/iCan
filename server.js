require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const { hashPassword, comparePassword, generateToken, verifyToken, generateVerificationToken } = require('./src/lib/auth');

const app = express();

// Create PrismaClient with standard MySQL connection
const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

// Database connection retry wrapper
async function withRetry(fn, maxRetries = 3, delay = 2000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      console.log(`Database operation failed, retry ${i + 1}/${maxRetries}...`, error.message);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

const PORT = process.env.PORT || 3001;

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }

  req.user = decoded;
  next();
};

// Middleware to check tenant access
const checkTenantAccess = (req, res, next) => {
  if (req.user.tenantId !== req.body.tenantId && req.user.tenantId !== req.params.tenantId) {
    return res.status(403).json({ error: 'Access denied to this tenant' });
  }
  next();
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'iCan API is running' });
});

// Authentication routes

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('Register request received:', { email: req.body.email, name: req.body.name });
    const { email, password, name, organizationName } = req.body;

    if (!email || !password || !name) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Check if user already exists
    const existingUser = await withRetry(() => prisma.user.findUnique({
      where: { email }
    }));

    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create tenant
    console.log('Creating tenant...');
    const tenant = await withRetry(() => prisma.tenant.create({
      data: {
        name: organizationName || `${name}'s Organization`,
        slug: organizationName ? organizationName.toLowerCase().replace(/\s+/g, '-') : `${name.toLowerCase().replace(/\s+/g, '-')}-org`,
        plan: 'free',
        createdBy: email
      }
    }));
    console.log('Tenant created:', tenant.id);

    // Hash password
    console.log('Hashing password...');
    const passwordHash = await hashPassword(password);

    // First user in tenant becomes admin (current implementation creates new tenant per registration)
    // Future: Add invite system for admins to add members to existing tenants
    console.log('Creating user...');
    const user = await withRetry(() => prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        tenantId: tenant.id,
        emailVerified: false
      }
    }));

    // Generate verification token
    console.log('Generating verification token...');
    const verificationToken = generateVerificationToken();
    await withRetry(() => prisma.verificationToken.create({
      data: {
        userId: user.id,
        token: verificationToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      }
    }));

    // Generate JWT token
    console.log('Generating JWT token...');
    const token = generateToken({
      userId: user.id,
      email: user.email,
      tenantId: tenant.id
    });

    console.log('Registration successful for:', email);
    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified
      },
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        plan: tenant.plan
      },
      token,
      requiresVerification: true
    });
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('Login request received:', { email: req.body.email });
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    console.log('Finding user...');
    const user = await withRetry(() => prisma.user.findUnique({
      where: { email },
      include: { tenant: true }
    }));

    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    console.log('Verifying password...');
    const isValidPassword = await comparePassword(password, user.passwordHash);
    if (!isValidPassword) {
      console.log('Invalid password for:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    console.log('Generating JWT token...');
    const token = generateToken({
      userId: user.id,
      email: user.email,
      tenantId: user.tenantId
    });

    console.log('Login successful for:', email);

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
        avatar: user.avatar
      },
      tenant: {
        id: user.tenant.id,
        name: user.tenant.name,
        slug: user.tenant.slug,
        plan: user.tenant.plan,
        createdAt: user.tenant.createdAt
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

// Verify email
app.post('/api/auth/verify-email', async (req, res) => {
  try {
    const { token } = req.body;

    // Find verification token
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        token,
        usedAt: null,
        expiresAt: { gt: new Date() }
      }
    });

    if (!verificationToken) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    // Mark token as used
    await prisma.verificationToken.update({
      where: { id: verificationToken.id },
      data: { usedAt: new Date() }
    });

    // Update user email verification status
    await prisma.user.update({
      where: { id: verificationToken.userId },
      data: { emailVerified: true }
    });

    res.json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Email verification failed' });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: { tenant: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
        avatar: user.avatar
      },
      tenant: {
        id: user.tenant.id,
        name: user.tenant.name,
        slug: user.tenant.slug,
        plan: user.tenant.plan,
        createdAt: user.tenant.createdAt
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Update user profile
app.put('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const { name, avatar } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: { name, avatar }
    });

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Update user email
app.put('/api/auth/email', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newEmail } = req.body;

    // Verify current password
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    const isValidPassword = await comparePassword(currentPassword, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Check if new email is already taken
    const existingUser = await prisma.user.findUnique({
      where: { email: newEmail }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Update email and mark as unverified
    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: { 
        email: newEmail,
        emailVerified: false
      }
    });

    res.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        emailVerified: updatedUser.emailVerified,
        avatar: updatedUser.avatar
      }
    });
  } catch (error) {
    console.error('Update email error:', error);
    res.status(500).json({ error: 'Failed to update email' });
  }
});

// Delete account
app.delete('/api/auth/account', authenticateToken, async (req, res) => {
  try {
    const { password } = req.body;

    // Verify password
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    const isValidPassword = await comparePassword(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Delete user (cascade will delete related data)
    await prisma.user.delete({
      where: { id: req.user.userId }
    });

    // Delete tenant if user is the creator
    const tenant = await prisma.tenant.findUnique({
      where: { id: user.tenantId }
    });

    if (tenant && tenant.createdBy === user.email) {
      await prisma.tenant.delete({
        where: { id: user.tenantId }
      });
    }

    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

// Contacts CRUD routes (protected)

// Get all contacts for tenant
app.get('/api/contacts', authenticateToken, async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({
      where: { tenantId: req.user.tenantId }
    });

    res.json({ contacts });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ error: 'Failed to get contacts' });
  }
});

// Create contact
app.post('/api/contacts', authenticateToken, async (req, res) => {
  try {
    console.log('Create contact request body:', req.body);
    console.log('User tenantId:', req.user.tenantId);
    
    const contactData = {
      ...req.body,
      tenantId: req.user.tenantId
    };

    console.log('Contact data to create:', contactData);

    const contact = await prisma.contact.create({
      data: contactData
    });

    console.log('Contact created successfully:', contact);
    res.status(201).json({ contact });
  } catch (error) {
    console.error('Create contact error:', error);
    console.error('Error details:', error.message);
    console.error('Error code:', error.code);
    res.status(500).json({ error: 'Failed to create contact', details: error.message });
  }
});

// Update contact
app.put('/api/contacts/:id', authenticateToken, async (req, res) => {
  try {
    const contact = await prisma.contact.update({
      where: { 
        id: req.params.id,
        tenantId: req.user.tenantId
      },
      data: req.body
    });

    res.json({ contact });
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

// Delete contact
app.delete('/api/contacts/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.contact.delete({
      where: { 
        id: req.params.id,
        tenantId: req.user.tenantId
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

// Companies CRUD routes

// Get all companies for tenant
app.get('/api/companies', authenticateToken, async (req, res) => {
  try {
    const companies = await prisma.company.findMany({
      where: { tenantId: req.user.tenantId },
      include: {
        _count: {
          select: { contacts: true, deals: true }
        }
      }
    });

    res.json({ companies });
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({ error: 'Failed to get companies' });
  }
});

// Create company
app.post('/api/companies', authenticateToken, async (req, res) => {
  try {
    const companyData = {
      ...req.body,
      tenantId: req.user.tenantId
    };

    const company = await prisma.company.create({
      data: companyData
    });

    res.status(201).json({ company });
  } catch (error) {
    console.error('Create company error:', error);
    res.status(500).json({ error: 'Failed to create company' });
  }
});

// Update company
app.put('/api/companies/:id', authenticateToken, async (req, res) => {
  try {
    const company = await prisma.company.update({
      where: { 
        id: req.params.id,
        tenantId: req.user.tenantId
      },
      data: req.body
    });

    res.json({ company });
  } catch (error) {
    console.error('Update company error:', error);
    res.status(500).json({ error: 'Failed to update company' });
  }
});

// Delete company
app.delete('/api/companies/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.company.delete({
      where: { 
        id: req.params.id,
        tenantId: req.user.tenantId
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Delete company error:', error);
    res.status(500).json({ error: 'Failed to delete company' });
  }
});

// Appointments CRUD routes

// Get all appointments for tenant
app.get('/api/appointments', authenticateToken, async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { tenantId: req.user.tenantId },
      include: { contact: true, user: true }
    });

    res.json({ appointments });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ error: 'Failed to get appointments' });
  }
});

// Create appointment
app.post('/api/appointments', authenticateToken, async (req, res) => {
  try {
    const appointmentData = {
      ...req.body,
      tenantId: req.user.tenantId
    };

    const appointment = await prisma.appointment.create({
      data: appointmentData,
      include: { contact: true, user: true }
    });

    res.status(201).json({ appointment });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

// Update appointment
app.put('/api/appointments/:id', authenticateToken, async (req, res) => {
  try {
    const appointment = await prisma.appointment.update({
      where: { 
        id: req.params.id,
        tenantId: req.user.tenantId
      },
      data: req.body,
      include: { contact: true, user: true }
    });

    res.json({ appointment });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

// Delete appointment
app.delete('/api/appointments/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.appointment.delete({
      where: { 
        id: req.params.id,
        tenantId: req.user.tenantId
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
});

// Interactions CRUD routes

// Get all interactions for tenant
app.get('/api/interactions', authenticateToken, async (req, res) => {
  try {
    const interactions = await prisma.interaction.findMany({
      where: { tenantId: req.user.tenantId },
      include: { contact: true, user: true, appointment: true }
    });

    res.json({ interactions });
  } catch (error) {
    console.error('Get interactions error:', error);
    res.status(500).json({ error: 'Failed to get interactions' });
  }
});

// Create interaction
app.post('/api/interactions', authenticateToken, async (req, res) => {
  try {
    console.log('Create interaction request body:', req.body);
    console.log('User tenantId:', req.user.tenantId);
    
    const interactionData = {
      ...req.body,
      tenantId: req.user.tenantId
    };

    console.log('Interaction data to create:', interactionData);

    const interaction = await prisma.interaction.create({
      data: interactionData,
      include: { contact: true, user: true, appointment: true }
    });

    console.log('Interaction created successfully:', interaction);
    res.status(201).json({ interaction });
  } catch (error) {
    console.error('Create interaction error:', error);
    console.error('Error details:', error.message);
    console.error('Error code:', error.code);
    res.status(500).json({ error: 'Failed to create interaction', details: error.message });
  }
});

// Update interaction
app.put('/api/interactions/:id', authenticateToken, async (req, res) => {
  try {
    const interaction = await prisma.interaction.update({
      where: { 
        id: req.params.id,
        tenantId: req.user.tenantId
      },
      data: req.body,
      include: { contact: true, user: true, appointment: true }
    });

    res.json({ interaction });
  } catch (error) {
    console.error('Update interaction error:', error);
    res.status(500).json({ error: 'Failed to update interaction' });
  }
});

// Delete interaction
app.delete('/api/interactions/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.interaction.delete({
      where: { 
        id: req.params.id,
        tenantId: req.user.tenantId
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Delete interaction error:', error);
    res.status(500).json({ error: 'Failed to delete interaction' });
  }
});

// Tasks CRUD routes

// Get all tasks for tenant
app.get('/api/tasks', authenticateToken, async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { tenantId: req.user.tenantId },
      include: { contact: true, user: true }
    });

    res.json({ tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Failed to get tasks' });
  }
});

// Create task
app.post('/api/tasks', authenticateToken, async (req, res) => {
  try {
    const taskData = {
      ...req.body,
      tenantId: req.user.tenantId
    };

    const task = await prisma.task.create({
      data: taskData,
      include: { contact: true, user: true }
    });

    res.status(201).json({ task });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update task
app.put('/api/tasks/:id', authenticateToken, async (req, res) => {
  try {
    console.log('Update task request body:', req.body);
    console.log('Task ID:', req.params.id);
    console.log('User tenantId:', req.user.tenantId);
    
    const task = await prisma.task.update({
      where: { 
        id: req.params.id,
        tenantId: req.user.tenantId
      },
      data: req.body,
      include: { contact: true, user: true }
    });

    console.log('Task updated successfully:', task);
    res.json({ task });
  } catch (error) {
    console.error('Update task error:', error);
    console.error('Error details:', error.message);
    console.error('Error code:', error.code);
    res.status(500).json({ error: 'Failed to update task', details: error.message });
  }
});

// Delete task
app.delete('/api/tasks/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.task.delete({
      where: { 
        id: req.params.id,
        tenantId: req.user.tenantId
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Deals CRUD routes

// Get all deals for tenant
app.get('/api/deals', authenticateToken, async (req, res) => {
  try {
    const deals = await prisma.deal.findMany({
      where: { tenantId: req.user.tenantId },
      include: { contact: true, user: true }
    });

    res.json({ deals });
  } catch (error) {
    console.error('Get deals error:', error);
    res.status(500).json({ error: 'Failed to get deals' });
  }
});

// Create deal
app.post('/api/deals', authenticateToken, async (req, res) => {
  try {
    const dealData = {
      ...req.body,
      tenantId: req.user.tenantId
    };

    const deal = await prisma.deal.create({
      data: dealData,
      include: { contact: true, user: true }
    });

    res.status(201).json({ deal });
  } catch (error) {
    console.error('Create deal error:', error);
    res.status(500).json({ error: 'Failed to create deal' });
  }
});

// Update deal
app.put('/api/deals/:id', authenticateToken, async (req, res) => {
  try {
    console.log('Update deal request body:', req.body);
    console.log('Deal ID:', req.params.id);
    console.log('User tenantId:', req.user.tenantId);
    
    const deal = await prisma.deal.update({
      where: { 
        id: req.params.id,
        tenantId: req.user.tenantId
      },
      data: req.body,
      include: { contact: true, user: true }
    });

    console.log('Deal updated successfully:', deal);
    res.json({ deal });
  } catch (error) {
    console.error('Update deal error:', error);
    console.error('Error details:', error.message);
    console.error('Error code:', error.code);
    res.status(500).json({ error: 'Failed to update deal', details: error.message });
  }
});

// Delete deal
app.delete('/api/deals/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.deal.delete({
      where: { 
        id: req.params.id,
        tenantId: req.user.tenantId
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Delete deal error:', error);
    res.status(500).json({ error: 'Failed to delete deal' });
  }
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`iCan API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

// Keep server running
server.on('error', (err) => {
  console.error('Server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  }
});

// Prevent process from exiting
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});