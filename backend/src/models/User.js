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
    const sql = 'SELECT id, first_name, last_name, email, username, phone, password, role, status, profile_image, created_at, is_temp_password FROM users WHERE id = ?';
    db.query(sql, [id], callback);
  }

  // Get user by email or phone (for login)
  static getByIdentifier(identifier, callback) {
    // Check if identifier looks like a phone number (10 digits)
    const isPhoneNumber = /^\d{10}$/.test(identifier);

    let sql;
    let values;

    if (isPhoneNumber) {
      // If it's a 10-digit number, check both with and without +91 prefix
      sql = 'SELECT * FROM users WHERE phone = ? OR phone = ?';
      values = [identifier, `91${identifier}`];
    } else {
      // Assume it's email, check email and phone (in case phone is stored as email format, but unlikely)
      sql = 'SELECT * FROM users WHERE email = ? OR phone = ?';
      values = [identifier, identifier];
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
    const sql = `SELECT id, first_name, last_name, email, phone, username, password, role, status, created_at, is_temp_password
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

    // Check for any pending tasks related to this user (assigned to or assigned by)
    this.checkTaskRelationships(id, (err, relationships) => {
      if (err) return callback(err, null);

      const { assignedTo, assignedBy } = relationships;

      // If user has any incomplete tasks (assigned to them or assigned by them), prevent deactivation
      if (status === 'Inactive' && (assignedTo.length > 0 || assignedBy.length > 0)) {
        const error = new Error('Cannot deactivate user with pending tasks');
        error.taskDetails = { assignedTo, assignedBy };
        return callback(error, null);
      }

      // Proceed with update
      const sql = `UPDATE users SET first_name = ?, last_name = ?, email = ?, phone = ?, role = ?, status = ?, profile_image = ?
               WHERE id = ?`;
      const values = [first_name, last_name, email, phone, role, status, profile_image, id];
      db.query(sql, values, callback);
    });
  }

  // Check only tasks assigned TO this user (for deactivation validation)
  static checkAssignedToTasks(id, callback) {
    const sql = `
      SELECT t.id, t.name, t.status, t.dueDate,
             CONCAT(u.first_name, ' ', u.last_name) as assignedBy
      FROM tasks t
      LEFT JOIN users u ON t.assignBy = u.id
      WHERE t.assignTo = ? AND t.status != 'Completed'
    `;
    db.query(sql, [id], callback);
  }

  // Check if user has assigned tasks or is assigned tasks
  static checkTaskRelationships(id, callback) {
    // Check tasks assigned TO this user (pending/incomplete)
    const assignedToSql = `
      SELECT t.id, t.name, t.status, t.dueDate,
             CONCAT(u.first_name, ' ', u.last_name) as assignedBy
      FROM tasks t
      LEFT JOIN users u ON t.assignBy = u.id
      WHERE t.assignTo = ? AND t.status != 'Completed'
    `;

    // Check tasks assigned BY this user (pending/incomplete)
    const assignedBySql = `
      SELECT t.id, t.name, t.status, t.dueDate,
             CONCAT(u.first_name, ' ', u.last_name) as assignedTo
      FROM tasks t
      LEFT JOIN users u ON t.assignTo = u.id
      WHERE t.assignBy = ? AND t.status != 'Completed'
    `;

    // Run both queries
    db.query(assignedToSql, [id], (err1, assignedToResults) => {
      if (err1) return callback(err1, null);

      db.query(assignedBySql, [id], (err2, assignedByResults) => {
        if (err2) return callback(err2, null);

        const taskRelationships = {
          assignedTo: assignedToResults || [],
          assignedBy: assignedByResults || []
        };

        callback(null, taskRelationships);
      });
    });
  }

  // Delete user (with task validation)
  static delete(id, callback) {
    // Check for any pending tasks related to this user (assigned to or assigned by)
    this.checkTaskRelationships(id, (err, relationships) => {
      if (err) return callback(err, null);

      const { assignedTo, assignedBy } = relationships;

      if (assignedTo.length > 0 || assignedBy.length > 0) {
        // User has pending tasks, cannot delete
        const error = new Error('Cannot delete user with pending tasks');
        error.taskDetails = { assignedTo, assignedBy };
        return callback(error, null);
      }

      // No pending tasks, but may have completed tasks and notifications
      // Delete notifications first
      const deleteNotificationsSql = 'DELETE FROM notifications WHERE user_id = ?';

      db.query(deleteNotificationsSql, [id], (deleteNotifErr, deleteNotifResult) => {
        if (deleteNotifErr) return callback(deleteNotifErr, null);

        // Update foreign key references to NULL for all tasks
        const updateAssignToSql = 'UPDATE tasks SET assignTo = NULL WHERE assignTo = ?';
        const updateAssignBySql = 'UPDATE tasks SET assignBy = NULL WHERE assignBy = ?';

        db.query(updateAssignToSql, [id], (updateErr1, updateResult1) => {
          if (updateErr1) return callback(updateErr1, null);

          db.query(updateAssignBySql, [id], (updateErr2, updateResult2) => {
            if (updateErr2) return callback(updateErr2, null);

            // Now safe to delete the user
            const deleteUserSql = 'DELETE FROM users WHERE id = ?';
            db.query(deleteUserSql, [id], callback);
          });
        });
      });
    });
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
