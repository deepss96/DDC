const Notification = require('../models/Notification');

class NotificationController {
  // Get notifications for a user
  static getUserNotifications(req, res) {
    try {
      const userId = req.user.id; // From auth middleware

      Notification.getByUserId(userId, (err, results) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        res.json({ notifications: results });
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  // Get unread notifications count for a user
  static getUnreadCount(req, res) {
    try {
      const userId = req.user.id; // From auth middleware

      Notification.getUnreadCount(userId, (err, results) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        res.json({ count: results[0].count });
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  // Mark notification as read
  static markAsRead(req, res) {
    try {
      const { id } = req.params;

      Notification.markAsRead(id, (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Notification not found' });
        }

        res.json({ message: 'Notification marked as read' });
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  // Mark all notifications as read for a user
  static markAllAsRead(req, res) {
    try {
      const userId = req.user.id; // From auth middleware

      Notification.markAllAsRead(userId, (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        res.json({ message: 'All notifications marked as read' });
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  // Delete notification
  static deleteNotification(req, res) {
    try {
      const { id } = req.params;

      Notification.delete(id, (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Notification not found' });
        }

        res.json({ message: 'Notification deleted' });
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  // Create notification (for internal use or admin)
  static createNotification(req, res) {
    try {
      const { user_id, title, message, type, related_id } = req.body;

      if (!user_id || !title || !message || !type) {
        return res.status(400).json({ error: 'user_id, title, message, and type are required' });
      }

      const notificationData = {
        user_id,
        title,
        message,
        type,
        related_id,
        is_read: false,
        created_at: new Date()
      };

      Notification.create(notificationData, (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        res.status(201).json({
          message: 'Notification created',
          notificationId: result.insertId
        });
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = NotificationController;
