const mysql = require('mysql2');
require('dotenv').config();

// Database configuration
const dbConfig = {
  // Live database (commented out for local development)
  // host: process.env.DB_HOST || 'srv947.hstgr.io',
  // user: process.env.DB_USER || 'u779658787_ddnirmaan_user',
  // password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : 'P0wer@2025',
  // database: process.env.DB_NAME || 'u779658787_ddc_nirmaan_db',
  // port: process.env.DB_PORT || 3306,

  // Local database configuration
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ddc_developer',
  port: process.env.DB_PORT || 3306,

  connectionLimit: process.env.NODE_ENV === 'production' ? 2 : 10, // Lower limit for production
  connectTimeout: 60000, // 60 seconds timeout
  acquireTimeout: 60000,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false // Allow self-signed certificates
  } : false
};

// Create connection pool
const db = mysql.createPool(dbConfig);

// Test connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');
  connection.release();
});

// Handle pool errors
db.on('error', (err) => {
  console.error('Database pool error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('Database connection was closed.');
  }
  if (err.code === 'ER_CON_COUNT_ERROR') {
    console.log('Database has too many connections.');
  }
  if (err.code === 'ECONNREFUSED') {
    console.log('Database connection was refused.');
  }
});

module.exports = db;
