require('dotenv').config()
const Csrf = require('../models/Csrf.js')
const User = require('../models/User.js');
const Token = require('../models/Token.js')
const Scrypt = require('../services/Scrypt.js')

const errorTemplate = require('../shared/error_template.html.js')

const changeEmailTemplate = require('../shared/change_email.html.js')
const emailVerificationTemplate = require('../shared/email_verification.html.js')
const changePasswordTemplate = require('../shared/change_password.html.js')
const resetPasswordTemplate = require('../shared/reset_password.html.js')
const cancelDeleteUserTemplate = require('../shared/cancel_delete_user.html.js')

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
		const { success: fpSuccess, status: fpStatus, message: fpMessage, plain: fpPlain, hashed: fpHashed } = await Token.generateShortLivedToken({ email: isUser.email, purpose: 'forgotPassword' })
		if (!fpSuccess) {
			return sendJsonResponse(res, fpStatus, fpSuccess, fpMessage);
		}
		const csrf = await Csrf.generateToken(isUser.email, 'forgotPassword')
		if (!csrf) {
			return sendJsonResponse(res, 500, false, 'Something went wrong,try again')
		}
		const tokenLink = constructLink(csrf.token, fpHashed, 'reset-password')
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
		const { success: evSuccess, status: evStatus, message: evMessage, plain: evPlain, hashed: evHashed } = await Token.generateShortLivedToken({ email: isUser.email, purpose: 'verifyEmail' })
		if (!evSuccess) {
			return sendJsonResponse(res, evStatus, evSuccess, evMessage);
		}
		const csrf = await Csrf.generateToken(isUser.email, 'verifyEmail')
		if (!csrf) {
			return sendJsonResponse(res, 500, false, 'Something went wrong,try again')
		}
		const tokenLink = constructLink(csrf.token, evHashed, 'verify-email')
		await sendVerifyEmail(isUser.email, { username: isUser.username, tokenLink });
		return sendJsonResponse(res, 200, true, 'Check your email for verification token')
	} catch (error) {
		console.error('Error requesting for email verification token', error)
		return sendJsonResponse(res, 500, false, 'Internal server error occurred')
	}
}

module.exports.request_cp_token = async function(req, res) {
	try {
		const user = req.session?.user;

		if (!user || Object.keys(user).length === 0) {
			return sendJsonResponse(res, 401, false, 'You are not authenticated')
		}
		const { email } = user;
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

		const { success: cpSuccess, status: cpStatus, message: cpMessage, plain: cpPlain, hashed: cpHashed } = await Token.generateShortLivedToken({ email: isUser.email, purpose: 'changePassword' })
		if (!cpSuccess) {
			return sendJsonResponse(res, cpStatus, cpSuccess, cpMessage);
		}

		const csrf = await Csrf.generateToken(isUser.email, 'changePassword')
		if (!csrf) {
			return sendJsonResponse(res, 500, false, 'Something went wrong,try again')
		}

		const tokenLink = constructLink(csrf.token, cpHashed, 'change-password')
		await sendChangePasswordEmail(isUser.email, { username: isUser.username, tokenLink });

		return sendJsonResponse(res, 200, true, 'Check your email for password change token')
	} catch (error) {
		console.error('Error requesting for change password token', error)
		return sendJsonResponse(res, 500, false, 'Internal server error occurred')
	}
}

