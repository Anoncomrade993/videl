const Token = require('../models/Token.js')
const User = require('../models/User.js')
const Schedule = require('../models/Schedule.js')
const Scrypt = require('../services/Scrypt.js')
const { sendJsonResponse } = require('../utility/helpers.js')
const { EMAIL_REGEX } = require('../constants.js')
const {
	sendVerifyEmail,
	sendEmailChangeEmail,
	sendChangePasswordEmail,
	sendForgotPasswordEmail,
	sendDeleteUserEmail
} = require('../services/Brevo.js');

const { saveSession, destroySession } = require('../middlewares/session.js')
const generateAvatar = require('../identicons/generator.js')


module.exports.registerUser = async function(req, res) {
	try {
		const { email, username, password } = req.body
		let avatar = null;
		// Validate input
		if (!email.trim() || !username.trim() || !password.trim()) {
			return sendJsonResponse(res, 400, false, 'Provide credentials to create an account')
		}

		if (!EMAIL_REGEX.test(email.trim().toLowerCase())) {
			return sendJsonResponse(res, 400, false, 'Invalid Email Address')
		}
		const exists = await User.exists({ email });
		if (exists) {
			return sendJsonResponse(res, 400, false, 'Email in use')
		}
		avatar = generateAvatar(username);

		// Create user
		const { success, message, user } = await User.createUser({ email, password, username, avatar })
		if (!success) return sendJsonResponse(res, 500, false, message)

		// Generate verification token
		const { success: created, message: _, plain } = await Token.generateToken({
			email,
			purpose: 'verifyEmail'
		});

		if (!created) {
			return sendJsonResponse(res, 500, false, 'Internal server error occurred ')
		}

		req.session.user = {
			email: user.email,
			userId: user._id,
			lastLogin: null,
			lastAccess: new Date(),
			isVerified: user.isVerified,
			username: user.username
		}
		await saveSession(req);

		// Send verification email
		await sendVerifyEmail(user.email, { username, token: plain });

		return sendJsonResponse(res, 201, true, 'User created successfully. Please verify your email.')
	} catch (error) {
		console.error('Error creating User account', error)
		return sendJsonResponse(res, 500, false, 'Internal server error occurred')
	}
}


module.exports.emailVerification = async function(req, res) {
	try {
		const { email, token } = req.body;

		if (!token.trim() || !email.trim()) {
			return sendJsonResponse(res, 400, false, 'Provide token for verification process')
		}

		if (!EMAIL_REGEX.test(email.trim().toLowerCase())) {
			return sendJsonResponse(res, 400, false, 'Invalid email address')
		}

		const exists = await User.exists({ email })

		if (!exists) {
			return sendJsonResponse(res, 400, false, 'Email not matched any user')
		}

		const { success, message: _ } = await Token.verifyToken({ email, token, purpose: 'verifyEmail' });

		if (!success) {
			return sendJsonResponse(res, 400, false, 'Invalid or expired token')
		}
		await User.findOneAndUpdate({ email }, { $set: { isVerified: true } });
		return sendJsonResponse(res, 200, true, 'Email verified successfully')
	} catch (error) {
		console.error('Error verifying user email', error)
		return sendJsonResponse(res, 500, false, 'Internal server error ')
	}
}

module.exports.loginUser = async function(req, res) {
	try {
		const { email, password } = req.body;

		if (!email.trim() || !password.trim()) {
			return sendJsonResponse(res, 400, false, 'Provide credentials to login')
		}
		if (!EMAIL_REGEX.test(email.trim().toLowerCase())) {
			return sendJsonResponse(res, 400, false, 'Invalid email address');
		}
		const isUser = await User.findOne({ email });
		if (!isUser) {
			return sendJsonResponse(res, 404, false, 'user does not exist')
		}
		if (isUser.onKillList) {
			return sendJsonResponse(res, 403, true, 'user scheduled to be deleted', { onKillList: true })
		}
		const isPassword = await isUser.comparePassword(password);
		if (!isPassword) {
			return sendJsonResponse(res, 401, false, 'Password is incorrect')
		}
		req.session.user = {
			email: isUser.email,
			userId: isUser._id,
			lastLogin: new Date(),
			isVerified: isUser.isVerified,
			lastAccess: new Date(),
			username: isUser.username
		}

		await saveSession(req);
		return sendJsonResponse(res, 200, true, 'logged in')

	} catch (error) {
		console.error('Error logging user in', error)
		return sendJsonResponse(res, 500, false, 'Internal server error')
	}
}

