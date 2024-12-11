const TempSession = require('../models/TempSession.js')
const Token = require('../models/Token.js')
const User = require('../models/User.js')
const Schedule = require('../models/Schedule.js')
const Scrypt = require('../services/Scrypt.js')

const { sendJsonResponse, } = require('../utility/helpers.js')
const { EMAIL_REGEX } = require('../constants.js')
const {
	sendVerifyEmail,
	sendEmailChangeEmail,
	sendChangePasswordEmail,
	sendForgotPasswordEmail,
	sendDeleteUserEmail
} = require('../services/Emailer.js');

const { saveSession, destroySession } = require('../middlewares/session.js')
const generateAvatar = require('../identicons/generator.js')
const axios = require('axios')

module.exports.registerUser = async function(req, res) {
	try {
		const { email, username, password, cpassword } = req.body
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
		avatar = await generateAvatar(username);

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
			username: user.username,
			avatar: user.avatar
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

/*
module.exports.emailVerification = async function(req, res) {
	try {
		const { token } = req.params;

		if (!token.trim()) {
			return sendJsonResponse(res, 400, false, 'Provide token for verification process')
		}

		const { status, success, message } = await Token.verifyEmailVerificationToken(token);
		if (!success) {
			return sendJsonResponse(res, status, success, message)
		}
		await User.findOneAndUpdate({ email }, { $set: { isVerified: true } });
		//return sendJsonResponse(res, 200, true, 'Email verified successfully')
		return res.redirect(302, '/signin')
	} catch (error) {
		console.error('Error verifying user email', error)
		//return sendJsonResponse(res, 500, false, 'Internal server error ')

	}
}

//Under comment now 
**/
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
			username: isUser.username,
			avatar: user.avatar
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
		const { success, message: _, plain } = await Token.generateToken({ email, purpose: 'verifyEmail' });
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





module.exports.signInWithGithub = async function(req, res) {
	try {

		const state = crypto.randomBytes(16).toString('hex');
		await TempSession.create({ state });

		// Construct GitHub OAuth URL
		const githubAuthURL = `https://github.com/login/oauth/authorize?` +
			`client_id=${process.env.GITHUB_CLIENT_ID}` +
			`&redirect_uri=${process.env.GITHUB_REDIRECT_URI}` +
			`&scope=user:email` +
			`&state=${state}`;
		res.redirect(302, githubAuthURL);
	} catch (error) {
		console.error('Error initializing Login with GitHub', error)
		return sendJsonResponse(res, 500, false, 'Internal server error occurred')
	}
}


module.exports.githubRegistrationCallBack = async function(req, res) {
	const { code, state } = req.query;

	if (!code.trim() || !state.trim()) {
		return sendJsonResponse(res, 400, false, 'Provide needed parameters')
	}

	const tempSess = await TempSession.findOne({ state });

	// Validate state to prevent CSRF
	if (!tempSess) {
		return sendJsonResponse(res, 403, false, 'Invalid state parameter');
	}

	// Remove state after validation
	await TempSession.deleteOne({ state });

	try {
		// Exchange code for access token
		const tokenResponse = await axios.post('https://github.com/login/oauth/access_token',
		{
			client_id: process.env.GITHUB_CLIENT_ID,
			client_secret: process.env.GITHUB_CLIENT_SECRET,
			code: code,
			redirect_uri: process.env.GITHUB_REDIRECT_URI
		},
		{
			headers: { 'Accept': 'application/json' }
		});

		const { access_token } = tokenResponse.data;

		// Fetch user information
		const userResponse = await axios.get('https://api.github.com/user', {
			headers: { 'Authorization': `token ${access_token}` }
		});

		// Fetch user emails
		const emailsResponse = await axios.get('https://api.github.com/user/emails', {
			headers: { 'Authorization': `token ${access_token}` }
		});

		// Find primary verified email
		const primaryEmail = emailsResponse.data.find(email =>
			email.verified && email.primary
		);

		// Extract user details
		const githubUser = {
			username: userResponse.data.login,
			name: userResponse.data.name,
			email: primaryEmail ? primaryEmail.email : userResponse.data.email,
			avatar: userResponse.data.avatar_url
		};

		// Check if email already exists
		const existingUser = await User.findOne({
			email: githubUser.email.trim().toLowerCase()
		});

		if (existingUser) {
			// If user exists, log them in
			req.session.userId = existingUser._id;
			return res.redirect(302, '/dashboard');
		}

		// Generate a random password for GitHub users
		const randomPassword = crypto.randomBytes(16).toString('hex');
		const password = await Scrypt.hashToken(randomPassword);


		// Create new user
		const newUser = await User.create({
			username: githubUser.username,
			email: githubUser.email.trim().toLowerCase(),
			password: password,
			isVerified: true,
			avatar: githubUser.avatar,
			authProvider: 'github'
		});

		// Set session for the new user
		req.session.user = {
			email: newUser.email,
			userId: newUser._id,
			lastLogin: Date.now(),
			lastAccess: new Date(),
			isVerified: newUser.isVerified,
			username: newUser.username
		}
		await saveSession(req); //save session 
		// Redirect to dashboard or profile completion
		return res.redirect(302, '/dashboard');

	} catch (error) {
		console.error('GitHub OAuth Error:', error);
		await destroySession(req)
		return sendJsonResponse(res, 500, false, 'Authentication failed');
	}
}

module.exports.checkUsername = async function(req, res) {
	try {
		const username = req.params.username.trim().toLowerCase();
		if (!username) {
			return sendJsonResponse(res, 400, false, 'provide username')
		}
		const exists = await User.exists({ username });
		if (exists) {
			return sendJsonResponse(res, 200, true, 'username in use')
		}
		return sendJsonResponse(res, 404, false, 'Username not in use')
	} catch (error) {
		console.error('Error checking username existence', error)
		return sendJsonResponse(res, 500, false, 'Internal server error occurred')
	}
}

module.exports.emailVerification = async function(req, res) {
	try {
		const { token } = req.params;

		if (!token.trim()) {
			return res.status(400).send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Email Verification Failed</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            margin: 0;
                            background-color: #f5f5f5;
                        }
                        .container {
                            text-align: center;
                            padding: 2rem;
                            background-color: white;
                            border-radius: 8px;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                            max-width: 90%;
                            width: 400px;
                        }
                        .error-icon {
                            color: #dc3545;
                            font-size: 48px;
                            margin-bottom: 1rem;
                        }
                        .message {
                            color: #333;
                            margin-bottom: 1.5rem;
                        }
                        .button {
                            background-color: #007bff;
                            color: white;
                            padding: 10px 20px;
                            border-radius: 4px;
                            text-decoration: none;
                            display: inline-block;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="error-icon">❌</div>
                        <h1>Verification Failed</h1>
                        <p class="message">Invalid verification token. Please provide a valid token.</p>
                        <a href="/signin" class="button">Go to Sign In</a>
                    </div>
                </body>
                </html>
            `);
		}

		const { status, success, message } = await Token.verifyEmailVerificationToken(token);
		if (!success) {
			return res.status(status).send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Email Verification Failed</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            margin: 0;
                            background-color: #f5f5f5;
                        }
                        .container {
                            text-align: center;
                            padding: 2rem;
                            background-color: white;
                            border-radius: 8px;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                            max-width: 90%;
                            width: 400px;
                        }
                        .error-icon {
                            color: #dc3545;
                            font-size: 48px;
                            margin-bottom: 1rem;
                        }
                        .message {
                            color: #333;
                            margin-bottom: 1.5rem;
                        }
                        .button {
                            background-color: #007bff;
                            color: white;
                            padding: 10px 20px;
                            border-radius: 4px;
                            text-decoration: none;
                            display: inline-block;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="error-icon">❌</div>
                        <h1>Verification Failed</h1>
                        <p class="message">${message}</p>
                        <a href="/signin" class="button">Go to Sign In</a>
                    </div>
                </body>
                </html>
            `);
		}

		await User.findOneAndUpdate({ email }, { $set: { isVerified: true } });

		return res.status(200).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Email Verification Successful</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        background-color: #f5f5f5;
                    }
                    .container {
                        text-align: center;
                        padding: 2rem;
                        background-color: white;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        max-width: 90%;
                        width: 400px;
                    }
                    .success-icon {
                        color: #28a745;
                        font-size: 48px;
                        margin-bottom: 1rem;
                    }
                    .message {
                        color: #333;
                        margin-bottom: 1.5rem;
                    }
                    .button {
                        background-color: #28a745;
                        color: white;
                        padding: 10px 20px;
                        border-radius: 4px;
                        text-decoration: none;
                        display: inline-block;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="success-icon">✅</div>
                    <h1>Verification Successful</h1>
                    <p class="message">Your email has been verified successfully!</p>
                    <a href="/signin" class="button">Go to Sign In</a>
                </div>
            </body>
            </html>
        `);
	} catch (error) {
		console.error('Error verifying user email', error);
		return res.status(500).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Error</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        background-color: #f5f5f5;
                    }
                    .container {
                        text-align: center;
                        padding: 2rem;
                        background-color: white;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        max-width: 90%;
                        width: 400px;
                    }
                    .error-icon {
                        color: #dc3545;
                        font-size: 48px;
                        margin-bottom: 1rem;
                    }
                    .message {
                        color: #333;
                        margin-bottom: 1.5rem;
                    }
                    .button {
                        background-color: #007bff;
                        color: white;
                        padding: 10px 20px;
                        border-radius: 4px;
                        text-decoration: none;
                        display: inline-block;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="error-icon">❌</div>
                    <h1>Something Went Wrong</h1>
                    <p class="message">An error occurred while verifying your email. Please try again later.</p>
                    <a href="/signin" class="button">Go to Sign In</a>
                </div>
            </body>
            </html>
        `);
	}
}