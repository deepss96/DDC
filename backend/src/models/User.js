 const db = require('../config/database');

class User {
  // === AUTHENTICATION METHODS ===

  // Get user by ID (for auth)
  static getById(id, callback) {
    const sql = 'SELECT id, first_name, last_name, email, username, created_at FROM users WHERE id = ?';
    db.query(sql, [id], callback);
  }

  // Get full user profile by ID (for profile page)
  static getFullProfileById(id, callback) {
    const sql = 'SELECT id, first_name, last_name, email, username, phone, password, role, status, profile_image, created_at FROM users WHERE id = ?';
    db.query(sql, [id], callback);
  }

  // Get user by username, email, or phone (for login)
  static getByIdentifier(identifier, callback) {
    // Check if identifier looks like a phone number (10 digits)
    const isPhoneNumber = /^\d{10}$/.test(identifier);

    let sql;
    let values;

    if (isPhoneNumber) {
      // If it's a 10-digit number, check both with and without +91 prefix
      sql = 'SELECT * FROM users WHERE username = ? OR email = ? OR phone = ? OR phone = ?';
      values = [identifier, identifier, identifier, `91${identifier}`];
    } else {
      // For username/email, check all three fields
      sql = 'SELECT * FROM users WHERE username = ? OR email = ? OR phone = ?';
      values = [identifier, identifier, identifier];
    }

    db.query(sql, values, callback);
  }

  // Check if user exists (for auth)
  static checkExists(email, username, callback) {
    const sql = 'SELECT id FROM users WHERE email = ? OR username = ?';
    db.query(sql, [email, username], callback);
  }

  // Create new user (basic auth)
  static create(userData, callback) {
    const { firstName, lastName, email, username, password } = userData;
    const sql = `INSERT INTO users (first_name, last_name, email, username, password) VALUES (?, ?, ?, ?, ?)`;
    const values = [firstName, lastName, email, username, password];
    db.query(sql, values, callback);
  }

  // Update user password
  static updatePassword(id, hashedPassword, callback) {
    const sql = 'UPDATE users SET password = ? WHERE id = ?';
    db.query(sql, [hashedPassword, id], callback);
  }

  // === USER MANAGEMENT METHODS ===

  // Get all users (for user management)
  static getAll(callback) {
    const sql = `SELECT id, first_name, last_name, email, phone, username, password, role, status, created_at
             FROM users ORDER BY created_at DESC`;
    db.query(sql, callback);
  }

  // Get user by email, username, or phone for login (management version with more fields)
  static getByEmailOrUsername(identifier, callback) {
    // Check if identifier looks like a phone number (10 digits)
    const isPhoneNumber = /^\d{10}$/.test(identifier);

    let sql;
    let values;

    if (isPhoneNumber) {
      // If it's a 10-digit number, check both with and without +91 prefix
      sql = `SELECT id, first_name, last_name, email, username, password, role, status, is_temp_password
             FROM users WHERE email = ? OR username = ? OR phone = ? OR phone = ?`;
      values = [identifier, identifier, identifier, `91${identifier}`];
    } else {
      // For username/email, check all three fields
      sql = `SELECT id, first_name, last_name, email, username, password, role, status, is_temp_password
             FROM users WHERE email = ? OR username = ? OR phone = ?`;
      values = [identifier, identifier, identifier];
    }

    db.query(sql, values, callback);
  }

  // Create new user - plain text password (management version)
  static createManagement(userData, callback) {
    const { first_name, last_name, email, username, password, role, status, phone } = userData;

    // Generate a unique phone number if not provided
    const phoneNumber = phone || `+91-${Date.now().toString().slice(-10)}`;

    const sql = `INSERT INTO users (first_name, last_name, email, phone, username, password, role, status, is_temp_password)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [first_name, last_name, email, phoneNumber, username, password, role || 'Field', status || 'Active', 1];
    db.query(sql, values, callback);
  }

  // Update user - plain text password (management version)
  static update(id, userData, callback) {
    const { first_name, last_name, email, phone, role, status, profile_image } = userData;

    // Update user
    const sql = `UPDATE users SET first_name = ?, last_name = ?, email = ?, phone = ?, role = ?, status = ?, profile_image = ?
             WHERE id = ?`;
    const values = [first_name, last_name, email, phone, role, status, profile_image, id];

    db.query(sql, values, callback);
  }

  // Delete user
  static delete(id, callback) {
    const sql = 'DELETE FROM users WHERE id = ?';
    db.query(sql, [id], callback);
  }

  // Check if email exists
  static checkEmailExists(email, excludeId, callback) {
    let sql = 'SELECT id FROM users WHERE email = ?';
    let values = [email];

    if (excludeId) {
      sql += ' AND id != ?';
      values.push(excludeId);
    }

    db.query(sql, values, callback);
  }

  // Check if username exists
  static checkUsernameExists(username, excludeId, callback) {
    let sql = 'SELECT id FROM users WHERE username = ?';
    let values = [username];

    if (excludeId) {
      sql += ' AND id != ?';
      values.push(excludeId);
    }

    db.query(sql, values, callback);
  }

  // Check if phone exists
  static checkPhoneExists(phone, excludeId, callback) {
    let sql = 'SELECT id FROM users WHERE phone = ?';
    let values = [phone];

    if (excludeId) {
      sql += ' AND id != ?';
      values.push(excludeId);
    }

    db.query(sql, values, callback);
  }
}

module.exports = User;
