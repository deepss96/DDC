const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthController {
  // Register User
  // Register User
  static async register(req, res) {
    try {
      const { firstName, lastName, email, username, password } = req.body;

      // Validation
      if (!firstName || !lastName || !email || !username || !password) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
      }

      // Check if user already exists
      User.checkExists(email, username, async (err, results) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        if (results.length > 0) {
          return res.status(400).json({ error: 'User with this email or username already exists' });
        }

        // Store password in plain text (as requested)
        const userData = { firstName, lastName, email, username, password };
        User.create(userData, (err, result) => {
          if (err) {
            return res.status(500).json({ error: 'Error creating user' });
          }

          // Generate JWT token
          const token = jwt.sign(
            { id: result.insertId, username, email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
          );

          res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
              id: result.insertId,
              firstName,
              lastName,
              email,
              username
            }
          });
        });
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  // Login User
  static async login(req, res) {
    try {
      const { identifier, password } = req.body; // identifier can be username, email

      if (!identifier || !password) {
        return res.status(400).json({ error: 'Username/Email and password are required' });
      }

      // Find user by identifier
      User.getByIdentifier(identifier, async (err, results) => {
        if (err) {
          console.error('Database error in login:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        if (results.length === 0) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = results[0];

        // Check password - plain text comparison only
        if (password !== user.password) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
          { id: user.id, username: user.username, email: user.email },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '7d' }
        );

        res.json({
          message: 'Login successful',
          token,
          user: {
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            username: user.username
          }
        });
      });
    } catch (error) {
      console.error('Server error in login:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  // Forgot Password
  static forgotPassword(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      // Check if user exists
      User.getByIdentifier(email, (err, results) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: 'User with this email not found' });
        }

        // Generate reset token (simplified - in production, use proper reset mechanism)
        const resetToken = jwt.sign(
          { id: results[0].id, email },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '1h' }
        );

        // In a real application, you would send an email with the reset link
        // For now, we'll just return the token for testing
        res.json({
          message: 'Password reset link sent to your email',
          resetToken, // Remove this in production
          note: 'In production, this token would be sent via email'
        });
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  // Reset Password
  static async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({ error: 'Token and new password are required' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
      }

      // Verify token
      jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', async (err, decoded) => {
        if (err) {
          return res.status(401).json({ error: 'Invalid or expired token' });
        }

        // Store new password in plain text
        User.updatePassword(decoded.id, newPassword, (err, result) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }

          if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
          }

          res.json({ message: 'Password reset successfully' });
        });
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  // Get user profile (protected route)
  static getProfile(req, res) {
    User.getFullProfileById(req.user.id, (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ user: results[0] });
    });
  }
}

module.exports = AuthController;
