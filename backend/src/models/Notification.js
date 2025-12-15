const db = require('../config/database');

class Notification {
  // Create new notification
  static create(notificationData, callback) {
    const {
      user_id,
      title,
      message,
      type,
      related_id,
      is_read = false,
      created_at = new Date()
    } = notificationData;

    const sql = `INSERT INTO notifications (user_id, title, message, type, related_id, is_read, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      user_id,
      title,
      message,
      type,
      related_id,
      is_read,
      created_at
    ];

    db.query(sql, values, callback);
  }

  // Get notifications for a user
  static getByUserId(userId, callback) {
    const sql = `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC`;
    db.query(sql, [userId], callback);
  }

  // Get unread notifications count for a user
  static getUnreadCount(userId, callback) {
    const sql = `SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = false`;
    db.query(sql, [userId], callback);
  }

  // Mark notification as read
  static markAsRead(id, callback) {
    const sql = `UPDATE notifications SET is_read = true WHERE id = ?`;
    db.query(sql, [id], callback);
  }

  // Mark all notifications as read for a user
  static markAllAsRead(userId, callback) {
    const sql = `UPDATE notifications SET is_read = true WHERE user_id = ?`;
    db.query(sql, [userId], callback);
  }

  // Delete notification
  static delete(id, callback) {
    const sql = 'DELETE FROM notifications WHERE id = ?';
    db.query(sql, [id], callback);
  }

  // Get notification by ID
  static getById(id, callback) {
    const sql = `SELECT * FROM notifications WHERE id = ?`;
    db.query(sql, [id], callback);
  }
}

module.exports = Notification;
