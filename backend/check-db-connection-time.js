const mysql = require('mysql2');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  connectionLimit: process.env.NODE_ENV === 'production' ? 2 : 10,
  connectTimeout: 10000,
  ssl: false
};

console.log('Checking database connection time...\n');

// Test 1: Connection Pool Creation Time
console.log('Test 1: Creating connection pool...');
const startPoolTime = Date.now();
const db = mysql.createPool(dbConfig);
const poolCreationTime = Date.now() - startPoolTime;
console.log(`✅ Connection pool created in: ${poolCreationTime}ms\n`);

// Test 2: First Connection Time
console.log('Test 2: Establishing first connection...');
const startConnectionTime = Date.now();

db.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    return;
  }

  const connectionTime = Date.now() - startConnectionTime;
  console.log(`✅ First connection established in: ${connectionTime}ms\n`);

  // Test 3: Query Execution Time
  console.log('Test 3: Executing test query...');
  const startQueryTime = Date.now();

  connection.query('SELECT 1 as test', (queryErr, results) => {
    const queryTime = Date.now() - startQueryTime;

    if (queryErr) {
      console.error('❌ Query execution failed:', queryErr.message);
    } else {
      console.log(`✅ Query executed successfully in: ${queryTime}ms`);
      console.log('📊 Query result:', results[0]);
    }

    // Test 4: Multiple Connections Test
    console.log('\nTest 4: Testing multiple connections...');
    const multipleConnections = [];
    let completedConnections = 0;

    for (let i = 0; i < 5; i++) {
      const connStartTime = Date.now();

      db.getConnection((connErr, conn) => {
        if (connErr) {
          console.error(`❌ Connection ${i + 1} failed:`, connErr.message);
        } else {
          const connTime = Date.now() - connStartTime;
          console.log(`✅ Connection ${i + 1} established in: ${connTime}ms`);
          multipleConnections.push(connTime);
        }

        completedConnections++;

        if (completedConnections === 5) {
          // Calculate statistics
          const avgConnectionTime = multipleConnections.reduce((a, b) => a + b, 0) / multipleConnections.length;
          const minConnectionTime = Math.min(...multipleConnections);
          const maxConnectionTime = Math.max(...multipleConnections);

          console.log('\n📈 Connection Time Statistics:');
          console.log(`   Average: ${avgConnectionTime.toFixed(2)}ms`);
          console.log(`   Minimum: ${minConnectionTime}ms`);
          console.log(`   Maximum: ${maxConnectionTime}ms`);

          // Release all connections
          multipleConnections.forEach((_, index) => {
            db.getConnection((relErr, relConn) => {
              if (!relErr && relConn) relConn.release();
            });
          });

          connection.release();
          console.log('\n✅ Database connection time check completed!');
          process.exit(0);
        }
      });
    }
  });
});

// Handle pool errors
db.on('error', (err) => {
  console.error('❌ Database pool error:', err.message);
  process.exit(1);
});

// Timeout after 30 seconds
setTimeout(() => {
  console.error('❌ Test timed out after 30 seconds');
  process.exit(1);
}, 30000);
