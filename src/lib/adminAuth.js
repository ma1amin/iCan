const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'admin-secret-key-change-in-production';

// Generate admin token
const generateAdminToken = (admin) => {
  return jwt.sign(
    { 
      adminId: admin.id, 
      username: admin.username,
      email: admin.email
    },
    ADMIN_JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Verify admin token
const verifyAdminToken = (token) => {
  try {
    return jwt.verify(token, ADMIN_JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Middleware to verify admin token
const authenticateAdminToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Admin token required' });
  }

  const decoded = verifyAdminToken(token);
  if (!decoded) {
    return res.status(403).json({ error: 'Invalid or expired admin token' });
  }

  req.admin = decoded;
  next();
};

module.exports = {
  generateAdminToken,
  verifyAdminToken,
  authenticateAdminToken
};
