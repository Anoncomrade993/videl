const { config } = require('dotenv');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const { deletUser, verifyEmail, changeEmail, forgotPassword, changePassword } = require('../shared/templates.js');


// Initialize the API client
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
config();

apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

/**
 * Base function to send email
 * @param {string} recipientEmail - Recipient's email address
 * @param {string} subject - Email subject
 * @param {string} htmlContent - HTML content of the email
 * @returns {Promise<boolean>}
 */
async function sendEmail(recipientEmail, subject, template, data = {}) {
	const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

	data.twitter = process.env.TWITTER;
	data.telegram = process.env.TELEGRAM
	data.contact = process.env.CONTACT;
	data.privacy = process.env.PRIVACY;


	const htmlContent = template(data);

	sendSmtpEmail.subject = subject;
	sendSmtpEmail.htmlContent = htmlContent;
	sendSmtpEmail.sender = {
		name: process.env.BREVO_APP_NAME,
		email: process.env.BREVO_SENDER_EMAIL
	};

	sendSmtpEmail.to = [{ email: recipientEmail }];

	try {
		await apiInstance.sendTransacEmail(sendSmtpEmail);
		return true;
	} catch (error) {
		console.error("Error sending email:", error);
		throw error;
	}
}

/**
 * @typedef {Object} EmailData
 * @typedef {(recipientEmail: string, data: EmailData) :> Promise<boolean>} EmailSendFunction
 */


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