const Lead = require('../models/Lead');

class LeadController {
  // Get all leads
  static getAllLeads(req, res) {
    Lead.getAll((err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  }

  // Get lead by ID
  static getLeadById(req, res) {
    const { id } = req.params;

    Lead.getById(id, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'Lead not found' });
      }

      res.json(results[0]);
    });
  }

  // Create new lead
  static createLead(req, res) {
    const leadData = req.body;

    Lead.create(leadData, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({
        message: 'Lead saved successfully',
        id: result.insertId
      });
    });
  }

  // Update lead
  static updateLead(req, res) {
    const { id } = req.params;
    const leadData = req.body;

    Lead.update(id, leadData, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Lead not found' });
      }

      res.json({ message: 'Lead updated successfully' });
    });
  }

  // Delete lead
  static deleteLead(req, res) {
    const { id } = req.params;

    Lead.delete(id, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Lead not found' });
      }

      res.json({ message: 'Lead deleted successfully' });
    });
  }
}

module.exports = LeadController;
