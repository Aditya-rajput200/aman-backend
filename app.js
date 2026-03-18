const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // Allow server-to-server requests and tools that do not send an Origin header.
    if (!origin) {
      return callback(null, true);
    }

    // If no specific origins configured, allow all (reflect request origin).
    if (allowedOrigins.length === 0) {
      return callback(null, origin);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, origin);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204,
};

// Connect to MongoDB once per runtime lifecycle
connectDB().catch((error) => {
  console.error('Initial MongoDB connection failed:', error.message);
});

// Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/projects', require('./routes/projects'));
app.use('/api/services', require('./routes/services'));
app.use('/api/about', require('./routes/about'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/section-images', require('./routes/sectionImages'));
app.use('/api/cloudinary', require('./routes/cloudinary'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({
    error: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

module.exports = app;
