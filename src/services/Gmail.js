const nodemailer = require('nodemailer');
const { config } = require('dotenv');
const { 
  deletUser, 
  verifyEmail, 
  changeEmail, 
  forgotPassword, 
  changePassword 
} = require('../shared/templates.js');

// Load environment variables
config();

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD
  }
});

/**
 * Base function to send email
 * @param {string} recipientEmail - Recipient's email address
 * @param {string} subject - Email subject
 * @param {Function} template - Email template function
 * @param {Object} [data={}] - Additional data for the template
 * @returns {Promise<boolean>}
 */
async function sendEmail(recipientEmail, subject, template, data = {}) {
  // Add common data to the template
  data.twitter = process.env.TWITTER;
  data.telegram = process.env.TELEGRAM;
  data.contact = process.env.CONTACT;
  data.privacy = process.env.PRIVACY;

  // Generate HTML content using the template
  const htmlContent = template(data);

  // Email options
  const mailOptions = {
    from: {
      name: process.env.APP_NAME,
      address: process.env.SENDER_EMAIL
    },
    to: recipientEmail,
    subject: subject,
    html: htmlContent
  };

  try {
    // Send email
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

module.exports = {
  /**
   * Send email verification email
   * @param {string} recipientEmail 
   * @param {Object} data 
   * @returns {Promise<boolean>}
   */
  sendVerifyEmail: async (recipientEmail, data) => {
    return sendEmail(recipientEmail, "Email verification", verifyEmail, data);
  },

  /**
   * Send forgot password email
   * @param {string} recipientEmail 
   * @param {Object} data 
   * @returns {Promise<boolean>}
   */
  sendForgotPasswordEmail: async (recipientEmail, data) => {
    return sendEmail(recipientEmail, "Account recovery", forgotPassword, data);
  },

  /**
   * Send email change notification
   * @param {string} recipientEmail 
   * @param {Object} data 
   * @returns {Promise<boolean>}
   */
  sendEmailChangeEmail: async (recipientEmail, data) => {
    return sendEmail(recipientEmail, "Email Change", changeEmail, data);
  },

  /**
   * Send password change notification
   * @param {string} recipientEmail 
   * @param {Object} data 
   * @returns {Promise<boolean>}
   */
  sendChangePasswordEmail: async (recipientEmail, data) => {
    return sendEmail(recipientEmail, "Password Change", changePassword, data);
  },

  /**
   * Send user deletion notification
   * @param {string} recipientEmail 
   * @param {Object} data 
   * @returns {Promise<boolean>}
   */
  sendDeleteUserEmail: async (recipientEmail, data) => {
    return sendEmail(recipientEmail, "Account Deletion", deletUser, data);
  }
};
