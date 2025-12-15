const db = require('../config/database');

const sql = 'SELECT * FROM users WHERE username = ? OR email = ?';
const identifier = 'testuser';

db.query(sql, [identifier, identifier], (err, results) => {
  if (err) {
    console.error('Database error:', err);
    process.exit(1);
  }

  console.log('Query results:', results);
  process.exit(0);
});
