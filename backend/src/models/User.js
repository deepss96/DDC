const db = require('../config/database');

class User {
  // === AUTHENTICATION METHODS ===

  // Get user by ID (for auth)
  static getById(id, callback) {
    const sql = 'SELECT id, first_name, last_name, email, username, created_at FROM users WHERE id = ?';
    db.query(sql, [id], callback);
  }

  // Get user by username or email (for login)
  static getByIdentifier(identifier, callback) {
    const sql = 'SELECT * FROM users WHERE username = ? OR email = ?';
    db.query(sql, [identifier, identifier], callback);
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
    const sql = `SELECT id, first_name, last_name, email, username, role, status, created_at
             FROM users ORDER BY created_at DESC`;
    db.query(sql, callback);
  }

  // Get user by email or username for login (management version with more fields)
  static getByEmailOrUsername(identifier, callback) {
    const sql = `SELECT id, first_name, last_name, email, username, password, role, status, is_temp_password
             FROM users WHERE email = ? OR username = ?`;
    db.query(sql, [identifier, identifier], callback);
  }

  // Create new user - plain text password (management version)
  static createManagement(userData, callback) {
    const { first_name, last_name, email, username, password, role, status, phone } = userData;

    // Generate a unique phone number if not provided
    const phoneNumber = phone || `+91-${Date.now().toString().slice(-10)}`;

    const sql = `INSERT INTO users (first_name, last_name, email, phone, username, password, role, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [first_name, last_name, email, phoneNumber, username, password, role || 'Field', status || 'Active'];
    db.query(sql, values, callback);
  }

  // Update user - plain text password (management version)
  static update(id, userData, callback) {
    const { first_name, last_name, email, username, role, status } = userData;

    // Update without changing password (password cannot be changed from edit)
    const sql = `UPDATE users SET first_name = ?, last_name = ?, email = ?, username = ?, role = ?, status = ?
             WHERE id = ?`;
    const values = [first_name, last_name, email, username, role, status, id];

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
}

module.exports = User;
