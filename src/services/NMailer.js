const nodemailer = require('nodemailer');
const { getAuth } = require('firebase-admin/auth');

// Create transporter (adjust based on your email service)
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS
	}
});

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