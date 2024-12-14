//WET implemented here 
//don't want DRY 

require('dotenv').config()
const Csrf = require('../models/Csrf.js')
const User = require('../models/User.js');
const Token = require('../modela/Token.js')

const errorTemplate = require('../shared/errorTemplate.html.js')

const changeEmailTemplate = require('../shared/changeemail.html.js')
const emailVerificationTemplate = require('../shared/emailverification.html.js')
const changePasswordTemplate = require('../shared/.changepassword.html.js')
const resetPasswordTemplate = require('../shared/resetpassword.html.js')
const cancelDeleteUserTemplate = require('../shared/canceldeleteuser.html.js')

const {
	sendVerifyEmail,
	sendEmailChangeEmail,
	sendChangePasswordEmail,
	sendForgotPasswordEmail,
	sendDeleteUserEmail
} = require('../services/Emailer.js');

const { saveSession, destroySession } = require('../middlewares/session.js')
const { sendJsonResponse } = require('../utility/helpers.js')
const { EMAIL_REGEX } = require('../constants.js')

const constructLink = (kaf, hashed, endpoint) => `${process.env.BASE_URL}/auth/${endpoint}/${hashed}?kaf=${kaf}`


module.exports.request_fp_token = async function(req, res) {
	try {
		const { email } = req.body
		if (!email.trim()) {
			return sendJsonResponse(res, 400, false, 'provide an email address')
		}
		if (!EMAIL_REGEX.test(email.trim().toLowerCase())) {
			return sendJsonResponse(res, 400, false, 'Invalid email address')
		}
		const isUser = await User.findOne({ email: email.trim().toLowerCase() })
		if (!isUser) {
			return sendJsonResponse(res, 404, false, 'User not found')
		}
		if (isUser.onKillList) {
			return sendJsonResponse(res, 403, true, 'user has been scheduled to be deleted', { onKillList: true })
		}
		const { success, status, message, plain, hashed } = await Token.generateShortLivedToken({ email: isUser.email, purpose: 'forgotPassword' })
		if (!success) {
			return sendJsonResponse(res, status, success, message);
		}
		const csrf = await Csrf.generateToken(isUser.email, 'forgotPassword')
		if (!csrf) {
			return sendJsonResponse(res, 500, false, 'Something went wrong,try again')
		}
		const tokenLink = constructLink(csrf.token, hashed, 'reset-password')
		await sendForgotPasswordEmail(isUser.email, { username: isUser.username, tokenLink });
		return sendJsonResponse(res, 200, true, 'Check your email for reset password token')
	} catch (error) {
		console.error('Error requesting for forgot password token', error)
		return sendJsonResponse(res, 500, false, 'Internal server error occurred')
	}
}
module.exports.request_ev_token = async function(req, res) {
	try {
		const { email } = req.body
		if (!email.trim()) {
			return sendJsonResponse(res, 400, false, 'provide an email address')
		}
		if (!EMAIL_REGEX.test(email.trim().toLowerCase())) {
			return sendJsonResponse(res, 400, false, 'Invalid email address')
		}
		const isUser = await User.findOne({ email: email.trim().toLowerCase() })
		if (!isUser) {
			return sendJsonResponse(res, 404, false, 'User not found')
		}
		if (isUser.onKillList) {
			return sendJsonResponse(res, 403, true, 'user has been scheduled to be deleted', { onKillList: true })
		}
		const { success, status, message, plain, hashed } = await Token.generateShortLivedToken({ email: isUser.email, purpose: 'verifyEmail' })
		if (!success) {
			return sendJsonResponse(res, status, success, message);
		}
		const csrf = await Csrf.generateToken(isUser.email, 'verifyEmail')
		if (!csrf) {
			return sendJsonResponse(res, 500, false, 'Something went wrong,try again')
		}
		const tokenLink = constructLink(csrf.token, hashed, 'verify-email')
		await sendVerifyEmail(isUser.email, { username: isUser.username, tokenLink });
		return sendJsonResponse(res, 200, true, 'Check your email for verification token')
	} catch (error) {
		console.error('Error requesting for email verification  token', error)
		return sendJsonResponse(res, 500, false, 'Internal server error occurred')
	}
}
module.exports.request_cp_token = async function(req, res) {
	try {
		const user = req.session.user;

		if (!user || Object.keys(user).length === 0) {
			return sendJsonResponse(res, 401, false, 'You are not authenticated')
		}
		const { email } = req.body
		if (!email.trim()) {
			return sendJsonResponse(res, 400, false, 'provide an email address')
		}
		if (!EMAIL_REGEX.test(email.trim().toLowerCase())) {
			return sendJsonResponse(res, 400, false, 'Invalid email address')
		}
		const isUser = await User.findOne({ email: email.trim().toLowerCase() })
		if (!isUser) {
			return sendJsonResponse(res, 404, false, 'User not found')
		}
		if (isUser.onKillList) {
			return sendJsonResponse(res, 403, true, 'user has been scheduled to be deleted', { onKillList: true })
		}
		const { success, status, message, plain, hashed } = await Token.generateShortLivedToken({ email: isUser.email, purpose: 'changePassword' })
		if (!success) {
			return sendJsonResponse(res, status, success, message);
		}
		const csrf = await Csrf.generateToken(isUser.email, 'changePassword')
		if (!csrf) {
			return sendJsonResponse(res, 500, false, 'Something went wrong,try again')
		}
		const tokenLink = constructLink(csrf.token, hashed, 'change-password')
		await sendVerifyEmail(isUser.email, { username: isUser.username, tokenLink });
		return sendJsonResponse(res, 200, true, 'Check your email for password change token')
	} catch (error) {
		console.error('Error requesting for change password token', error)
		return sendJsonResponse(res, 500, false, 'Internal server error occurred')
	}
}
module.exports.request_ce_token = async function(req, res) {
	try {
		const user = req.session.user;

		if (!user || Object.keys(user).length === 0) {
			return sendJsonResponse(res, 401, false, 'You are not authenticated')
		}
		const { email } = req.body
		if (!email.trim()) {
			return sendJsonResponse(res, 400, false, 'provide an email address')
		}
		if (!EMAIL_REGEX.test(email.trim().toLowerCase())) {
			return sendJsonResponse(res, 400, false, 'Invalid email address')
		}
		const isUser = await User.findOne({ email: email.trim().toLowerCase() })
		if (!isUser) {
			return sendJsonResponse(res, 404, false, 'User not found')
		}
		if (isUser.onKillList) {
			return sendJsonResponse(res, 403, true, 'user has been scheduled to be deleted', { onKillList: true })
		}
		const { success, status, message, plain, hashed } = await Token.generateShortLivedToken({ email: isUser.email, purpose: 'changeEmail' })
		if (!success) {
			return sendJsonResponse(res, status, success, message);
		}
		const csrf = await Csrf.generateToken(isUser.email, 'changeEmail')
		if (!csrf) {
			return sendJsonResponse(res, 500, false, 'Something went wrong,try again')
		}
		const tokenLink = constructLink(csrf.token, hashed, 'change-email')
		await sendVerifyEmail(isUser.email, { username: isUser.username, tokenLink });
		return sendJsonResponse(res, 200, true, 'Check your email for email change token')
	} catch (error) {
		console.error('Error requesting for change email token', error)
		return sendJsonResponse(res, 500, false, 'Internal server error occurred')
	}
}

