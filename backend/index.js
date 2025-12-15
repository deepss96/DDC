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
    ? process.env.FRONTEND_URL || true  // Allow from FRONTEND_URL or all if not set
    : true, // Allow all in development
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