module.exports.logoutUser = function(req, res) {
	try {
		const user = req.session.user
		if (!user || Object.keys(user).length === 0) {
			return sendJsonResponse(res, 401, false, 'You are not authenticated')
		}

		destroySession(req).then(() => res.clearCookie('connect.sid')).catch(err => {
			return sendJsonResponse(res, 500, false, 'Internal server error occurred')
		});
		return sendJsonResponse(res, 200, true, 'session destroyed successfully')
	} catch (error) {
		console.error('Error clearing user cookies', error)
		return sendJsonResponse(res, 500, false, 'Internal server error occurred')
	}
}


module.exports.changeEmail = async function(req, res) {
	try {
		const { token, email, password } = req.body;
		const user = req.session.user;

		if (!user || Object.keys(user).length === 0) {
			return sendJsonResponse(res, 401, false, 'You are not authenticated')
		}

		if (!token.trim() || !email.trim()) {
			return sendJsonResponse(res, 400, false, 'Provide credentials to continue')
		}
		if (!EMAIL_REGEX.test(email.trim().toLowerCase())) {
			return sendJsonResponse(res, 400, false, 'Invalid email address')
		}
		const exists = await User.exists({ email })
		if (exists) {
			return sendJsonResponse(res, 400, false, 'Email address already in use')
		}

		const { success, message: _ } = await Token.verifyToken({ email, purpose: 'changeEmail', token });
		if (!success) {
			return sendJsonResponse(res, 404, false, 'Invalid or expired token')
		}
		const isUser = await User.findOne({ _id: user.userId });
		if (!isUser) {
			return sendJsonResponse(res, 404, false, 'user does not exist')
		}
		if (isUser.onKillList) {
			return sendJsonResponse(res, 403, true, 'user has been scheduled to be deleted', { onKillList: true })
		}
		const isPassword = await isUser.comparePassword(password);
		if (!isPassword) {
			return sendJsonResponse(res, 401, false, 'Password is incorrect')
		}
		isUser.email = email;
		await user.save()
	} catch (error) {
		console.error('Error changing user email', error)
		return sendJsonResponse(res, 500, false, 'Internal server error occurred')
	}
}

module.exports.changePassword = async function(req, res) {
	try {
		const { currPassword, newPassword, token } = req.body;
		const user = req.session.user;

		if (!user || Object.keys(user).length === 0) {
			return sendJsonResponse(res, 401, false, 'You are not authenticated')
		}

		if (!currPassword.trim() || !newPassword.trim() || !token.trim()) {
			return sendJsonResponse(res, 400, false, 'Provide credentials to continue')
		}

		const isUser = await User.findOne({ _id: user.userId });
		if (!isUser) {
			return sendJsonResponse(res, 404, false, 'user does not exist')
		}
		if (isUser.onKillList) {
			return sendJsonResponse(res, 403, true, 'user has been scheduled to be deleted', { onKillList: true })
		}

		const { success, message: _ } = await Token.verifyToken({ email: isUser.email, purpose: 'changePassword', token })
		if (!success) {
			return sendJsonResponse(res, 404, false, 'Token invalid or expired')
		}
		const isPassword = await isUser.comparePassword(currPassword);
		if (!isPassword) {
			return sendJsonResponse(res, 400, false, 'Current password mismatched')
		}

		const isSamePassword = await isUser.comparePassword(newPassword);
		if (isSamePassword) {
			return sendJsonResponse(res, 400, false, 'New password shouldn\'t match current one')
		}



		isUser.password = await Scrypt.verifyToken(newPassword);
		await isUser.save()
		return sendJsonResponse(res, 200, true, 'Password changed successfully')
	} catch (error) {
		console.error('Error changing user password', error)
		return sendJsonResponse(res, 500, false, 'Internal server error occurred')
	}
}