// user requests with a new email 
// generate csrf  with current email, generate token with new email 
// send link to new email 
module.exports.request_ce_token = async function(req, res) {
	try {
		const user = req.session.user;

		if (!user || Object.keys(user).length === 0) {
			return sendJsonResponse(res, 401, false, 'You are not authenticated')
		}
		const { email } = req.body;
		const { email: currEmail } = user;

		if (!email.trim()) {
			return sendJsonResponse(res, 400, false, 'provide an email address')
		}
		if (!EMAIL_REGEX.test(email.trim().toLowerCase())) {
			return sendJsonResponse(res, 400, false, 'Invalid email address')
		}
		const exists = await User.exists({ email })
		if (!exists) {
			return sendJsonResponse(res, 400, false, 'Email in use')
		}

		const isUser = await User.findOne({ email: currEmail.trim().toLowerCase() })
		if (!isUser) {
			return sendJsonResponse(res, 404, false, 'User not found')
		}

		if (isUser.onKillList) {
			return sendJsonResponse(res, 403, true, 'user has been scheduled to be deleted', { onKillList: true })
		}

		const { success: ceSuccess, status: ceStatus, message: ceMessage, plain: cePlain, hashed: ceHashed } = await Token.generateShortLivedToken({ email, purpose: 'changeEmail' })
		if (!ceSuccess) {
			return sendJsonResponse(res, ceStatus, ceSuccess, ceMessage);
		}

		const csrf = await Csrf.generateToken(currEmail, 'changeEmail')
		if (!csrf) {
			return sendJsonResponse(res, 500, false, 'Something went wrong,try again')
		}

		const tokenLink = constructLink(csrf.token, ceHashed, 'change-email')
		await sendEmailChangeEmail(email, { username: isUser.username, tokenLink });
		return sendJsonResponse(res, 200, true, 'Check your email for email change token')
	} catch (error) {
		console.error('Error requesting for change email token', error)
		return sendJsonResponse(res, 500, false, 'Internal server error occurred')
	}
}

