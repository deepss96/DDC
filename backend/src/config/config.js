// Application Configuration
const config = {
  // Server Configuration
  server: {
    port: process.env.PORT || 5000,
    host: process.env.HOST || 'localhost',
    env: process.env.NODE_ENV || 'development'
  },

  // Database Configuration
  database: {
    host: process.env.DB_HOST || 'srv947.hstgr.io',
    user: process.env.DB_USER || 'u779658787_ddnirmaan_user',
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : 'P0wer@2025',
    name: process.env.DB_NAME || 'u779658787_ddc_nirmaan_db'
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },

  // API Base URLs
  api: {
    baseUrl: process.env.API_BASE_URL || 'https://nirmaan-track-backend.onrender.com',
    frontendUrl: process.env.FRONTEND_URL || 'https://nirmaan-track-frontend.onrender.com'
  }
};

module.exports = config;
