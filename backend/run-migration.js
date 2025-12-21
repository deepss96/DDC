const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  connectionLimit: 1,
  connectTimeout: 10000,
  ssl: false
};

console.log('Running database migration...\n');

// Read the SQL file
const sqlFilePath = path.join(__dirname, 'update-notification-types.sql');
const sqlQuery = fs.readFileSync(sqlFilePath, 'utf8');

console.log('SQL Query to execute:');
console.log(sqlQuery);
console.log('\n');

// Create connection
const db = mysql.createConnection(dbConfig);

db.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }

  console.log('✅ Connected to database successfully!\n');

  // Execute the SQL query
  db.query(sqlQuery, (queryErr, results) => {
    if (queryErr) {
      console.error('❌ Migration failed:', queryErr.message);
      console.error('Full error:', queryErr);
      db.end();
      process.exit(1);
    }

    console.log('✅ Migration completed successfully!');
    console.log('Results:', results);

    db.end();
    console.log('\n🎉 Database migration completed!');
    process.exit(0);
  });
});

// Handle connection errors
db.on('error', (err) => {
  console.error('❌ Database error:', err.message);
  process.exit(1);
});

// Timeout after 30 seconds
setTimeout(() => {
  console.error('❌ Migration timed out after 30 seconds');
  db.end();
  process.exit(1);
}, 30000);
