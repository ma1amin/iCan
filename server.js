const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const { hashPassword, comparePassword, generateToken, verifyToken, generateVerificationToken } = require('./src/lib/auth');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

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
    const { email, password, name, organizationName } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create tenant
    const tenant = await prisma.tenant.create({
      data: {
        name: organizationName || `${name}'s Organization`,
        slug: organizationName ? organizationName.toLowerCase().replace(/\s+/g, '-') : `${name.toLowerCase().replace(/\s+/g, '-')}-org`,
        plan: 'free',
        createdBy: email
      }
    });

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        tenantId: tenant.id,
        role: 'admin',
        emailVerified: false
      }
    });

    // Generate verification token
    const verificationToken = generateVerificationToken();
    await prisma.verificationToken.create({
      data: {
        userId: user.id,
        token: verificationToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      }
    });

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      tenantId: tenant.id
    });

    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
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
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { tenant: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      tenantId: user.tenantId
    });

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
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
    res.status(500).json({ error: 'Login failed' });
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
        role: user.role,
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
        role: user.role,
        emailVerified: user.emailVerified,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
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
      where: { tenantId: req.user.tenantId },
      include: { company: true }
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
    const contactData = {
      ...req.body,
      tenantId: req.user.tenantId
    };

    const contact = await prisma.contact.create({
      data: contactData,
      include: { company: true }
    });

    res.status(201).json({ contact });
  } catch (error) {
    console.error('Create contact error:', error);
    res.status(500).json({ error: 'Failed to create contact' });
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
      data: req.body,
      include: { company: true }
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

// Start server
app.listen(PORT, () => {
  console.log(`iCan API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});