//delete user
module.exports.request_du_token = async function(req, res) {
	try {
		const user = req.session.user;

		if (!user || Object.keys(user).length === 0) {
			return sendJsonResponse(res, 401, false, 'You are not authenticated')
		}
		const isUser = await User.findOne({ email: email.trim().toLowerCase() })
		if (!isUser) {
			return sendJsonResponse(res, 404, false, 'User not found')
		}
		if (isUser.onKillList) {
			return sendJsonResponse(res, 403, true, 'user has been scheduled to be deleted', { onKillList: true })
		}
		const { success, status, message, plain, hashed } = await Token.generateLongLivedToken({ email: isUser.email, purpose: 'changeEmail' })
		if (!success) {
			return sendJsonResponse(res, status, success, message);
		}
		const csrf = await Csrf.generateToken(isUser.email, 'deleteUser')
		if (!csrf) {
			return sendJsonResponse(res, 500, false, 'Something went wrong,try again')
		}
		
		// kill Date 
		const twoWeeks = new Date(Date.now() + (14 * 24 * 60 * 60 * 1000)).toUTCString()

		const tokenLink = constructLink(csrf.token, hashed, 'change-email')
		await sendDeleteUserEmail(isUser.email, { username: isUser.username, tokenLink, date });
		return sendJsonResponse(res, 200, true, 'account scheduled for delete ')
	} catch (error) {
		console.error('Error requesting for delete user token', error)
		return sendJsonResponse(res, 500, false, 'Internal server error occurred')
	}
}


