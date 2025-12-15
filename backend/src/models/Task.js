const db = require('../config/database');
const Notification = require('./Notification'); // Import Notification model

class Task {
  // Get all tasks
  static getAll(callback) {
    const sql = `
      SELECT
        t.*,
        CONCAT(u1.first_name, ' ', u1.last_name) as assignByName,
        CONCAT(u2.first_name, ' ', u2.last_name) as assignToName
      FROM tasks t
      LEFT JOIN users u1 ON t.assignBy = u1.id
      LEFT JOIN users u2 ON t.assignTo = u2.id
      ORDER BY t.createdDate DESC
    `;
    db.query(sql, callback);
  }

  // Get task by ID
  static getById(id, callback) {
    const sql = `
      SELECT
        t.*,
        CONCAT(u1.first_name, ' ', u1.last_name) as assignByName,
        CONCAT(u2.first_name, ' ', u2.last_name) as assignToName
      FROM tasks t
      LEFT JOIN users u1 ON t.assignBy = u1.id
      LEFT JOIN users u2 ON t.assignTo = u2.id
      WHERE t.id = ?
    `;
    db.query(sql, [parseInt(id)], callback);
  }

  // Create new task
  static create(taskData, callback) {
    const {
      taskNumber,
      name,
      projectName,
      leadName,
      assignTo,
      assignBy,
      priority,
      status,
      dueDate,
      description,
      createdDate
    } = taskData;

    const sql = `INSERT INTO tasks (taskNumber, name, projectName, leadName, assignTo, assignBy, priority, status, dueDate, description, createdDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      taskNumber,
      name,
      projectName || null,
      leadName || null,
      assignTo,
      assignBy,
      priority || 'Medium',
      status,
      dueDate,
      description || null,
      createdDate
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        return callback(err, null);
      }

      // Create notification for assigned user (if different from assigner)
      if (assignTo && assignTo !== assignBy) {
        const notificationData = {
          user_id: assignTo,
          title: 'New Task Assigned',
          message: `You have been assigned a new task: "${name}"`,
          type: 'task_assigned',
          related_id: result.insertId,
          is_read: false,
          created_at: new Date()
        };

        Notification.create(notificationData, (notifErr, notifResult) => {
          // Don't fail the task creation if notification fails
          if (notifErr) {
            console.error('Error creating notification:', notifErr);
          } else {
            console.log('Notification created for task assignment');
          }
          // Still return the task creation result
          callback(null, result);
        });
      } else {
        // No notification needed or same user
        callback(null, result);
      }
    });
  }

  // Update task
  static update(id, taskData, callback) {
    const {
      taskNumber,
      name,
      projectName,
      leadName,
      assignTo,
      assignBy,
      priority,
      status,
      dueDate,
      description,
      createdDate
    } = taskData;

    const sql = `UPDATE tasks SET taskNumber=?, name=?, projectName=?, leadName=?, assignTo=?, assignBy=?, priority=?, status=?, dueDate=?, description=?, createdDate=? WHERE id=?`;
    const values = [
      taskNumber,
      name,
      projectName || null,
      leadName || null,
      assignTo,
      assignBy,
      priority || 'Medium',
      status,
      dueDate,
      description || null,
      createdDate,
      id
    ];

    db.query(sql, values, callback);
  }

  // Delete task
  static delete(id, callback) {
    const sql = 'DELETE FROM tasks WHERE id = ?';
    db.query(sql, [id], callback);
  }
}

module.exports = Task;