module.exports.request_du_token = async function(req, res) {
	try {
		const user = req.session.user;

		if (!user || Object.keys(user).length === 0) {
			return sendJsonResponse(res, 401, false, 'You are not authenticated')
		}
		const isUser = await User.findOne({ email: user.email.trim().toLowerCase() })
		if (!isUser) {
			return sendJsonResponse(res, 404, false, 'User not found')
		}
		if (isUser.onKillList) {
			return sendJsonResponse(res, 403, true, 'user has been scheduled to be deleted', { onKillList: true })
		}
		const { success: duSuccess, status: duStatus, message: duMessage, plain: duPlain, hashed: duHashed } = await Token.generateLongLivedToken({ email: isUser.email, purpose: 'changeEmail' })
		if (!duSuccess) {
			return sendJsonResponse(res, duStatus, duSuccess, duMessage);
		}
		const csrf = await Csrf.generateToken(isUser.email, 'deleteUser')
		if (!csrf) {
			return sendJsonResponse(res, 500, false, 'Something went wrong,try again')
		}

		const twoWeeks = new Date(Date.now() + (14 * 24 * 60 * 60 * 1000)).toUTCString()

		const tokenLink = constructLink(csrf.token, duHashed, 'cancel-delete-user')
		await sendDeleteUserEmail(isUser.email, { username: isUser.username, tokenLink, date: twoWeeks });
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

		const { status: evStatus, success: evSuccess, message: evMessage, email } = await Token.verifyToken(token, 'verifyEmail');
		if (!evSuccess) {
			return res.status(evStatus).send(errorTemplate(evStatus, evMessage || 'Token verification failed.'));
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

		const { status: rpStatus, success: rpSuccess, message: rpMessage, email } = await Token.verifyToken(token, 'forgotPassword');
		if (!rpSuccess) {
			return res.status(rpStatus).send(errorTemplate(rpStatus, rpMessage || 'Token verification failed.'));
		}
		return res.status(200).send(resetPasswordTemplate(email.trim(), token.trim()))
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

		const { status: cpStatus, success: cpSuccess, message: cpMessage, email } = await Token.verifyToken(token, 'changePassword');
		if (!cpSuccess) {
			return res.status(cpStatus).send(errorTemplate(cpStatus, cpMessage || 'Token verification failed.'));
		}
		return res.status(200).send(changePasswordTemplate(email.trim(), token.trim()))
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

		const { status: ceStatus, success: ceSuccess, message: ceMessage, email } = await Token.verifyToken(token, 'changeEmail');
		if (!ceSuccess) {
			return res.status(ceStatus).send(errorTemplate(ceStatus, ceMessage || 'Token verification failed.'));
		}
		return res.status(200).send(changeEmailTemplate(kaf.trim(), token.trim()))
	} catch (error) {
		console.error('Error changing password', error)
		return res.status(500).send(errorTemplate('500', 'Internal server error occurred.'));

	}
}

module.exports.GET_cancelDeletUser = async (req, res) => {
	try {
		const token = req.params.token?.trim();

		if (!token) {
			return res.status(400).send(errorTemplate('400 - missing field', 'Invalid request.'));
		}
		const { status: cdStatus, success: cdSuccess, message: cdMessage, email } = await Token.verifyToken(token, 'deleteUser');
		if (!cdSuccess) {
			return res.status(cdStatus).send(errorTemplate(cdStatus, cdMessage || 'Token verification failed.'));
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

module.exports.POST_deleteUser = async function(req, res) {
	try {
		const user = req.session.user;
		const { password } = req.body;

		if (!user || Object.keys(user).length === 0) {
			return sendJsonResponse(res, 401, false, 'You are not authenticated')
		}

		if (!password.trim()) {
			return sendJsonResponse(res, 400, false, 'Provide credentials to continue')
		}

		const isUser = await User.findOne({ _id: user.userId });
		if (!isUser) {
			return sendJsonResponse(res, 404, false, 'user does not exist')
		}
		if (isUser.onKillList) {
			return sendJsonResponse(res, 403, true, 'user already scheduled to be deleted', { onKillList: true })
		}

		const isPassword = await isUser.comparePassword(password.trim());
		if (!isPassword) {
			return sendJsonResponse(res, 400, false, 'Current password mismatched')
		}

		const tweeks = new Date(Date.now() + (14 * 24 * 3600 * 1000))
		const { success: schedSuccess, status: schedStatus, message: schedMessage } = await Schedule.createSchedule(isUser._id);
		if (!schedSuccess) {
			return sendJsonResponse(res, schedStatus, schedSuccess, schedMessage)
		}

		const { success: duSuccess, status: duStatus, message: duMessage, plain: duPlain, hashed: duHashed } = await Token.generateShortLivedToken({
			email: isUser.email,
			purpose: 'changeEmail'
		})
		if (!duSuccess) {
			return sendJsonResponse(res, duStatus, duSuccess, duMessage);
		}

		const csrf = await Csrf.generateToken(isUser.email, 'changeEmail')
		if (!csrf) {
			return sendJsonResponse(res, 500, false, 'Something went wrong,try again')
		}

		const tokenLink = constructLink(null, duHashed, 'change-email')

		isUser.onKillList = true;
		await isUser.save();
		await sendDeleteUserEmail(isUser.email, {
			username: isUser.username,
			date: tweeks.toUTCString(),
			token: duPlain
		})
		return sendJsonResponse(res, 200, true, 'account deletion scheduled successfully')
	} catch (error) {
		console.error('Error changing user password', error)
		return sendJsonResponse(res, 500, false, 'Internal server error occurred')
	}
}

module.exports.POST_changePassword = async function(req, res) {
	try {
		const { token, email, cpassword, npassword } = req.body

		if (!token?.trim() || !email.trim() || !cpassword?.trim() || !npassword?.trim()) {
			return sendJsonResponse(res, 400, false, 'Missing fields required')
		}

		const { success: cpSuccess, status: cpStatus, message: cpMessage, email: tEmail } = await Token.verifyToken(token?.trim(), 'changePassword')
		if (!cpSuccess) {
			return sendJsonResponse(res, cpStatus, cpSuccess, cpMessage)
		}

		if (tEmail.trim().toLowerCase() !== email.trim().toLowerCase()) {
			return sendJsonResponse(res, 403, false, 'Nice try kid')
		}

		const isUser = await User.findOne({ email: tEmail.trim().toLowerCase() })
		if (!isUser) {
			return sendJsonResponse(res, 404, false, 'User not found')
		}

		const currPasswordMatched = await isUser.comparePassword(cpassword);
		if (!currPasswordMatched) {
			return sendJsonResponse(res, 400, false, 'Current password is incorrect')
		}

		const newPasswordMatched = await isUser.comparePassword(npassword);
		if (newPasswordMatched) {
			return sendJsonResponse(res, 400, false, 'New password cannot be the same as current password')
		}

		isUser.password = await Scrypt.hashToken(npassword);
		await isUser.save();

		return sendJsonResponse(res, 200, true, 'Password changed successfully')
	} catch (error) {
		console.error('Error changing password', error)
		return sendJsonResponse(res, 500, false, 'Internal server error occurred')
	}
}

module.exports.POST_resetPassword = async function(req, res) {
	try {
		const { token, email, npassword } = req.body;

		if (!token?.trim() || !email?.trim() || !npassword?.trim()) {
			return sendJsonResponse(res, 400, false, 'Missing fields required')
		}

		const { success: rpSuccess, status: rpStatus, message: rpMessage, email: tEmail } = await Token.verifyToken(token?.trim(), 'forgotPassword')
		if (!rpSuccess) {
			return sendJsonResponse(res, rpStatus, rpSuccess, rpMessage)
		}

		if (tEmail.trim().toLowerCase() !== email.trim().toLowerCase()) {
			return sendJsonResponse(res, 403, false, 'Nice try kid')
		}

		const user = await User.findOne({ email: tEmail.trim().toLowerCase() });
		if (!user) {
			return sendJsonResponse(res, 400, false, 'Invalid or expired reset token')
		}

		const passwordMatched = await user.comparePassword(npassword);
		if (passwordMatched) {
			return sendJsonResponse(res, 400, false, 'New password cannot be the same as current password')
		}

		user.password = await Scrypt.hashToken(npassword);
		await user.save();

		return sendJsonResponse(res, 200, true, 'Password reset successfully')
	} catch (error) {
		console.error('Error resetting password', error);
		return sendJsonResponse(res, 500, false, 'Internal server error occurred')
	}
}

// user requests with the payload 
// verify csrf with current email, verify token with new email 
// process password 
// set verified 

module.exports.POST_changeEmail = async function(req, res) {
	try {
		const { kaf, token, password } = req.body
		if (!kaf?.trim() || !token?.trim() || !password?.trim()) {
			return sendJsonResponse(res, 400, false, 'missing fields')
		}

		const csrf = await Csrf.verifyToken(kaf?.trim(), 'changeEmail')
		if (!csrf) {
			return sendJsonResponse(res, 400, false, 'missing field')
		}
		const { email: currEmail } = csrf;

		const { success: ceSuccess, status: ceStatus, message: ceMessage, email } = await Token.verifyToken(token?.trim(), 'changeEmail')
		if (!ceSuccess) {
			return sendJsonResponse(res, ceStatus, ceSuccess, ceMessage)
		}

		let exists = await User.exists({ email });
		if (exists) {
			return sendJsonResponse(res, 400, false, 'New email already in use')
		}
		exists = null;

		const isUser = await User.findOne({ email: currEmail });
		if (!isUser) {
			return sendJsonResponse(res, 404, false, 'User not found')
		}

		let isMatched = await isUser.comparePassword(password.trim());
		if (!isMatched) {
			return sendJsonResponse(res, 400, false, 'Password mismatched')
		}
		isMatched = null;

		isUser.email = email;
		isUser.isVerified = true;
		await isUser.save();

		if (req.session.user) {
			try {
				await destroySession(req);
				res.clearCookie('connect.sid');
			} catch (err) {
				return sendJsonResponse(res, 500, false, 'Internal server error occurred')
			}
		}

		return sendJsonResponse(res, 200, true, 'Email changed successfully')
	} catch (error) {
		console.error('Error changing email', error);
		return sendJsonResponse(res, 500, false, 'Internal server error occurred')
	}
}