module.exports.GET_emailVerification = async (req, res) => {
	try {
		const token = req.params.token?.trim();
		const kaf = req.query.kaf?.trim();

		if (!token || !kaf) {
			return res.status(400).send(errorTemplate('Token or CSRF is missing.'));
		}

		const csrf = await Csrf.verifyToken(kaf, 'verifyEmail');
		if (!csrf) {
			return res.status(403).send(errorTemplate('403', 'Invalid CSRF token.'));
		}

		const { status, success, message, email } = await Token.verifyToken(token, 'verifyEmail');
		if (!success) {
			return res.status(status).send(errorTemplate(status, message || 'Token verification failed.'));
		}

		const userUpdateResult = await User.findOneAndUpdate({ email }, { $set: { isVerified: true } }, { new: true });

		if (!userUpdateResult) {
			return res.status(404).send(errorTemplate('404', 'User not found.'));
		}

		return res.status(200).send(emailVerificationTemplate());
	} catch (error) {
		console.error('Error verifying user email:', error);
		return res.status(500).send(errorTemplate('Internal server error.'));
	}
};

module.exports.GET_resetPassword = async (req, res) => {
	try {
		const token = req.params.token?.trim();
		const kaf = req.query.kaf?.trim();


		if (!token || !kaf) {
			return res.status(400).send(errorTemplate('400 - missing field', 'Invalid request.'));
		}

		const csrf = await Csrf.verifyToken(kaf, 'forgotPassword');
		if (!csrf) {
			return res.status(403).send(errorTemplate('403', 'Invalid CSRF token.'));
		}

		const { status, success, message, email } = await Token.verifyToken(token, 'forgotPassword');
		if (!success) {
			return res.status(status).send(errorTemplate(status, message || 'Token verification failed.'));
		}
		return res.status(200).send(resetPasswordTemplate(email.trim()))
	} catch (error) {
		console.error('Error resetting password', error)
		return res.status(500).send(errorTemplate('500', 'Internal server error occurred.'));
	}
}

module.exports.GET_changePassword = async (req, res) => {
	try {
		const token = req.params.token?.trim();
		const kaf = req.query.kaf?.trim();


		if (!token || !kaf) {
			return res.status(400).send(errorTemplate('400 - missing field', 'Invalid request.'));
		}

		const csrf = await Csrf.verifyToken(kaf, 'changePassword');
		if (!csrf) {
			return res.status(403).send(errorTemplate('403', 'Invalid CSRF token.'));
		}

		const { status, success, message, email } = await Token.verifyToken(token, 'changePassword');
		if (!success) {
			return res.status(status).send(errorTemplate(status, message || 'Token verification failed.'));
		}
		return res.status(200).send(changePasswordTemplate(email.trim()))
	} catch (error) {
		console.error('Error changing password', error)
		return res.status(500).send(errorTemplate('500', 'Internal server error occurred.'));
	}
}

module.exports.GET_changeEmail = async (req, res) => {
	try {
		const token = req.params.token?.trim();
		const kaf = req.query.kaf?.trim();


		if (!token || !kaf) {
			return res.status(400).send(errorTemplate('400 - missing field', 'Invalid request.'));
		}

		const csrf = await Csrf.verifyToken(kaf, 'changeEmail');
		if (!csrf) {
			return res.status(403).send(errorTemplate('403', 'Invalid CSRF token.'));
		}

		const { status, success, message, email } = await Token.verifyToken(token, 'changeEmail');
		if (!success) {
			return res.status(status).send(errorTemplate(status, message || 'Token verification failed.'));
		}
		return res.status(200).send(changeEmailTemplate())
	} catch (error) {
		console.error('Error  changing email', error)
		return res.status(500).send(errorTemplate('500', 'Internal server error occurred.'));
	}
}

module.exports.GET_cancelDeletUser = async (req, res) => {
	try {
		const token = req.params.token?.trim();

		if (!token) {
			return res.status(400).send(errorTemplate('400 - missing field', 'Invalid request.'));
		}
		const { status, success, message, email } = await Token.verifyToken(token, 'deleteUser');
		if (!success) {
			return res.status(status).send(errorTemplate(status, message || 'Token verification failed.'));
		}
		const isUser = await User.findOne({ email })
		if (!isUser) {
			return res.status(404).send(errorTemplate('404', 'User not found'))
		}
		if (!isUser.onKillList) {
			return res.status(403).send(errorTemplate('403', 'Action denied'))
		}
		isUser.onKillList = false;
		await isUser.save()
		return res.status(200).send(cancelDeleteUserTemplate())
	} catch (error) {
		console.error('Error cancelling delete schedule', error)
		return res.status(500).send(errorTemplate('500', 'Internal server error occurred.'));
	}
}