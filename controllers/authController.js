const jwt = require('jsonwebtoken');

const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) return null;
  return authHeader.slice(7);
};

const toAuthUser = () => ({
  id: 'env-admin',
  email: process.env.ADMIN_EMAIL,
  username: process.env.ADMIN_EMAIL
});

const issueToken = () =>
  jwt.sign(
    { userId: 'env-admin', email: process.env.ADMIN_EMAIL, role: 'admin' },
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
    if (
      decoded.userId !== 'env-admin' ||
      decoded.email !== process.env.ADMIN_EMAIL ||
      decoded.role !== 'admin'
    ) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    res.json({ user: toAuthUser() });
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
    const normalizedEmail = String(email || '').toLowerCase();
    const expectedEmail = String(process.env.ADMIN_EMAIL || '').toLowerCase();
    const expectedPassword = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (!expectedEmail || !expectedPassword) {
      return res.status(500).json({ error: 'Admin credentials are not configured' });
    }

    if (normalizedEmail !== expectedEmail || password !== expectedPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = issueToken();
    res.json({
      message: 'Login successful',
      token,
      user: toAuthUser()
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

const register = async (req, res) => {
  return res.status(404).json({ error: 'Registration is disabled' });
};

module.exports = {
  login,
  register,
  verifyToken
};
