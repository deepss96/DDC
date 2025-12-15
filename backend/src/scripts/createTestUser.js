const db = require('../config/database');
const bcrypt = require('bcryptjs');

async function createTestUser() {
  try {
    // Hash a test password
    const hashedPassword = await bcrypt.hash('password123', 10);

    const sql = `INSERT INTO users (first_name, last_name, email, phone, username, password, role, status)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = ['Test', 'User', 'test@example.com', '1234567890', 'testuser', hashedPassword, 'Admin', 'Active'];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error creating test user:', err);
        process.exit(1);
      }

      console.log('✅ Test user created successfully!');
      console.log('Username: testuser');
      console.log('Password: password123');
      console.log('Email: test@example.com');
      process.exit(0);
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    process.exit(1);
  }
}

console.log('Creating test user...');
createTestUser();
