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
  origin: process.env.NODE_ENV === 'production'
    ? ['https://nirmaan-track-frontend.onrender.com', 'https://nirmaan-track-backend.onrender.com']  // Allow specific origins in production
    : true, // Allow all in development
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

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

// Database health check route
app.get('/api/health/db', (req, res) => {
  db.query('SELECT 1 as test', (err, results) => {
    if (err) {
      console.error('Database health check failed:', err);
      return res.status(500).json({
        status: 'ERROR',
        message: 'Database connection failed',
        error: err.message
      });
    }
    res.json({
      status: 'OK',
      message: 'Database connection successful',
      test: results[0]
    });
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
