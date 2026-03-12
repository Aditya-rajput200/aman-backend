const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');

const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) return null;
  return authHeader.slice(7);
};

const toAuthUser = (userDoc) => ({
  id: String(userDoc._id),
  email: userDoc.email,
  username: userDoc.username || userDoc.email
});

const issueToken = (userDoc) =>
  jwt.sign(
    { userId: String(userDoc._id), email: userDoc.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

const verifyToken = async (req, res) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await AdminUser.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    res.json({ user: toAuthUser(user) });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    console.error('Error verifying token:', error);
    res.status(500).json({ error: 'Token verification failed' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await AdminUser.findOne({ email: String(email).toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = issueToken(user);
    res.json({
      message: 'Login successful',
      token,
      user: toAuthUser(user)
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

const register = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const existing = await AdminUser.findOne({ email: String(email).toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: 'Admin user already exists for this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await AdminUser.create({
      email: String(email).toLowerCase(),
      username: username || String(email).toLowerCase(),
      password: hashedPassword
    });

    const token = issueToken(user);
    res.status(201).json({
      message: 'Admin user created',
      token,
      user: toAuthUser(user)
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

module.exports = {
  login,
  register,
  verifyToken
};
