const { config } = require('dotenv');
const { MailtrapClient } = require('mailtrap');
const { deletUser, verifyEmail, changeEmail, forgotPassword, changePassword } = require('../shared/templates.js');

// Load environment variables
config();

// Initialize the Mailtrap client
const client = new MailtrapClient({ token: process.env.MAILTRAP_API_TOKEN });

/**
 * Base function to send email
 * @param {string} recipientEmail - Recipient's email address
 * @param {string} subject - Email subject
 * @param {Function} template - Email template function
 * @param {Object} data - Data to be passed to the template
 * @returns {Promise<boolean>}
 */
async function sendEmail(recipientEmail, subject, template, data = {}) {
	// Populate additional data
	data.twitter = process.env.TWITTER;
	data.telegram = process.env.TELEGRAM;
	data.contact = process.env.CONTACT;
	data.privacy = process.env.PRIVACY;

	const htmlContent = template(data);

	const sender = {
		name: process.env.APP_NAME,
		email: process.env.SENDER_EMAIL
	};

	try {
		await client.send({
			from: sender,
			to: [{ email: recipientEmail }],
			subject: subject,
			html: htmlContent
		});
		return true;
	} catch (error) {
		console.error("Error sending email:", error);
		throw error;
	}
}

module.exports = {
	sendVerifyEmail: async (recipientEmail, data) => {
		return sendEmail(recipientEmail, "Email verification", verifyEmail, data);
	},
	sendForgotPasswordEmail: async (recipientEmail, data) => {
		return sendEmail(recipientEmail, "Account recovery", forgotPassword, data);
	},
	sendEmailChangeEmail: async (recipientEmail, data) => {
		return sendEmail(recipientEmail, "Email Change", changeEmail, data);
	},
	sendChangePasswordEmail: async (recipientEmail, data) => {
		return sendEmail(recipientEmail, "Password Change", changePassword, data);
	},
	sendDeleteUserEmail: async (recipientEmail, data) => {
		return sendEmail(recipientEmail, "Account Deletion", deletUser, data);
	}
};