const nodemailer = require('nodemailer');

// Create transporter with Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD, // Gmail App Password, not regular password
  },
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Email service error:', error);
  } else {
    console.log('✅ Email service ready');
  }
});

module.exports = transporter;
