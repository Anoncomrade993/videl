require('dotenv').config();
const nodemailer = require('nodemailer');
const {
	deleteUser,
	emailVerification,
	changePassword,
	changeEmail,
	forgottenPassword
} = require('../shared/email_templates.js');





const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS
	}
});



async function sendEmail(recipientEmail, subject, template, data = {}) {
	// Populate additional data
	data.twitter = process.env.TWITTER;
	data.telegram = process.env.TELEGRAM;
	data.contact = process.env.CONTACT;
	data.privacy = process.env.PRIVACY;

	const htmlContent = template(data);

	const mailOptions = {
		from: process.env.SENDER_EMAIL,
		to: recipientEmail,
		subject: subject,
		html: htmlContent
	};

	try {
		await transporter.sendMail(mailOptions);
		return true;
	} catch (error) {
		console.error("Error sending email:", error);
		throw error;
	}
}

module.exports = {
	sendVerifyEmail: async (recipientEmail, data) => {
		return sendEmail(recipientEmail, "Email verification", emailVerification, data);
	},
	sendForgotPasswordEmail: async (recipientEmail, data) => {
		return sendEmail(recipientEmail, "Account recovery", forgottenPassword, data);
	},
	sendEmailChangeEmail: async (recipientEmail, data) => {
		return sendEmail(recipientEmail, "Email Change", changeEmail, data);
	},
	sendChangePasswordEmail: async (recipientEmail, data) => {
		return sendEmail(recipientEmail, "Password Change", changePassword, data);
	},
	sendDeleteUserEmail: async (recipientEmail, data) => {
		return sendEmail(recipientEmail, "Account Deletion", deleteUser, data);
	}
};