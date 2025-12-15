const db = require('../config/database');

const createLeadsTable = `
CREATE TABLE IF NOT EXISTS Leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  contact_name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NULL,
  company_name VARCHAR(255) NULL,
  address TEXT NULL,
  lead_type VARCHAR(100) NULL,
  source VARCHAR(100) NULL,
  lead_status VARCHAR(100) NULL,
  last_contacted_date DATE NULL,
  lead_assignee VARCHAR(255) NULL,
  description TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_contact_name (contact_name),
  INDEX idx_phone (phone),
  INDEX idx_email (email),
  INDEX idx_lead_status (lead_status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

console.log('Creating Leads table...');

db.query(createLeadsTable, (err, result) => {
  if (err) {
    console.error('Error creating Leads table:', err);
    process.exit(1);
  }

  console.log('✅ Leads table created successfully!');
  process.exit(0);
});
