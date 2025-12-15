const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import configuration
const config = require('./src/config/config');

// Import database connection
const db = require('./src/config/database');

// Import routes
const authRoutes = require('./src/routes/auth');
const leadRoutes = require('./src/routes/leads');
const userRoutes = require('./src/routes/users');
const taskRoutes = require('./src/routes/tasks');
const commentRoutes = require('./src/routes/comments');
const notificationRoutes = require('./src/routes/notifications');

const app = express();
const PORT = config.server.port;

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // In development, allow localhost
    if (process.env.NODE_ENV !== 'production') {
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }
    }

    // In production, allow the configured frontend URL and common patterns
    const allowedOrigins = [
      config.api.frontendUrl,
      // Allow same domain
      origin.replace(/^https?:\/\//, '').split(':')[0] === config.server.host ? origin : null,
      // Allow api subdomain if frontend is on main domain
      config.api.frontendUrl ? config.api.frontendUrl.replace(/^https?:\/\//, '').replace('www.', 'api.') : null
    ].filter(Boolean);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow all origins in development
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);
console.log('Comment routes registered at /api/comments');
console.log('Notification routes registered at /api/notifications');

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
