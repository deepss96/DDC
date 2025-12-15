const db = require('../config/database');

class Lead {
  // Get all leads
  static getAll(callback) {
    const sql = 'SELECT * FROM Leads ORDER BY id DESC';
    db.query(sql, callback);
  }

  // Get lead by ID
  static getById(id, callback) {
    const sql = 'SELECT * FROM Leads WHERE id = ?';
    db.query(sql, [id], callback);
  }

  // Create new lead
  static create(leadData, callback) {
    const {
      contact_name,
      date,
      phone,
      email,
      company_name,
      address,
      lead_type,
      source,
      lead_status,
      last_contacted_date,
      lead_assignee,
      description
    } = leadData;

    const sql = `INSERT INTO Leads (contact_name, date, phone, email, company_name, address, lead_type, source, lead_status, last_contacted_date, lead_assignee, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      contact_name,
      date,
      phone,
      email || null,
      company_name || null,
      address || null,
      lead_type || null,
      source || null,
      lead_status || null,
      last_contacted_date || null,
      lead_assignee || null,
      description || null
    ];

    db.query(sql, values, callback);
  }

  // Update lead
  static update(id, leadData, callback) {
    const {
      contact_name,
      date,
      phone,
      email,
      company_name,
      address,
      lead_type,
      source,
      lead_status,
      last_contacted_date,
      lead_assignee,
      description
    } = leadData;

    const sql = `UPDATE Leads SET contact_name=?, date=?, phone=?, email=?, company_name=?, address=?, lead_type=?, source=?, lead_status=?, last_contacted_date=?, lead_assignee=?, description=? WHERE id=?`;
    const values = [
      contact_name,
      date,
      phone,
      email || null,
      company_name || null,
      address || null,
      lead_type || null,
      source || null,
      lead_status || null,
      last_contacted_date || null,
      lead_assignee || null,
      description || null,
      id
    ];

    db.query(sql, values, callback);
  }

  // Delete lead
  static delete(id, callback) {
    const sql = 'DELETE FROM Leads WHERE id = ?';
    db.query(sql, [id], callback);
  }
}

module.exports = Lead;
