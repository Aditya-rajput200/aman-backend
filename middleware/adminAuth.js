const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');

const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) return null;
  return authHeader.slice(7);
};

const requireAdminAuth = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await AdminUser.findById(decoded.userId).select('-password');

    if (!admin) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.adminUser = {
      id: String(admin._id),
      email: admin.email,
      username: admin.username || admin.email
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    console.error('Error validating admin token:', error);
    return res.status(500).json({ error: 'Failed to validate token' });
  }
};

module.exports = {
  requireAdminAuth
};
