const db = require('../config/database');

const sql = 'DESCRIBE users';

db.query(sql, (err, results) => {
  if (err) {
    console.error('Error describing users table:', err);
    process.exit(1);
  }

  console.log('Users table structure:');
  console.table(results);
  process.exit(0);
});
