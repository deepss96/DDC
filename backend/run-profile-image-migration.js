const mysql = require('mysql2');
const fs = require('fs');
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

console.log('Running profile image field migration...\n');

// Create connection
const db = mysql.createConnection(dbConfig);

db.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }

  console.log('✅ Connected to database successfully!\n');

  // Read the SQL file
  const sqlFile = './update-profile-image-field.sql';
  const sql = fs.readFileSync(sqlFile, 'utf8');

  console.log('Executing SQL:', sql.trim());

  // Execute the SQL
  db.query(sql, (queryErr, results) => {
    if (queryErr) {
      console.error('❌ SQL execution failed:', queryErr.message);
      db.end();
      process.exit(1);
    }

    console.log('✅ SQL executed successfully!');
    console.log('Results:', results);

    db.end();
    console.log('✅ Migration completed!');
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
