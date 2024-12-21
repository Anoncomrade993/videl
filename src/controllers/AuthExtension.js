//WET implemented here 
//don't want DRY 

require('dotenv').config()
const Csrf = require('../models/Csrf.js')
const User = require('../models/User.js');
const Token = require('../modela/Token.js')
const Scrypt = require('../services/Scrypt.js')

const errorTemplate = require('../shared/errorTemplate.html.js')

const changeEmailTemplate = require('../shared/change_email.html.js')
const emailVerificationTemplate = require('../shared/email_verification.html.js')
const changePasswordTemplate = require('../shared/.change_password.html.js')
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

		const { success, status, message, plain, hashed } = await Token.generateShortLivedToken({ email: isUser.email, purpose: 'changePassword' })
		if (!success) {
			return sendJsonResponse(res, status, success, message);
		}

		const csrf = await Csrf.generateToken(isUser.email, 'changePassword')
		if (!csrf) {
			return sendJsonResponse(res, 500, false, 'Something went wrong,try again')
		}

		const tokenLink = constructLink(csrf.token, hashed, 'change-password')
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
// process password 
// set verified 


module.exports.request_ce_token = async function(req, res) {
	try {
		const user = req.session.user;

		if (!user || Object.keys(user).length === 0) {
			return sendJsonResponse(res, 401, false, 'You are not authenticated')
		}
		const { email } = req.body;
		const { email: currEmail } = user; //session

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

		//token with new email 
		const { success, status, message, plain, hashed } = await Token.generateShortLivedToken({ email, purpose: 'changeEmail' })
		if (!success) {
			return sendJsonResponse(res, status, success, message);
		}
		//csrf with current email 
		const csrf = await Csrf.generateToken(currEmail, 'changeEmail')
		if (!csrf) {
			return sendJsonResponse(res, 500, false, 'Something went wrong,try again')
		}

		const tokenLink = constructLink(csrf.token, hashed, 'change-email')
		//generate tokens with current email, construct link and send to new email 

		await sendEmailChangeEmail(email, { username: isUser.username, tokenLink });
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
		const isUser = await User.findOne({ email: user.email.trim().toLowerCase() })
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

		const tokenLink = constructLink(csrf.token, hashed, 'cancel-delete-user')
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

		const { status, success, message, email } = await Token.verifyToken(token, 'changePassword');
		if (!success) {
			return res.status(status).send(errorTemplate(status, message || 'Token verification failed.'));
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

		const { status, success, message, email } = await Token.verifyToken(token, 'changeEmail');
		if (!success) {
			return res.status(status).send(errorTemplate(status, message || 'Token verification failed.'));
		}
		return res.status(200).send(changeEmailTemplate(kaf.trim(), token.trim()))
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

		const isPassword = await isUser.comparePassword(currPassword);
		if (!isPassword) {
			return sendJsonResponse(res, 400, false, 'Current password mismatched')
		}

		const tweeks = new Date(Date.now() + (14 * 24 * 3600 * 1000))
		const { success: done, status, message } = await Schedule.createSchedule(isUser._id);
		if (!done) {
			return sendJsonResponse(res, status, done, message)
		}
		const { success, status, message, plain, hashed } = await Token.generateShortLivedToken({ email: isUser.email, purpose: 'changeEmail' })
		if (!success) {
			return sendJsonResponse(res, status, success, message);
		}
		const csrf = await Csrf.generateToken(isUser.email, 'changeEmail')
		if (!csrf) {
			return sendJsonResponse(res, 500, false, 'Something went wrong,try again')
		}
		const tokenLink = constructLink(null, hashed, 'change-email')

		isUser.onKillList = true;
		await isUser.save();
		await sendDeleteUserEmail(isUser.email, { username: isUser.username, date: tweeks.toUTCString(), token: plain })
		return sendJsonResponse(res, 200, true, 'account deletion scheduled successfully')
	} catch (error) {
		console.error('Error changing user password', error)
		return sendJsonResponse(res, 500, false, 'Internal server error occurred')
	}
}




module.exports.POST_changePassword = async function(req, res) {
	try {
		const { token, email, cpassword, npassword } = req.body

		if (
			!token?.trim() ||
			!email.trim() ||
			!cpassword?.trim() ||
			!npassword?.trim()) {
			return sendJsonResponse(res, 400, false, 'Missing fields required')
		}

		const { success, status, message, email: tEmail } = await Token.verifyToken(token?.trim(), 'changePassword')
		if (!success) {
			return sendJsonResponse(res, status, success, message)
		}

		if (tEmail.trim().toLowerCase() !== email.trim().toLowerCase()) {
			return sendJsonResponse(res, 403, false, 'Nice try kid')
		}


		const isUser = await User.findOne({ email: tEmail.trim().toLowerCase() })
		if (!isUser) {
			return sendJsonResponse(res, 404, false, 'User not found')
		}

		const currPasswordMatched = await isUser.comparePassword(cpassword);
		const newPasswordMatched = await isUser.comparePassword(npassword);


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

		const { success, status, message, email: tEmail } = await Token.verifyToken(token?.trim(), 'forgotPassword')
		if (!success) {
			return sendJsonResponse(res, status, success, message)
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


// user requests with a new email 
// generate csrf with current email, generate token with new email 
// send link to new email 
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

		const { success, status, message, email } = await Token.verifyToken(token?.trim(), 'changeEmail')
		if (!success) {
			return sendJsonResponse(res, status, success, message)
		}
		//check misconduct on API 
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
		isMatched = null

		isUser.email = email;
		isUser.isVerified = true;
		await isUser.save();

		if (req.session.user) {
			destroySession(req).then(() => res.clearCookie('connect.sid')).catch(err => {
				return sendJsonResponse(res, 500, false, 'Internal server error occurred')
			});
		}
		return sendJsonResponse(res, 200, true, 'Email changed successfully')
	} catch (error) {
		console.error('Error changing email', error)
		return sendJsonResponse(res, 500, false, 'Internal server error occurred')
	}
}