module.exports.forgotPassword = async function(req, res) {
	try {
		const { email, token, newPassword } = req.body;
		const user = req.session.user;

		if (user || Object.keys(user).length !== 0) {
			await destroySession(req).then(() => res.clearCookie('connect.sid')).catch(err => {
				return sendJsonResponse(res, 500, false, 'Internal server error occurred ')
			})
		}

		if (!email.trim() || !newPassword.trim() || !token.trim()) {
			return sendJsonResponse(res, 400, false, 'Provide credentials to continue')
		}
		if (!EMAIL_REGEX.test(email)) {
			return sendJsonResponse(res, 400, false, 'Invalid email address')
		}
		const isUser = await User.findOne({ email });
		if (!isUser) {
			return sendJsonResponse(res, 404, false, 'user not found')
		}
		if (isUser.onKillList) {
			return sendJsonResponse(res, 403, true, 'user has been scheduled to be deleted', { onKillList: true })
		}
		const { success, message: _ } = await Token.verifyToken({ email: isUser.email, purpose: 'forgotPassword', token })
		if (!success) {
			return sendJsonResponse(res, 404, false, 'Token invalid or expired')
		}
		isUser.password = await Scrypt.verifyToken(newPassword);
		await isUser.save()
		return sendJsonResponse(res, 200, true, 'Password updated successfully');
	} catch (error) {
		console.error('Error updating password on forgotten password', error)
		return sendJsonResponse(res, 500, false, 'Internal server error occurred')
	}
}

module.exports.request_cp_OTP = async function(req, res) {
	try {
		const user = req.session.user;

		if (!user || Object.keys(user).length === 0) {
			return sendJsonResponse(res, 401, false, 'You are not authenticated')
		}
		const isUser = await User.findOne({ _id: user.userId });
		if (!isUser) {
			return sendJsonResponse(res, 404, false, 'user not found')
		}
		if (isUser.onKillList) {
			return sendJsonResponse(res, 403, true, 'user has been scheduled to be deleted', { onKillList: true })
		}
		const { success, message: _, plain } = await Token.generateToken({ email: isUser.email, purpose: 'changePassword' });
		if (!success) {
			return sendJsonResponse(res, 500, false, 'Internal server error occurred')
		}
		await sendChangePasswordEmail(isUser.email, { username: isUser.username, token: plain });
		return sendJsonResponse(res, 201, true, 'check your email for token', { sent: true })
	} catch (error) {
		console.error('Error on request for change password token', error)
		return sendJsonResponse(res, 500, false, 'Internal server error occurred')
	}
}



module.exports.request_ce_OTP = async function(req, res) {
	try {
		const user = req.session.user;

		if (!user || Object.keys(user).length === 0) {
			return sendJsonResponse(res, 401, false, 'You are not authenticated')
		}
		const isUser = await User.findOne({ _id: user.userId });
		if (!isUser) {
			return sendJsonResponse(res, 404, false, 'user not found')
		}

		if (isUser.onKillList) {
			return sendJsonResponse(res, 403, true, 'user has been scheduled to be deleted', { onKillList: true })
		}

		const { success, message: _, plain } = await Token.generateToken({ email: isUser.email, purpose: 'changeEmail' });
		if (!success) {
			return sendJsonResponse(res, 500, false, 'Internal server error occurred')
		}
		await sendEmailChangeEmail(isUser.email, { username: isUser.username, token: plain });
		return sendJsonResponse(res, 201, true, 'check your email for token', { sent: true })
	} catch (error) {
		console.error('Error on request for change email token', error)
		return sendJsonResponse(res, 500, false, 'Internal server error occurred')
	}
}



module.exports.request_ev_OTP = async function(req, res) {
	try {
		const email = req.body.email;
		if (!email.trim()) {
			return sendJsonResponse(res, 400, false, 'Provide email to continue')
		}
		if (!EMAIL_REGEX.test(email.trim().toLowerCase())) {
			return sendJsonResponse(res, 400, false, 'Invalid email address')
		}
		const isUser = await User.findOne({ email });
		if (!isUser) {
			return sendJsonResponse(res, 404, false, 'User not found')
		}
		const { success, message: _, plain } = await Token.generateToken({ email, purpose: 'VerifyEmail' });
		if (!success) {
			return sendJsonResponse(res, 500, false, 'Internal server error occurred')
		}
		await sendVerifyEmail(isUser.email, { username: isUser.username, token: plain });
		return sendJsonResponse(res, 201, true, 'check email for token')
	} catch (error) {
		console.error('Error generating email verification token ', error)
		return sendJsonResponse(res, 500, false, 'Internal server error occurred')
	}
}

