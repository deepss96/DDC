const mysql = require('mysql2');
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

console.log('Checking database structure...\n');
console.log('Database Details:');
console.log(`📍 Host: ${process.env.DB_HOST}`);
console.log(`👤 User: ${process.env.DB_USER}`);
console.log(`🗄️  Database: ${process.env.DB_NAME}`);
console.log(`🔌 Port: ${process.env.DB_PORT}\n`);

// Create connection
const db = mysql.createConnection(dbConfig);

db.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }

  console.log('✅ Connected to database successfully!\n');

  // Get all tables
  const query = `
    SELECT TABLE_NAME, TABLE_ROWS, CREATE_TIME, UPDATE_TIME
    FROM information_schema.TABLES
    WHERE TABLE_SCHEMA = ?
    ORDER BY TABLE_NAME
  `;

  db.query(query, [process.env.DB_NAME], (queryErr, results) => {
    if (queryErr) {
      console.error('❌ Error fetching tables:', queryErr.message);
      db.end();
      process.exit(1);
    }

    console.log('📊 Database Tables:');
    console.log('==================');

    if (results.length === 0) {
      console.log('No tables found in the database.');
    } else {
      console.log(`Total Tables: ${results.length}\n`);

      results.forEach((table, index) => {
        console.log(`${index + 1}. ${table.TABLE_NAME}`);
        console.log(`   📈 Rows: ${table.TABLE_ROWS || 'Unknown'}`);
        console.log(`   📅 Created: ${table.CREATE_TIME || 'Unknown'}`);
        console.log(`   🔄 Updated: ${table.UPDATE_TIME || 'Unknown'}\n`);
      });

      // Get detailed structure for each table
      let completedTables = 0;
      const totalTables = results.length;

      console.log('🔍 Detailed Table Structures:');
      console.log('==============================\n');

      results.forEach((table) => {
        const describeQuery = `DESCRIBE \`${table.TABLE_NAME}\``;

        db.query(describeQuery, (descErr, columns) => {
          if (!descErr) {
            console.log(`📋 Table: ${table.TABLE_NAME}`);
            console.log(`   Columns: ${columns.length}`);

            columns.forEach((col) => {
              const key = col.Key ? ` (${col.Key})` : '';
              const nullable = col.Null === 'YES' ? 'NULL' : 'NOT NULL';
              const defaultVal = col.Default !== null ? ` DEFAULT '${col.Default}'` : '';
              console.log(`   - ${col.Field}: ${col.Type} ${nullable}${defaultVal}${key}`);
            });
            console.log('');
          }

          completedTables++;
          if (completedTables === totalTables) {
            // Get database size information
            const sizeQuery = `
              SELECT
                ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) as size_mb
              FROM information_schema.TABLES
              WHERE TABLE_SCHEMA = ?
            `;

            db.query(sizeQuery, [process.env.DB_NAME], (sizeErr, sizeResult) => {
              if (!sizeErr && sizeResult.length > 0) {
                console.log('💾 Database Size:');
                console.log(`   Total Size: ${sizeResult[0].size_mb} MB\n`);
              }

              db.end();
              console.log('✅ Database structure check completed!');
              process.exit(0);
            });
          }
        });
      });
    }
  });
});

// Handle connection errors
db.on('error', (err) => {
  console.error('❌ Database error:', err.message);
  process.exit(1);
});

// Timeout after 30 seconds
setTimeout(() => {
  console.error('❌ Test timed out after 30 seconds');
  db.end();
  process.exit(1);
}, 30000);