module.exports.request_fp_OTP = async function(req, res) {
	try {
		const email = req.body;
		if (!email.trim()) {
			return sendJsonResponse(res, 400, false, 'Provide email to continue')
		}
		if (!EMAIL_REGEX.test(email.trim().toLowerCase())) {
			return sendJsonResponse(res, 400, false, 'Invalid email address')
		}
		const isUser = await User.findOne({ email })
		if (!isUser) {
			return sendJsonResponse(res, 404, false, 'user not found')
		}
		if (isUser.onKillList) {
			return sendJsonResponse(res, 403, true, 'user has been scheduled to be deleted', { onKillList: true })
		}

		const { success, message: _, plain } = await Token.generateToken({ email, purpose: 'forgotPassword' })
		if (!success) {
			return sendJsonResponse(res, 500, false, 'Internal server error occurred')
		}

		await sendForgotPasswordEmail(isUser.email, { username: isUser.username, token: plain })
		return sendJsonResponse(res, 200, true, 'check email for token')
	} catch (error) {
		console.error('Error generating forgotPassword token', error)
		return sendJsonResponse(res, 500, false, 'Internal server error occurred')
	}
}



module.exports.deleteUser = async function(req, res) {
	try {
		const { currPassword, token } = req.body;
		const user = req.session.user;

		if (!user || Object.keys(user).length === 0) {
			return sendJsonResponse(res, 401, false, 'You are not authenticated')
		}

		if (!currPassword.trim() || !token.trim()) {
			return sendJsonResponse(res, 400, false, 'Provide credentials to continue')
		}

		const isUser = await User.findOne({ _id: user.userId });
		if (!isUser) {
			return sendJsonResponse(res, 404, false, 'user does not exist')
		}
		if (isUser.onKillList) {
			return sendJsonResponse(res, 403, true, 'user already scheduled to be deleted', { onKillList: true })
		}

		const { success, message: _, plain } = await Token.verifyToken({ email: isUser.email, purpose: 'deleteUser', token })
		if (!success) {
			return sendJsonResponse(res, 404, false, 'Token invalid or expired')
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

		isUser.onKillList = true;
		await isUser.save();
		await sendDeleteUserEmail(isUser.email, { username: isUser.username, date: tweeks.toUTCString(), token: plain, url: '' })
		return sendJsonResponse(res, 200, true, 'account deletion scheduled successfully')
	} catch (error) {
		console.error('Error changing user password', error)
		return sendJsonResponse(res, 500, false, 'Internal server error occurred')
	}
}


module.exports.cancelDeleteUser = async function(req, res)
{
	try {
		const { token, email } = req.body;
		const user = req.session.user;

		if (user || Object.keys(user).length !== 0) {
			destroySession(req).then(() => res.clearCookie('connect.sid')).catch(err => sendJsonResponse(res, 500, false, 'Internal server error occurred'))
		}
		if (!token.trim() || token.trim().length > 8 || !email.trim()) {
			return sendJsonResponse(res, 400, false, 'missing parameter or invalid toke')
		}
		if (!EMAIL_REGEX.test(email.trim().toLowerCase())) {
			return sendJsonResponse(res, 400, false, 'invalid email address')
		}
		const isUser = await User.findOne({ email });
		if (!isUser) {
			return sendJsonResponse(res, 404, false, 'user not found')
		}
		if (!isUser.onKillList) {
			return sendJsonResponse(res, 403, false, 'You are not allowed to perform this action')
		}

		const { success, status, message } = await Token.verifyToken({ email: isUser.email, purpose: 'deleteUser', token })
		if (!success) {
			return sendJsonResponse(res, status, success, message)
		}
		const { success: isCancelled } = await Schedule.cancelSchedule(isUser._id)
		if (!isCancelled) {
			return sendJsonResponse(res, 500, false, 'Internal server error occurred')
		}
		isUser.onKillList = false;
		await isUser.save();
		return sendJsonResponse(res, 200, true, 'account deletion cancelled successfully')
	} catch (error) {
		console.error('Error canceling user delete', error)
		return sendJsonResponse(res, 500, false, 'internal server error occurred')
	}
}


module.exports.getUserProfile = async function(req, res) {
	try {
		const user = req.session.user;
		if (!user || Object.keys(user).length === 0) {
			return sendJsonResponse(res, 401, false, 'You are not authenticated')
		}
		const isUser = await User.findOne({ _id: user.userId });
		if (!isUser) {
			return sendJsonResponse(res, 404, false, 'user not found')
		}
		return sendJsonResponse(res, 200, true, '_', {
			username: isUser.username,
			avatar: isUser.avatar
		})
	} catch (error) {
		console.error('Error getting user profile', error)
		return sendJsonResponse(res, 500, false, 'Internal server error occurred')
	}
}