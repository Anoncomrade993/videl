const Csrf = require('../models/Csrf.js')
const Token = require('../models/Token.js')
const User = require('../models/User.js')
const Schedule = require('../models/Schedule.js')
const Scrypt = require('../services/Scrypt.js')

const { sendJsonResponse, constructLink } = require('../utility/helpers.js')
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
		const { success: created, status, message: msg, plain, hashed } = await Token.generateShortLivedToken({ email, purpose: 'verifyEmail' });

		if (!created) {
			return sendJsonResponse(res, status, created, msg)
		}

		const csrf = await Csrf.generateToken(email, 'verifyEmail')
		if (!csrf) {
			return sendJsonResponse(res, 500, false, 'Something went wrong,try again')
		}
		const tokenLink = constructLink(csrf.token, hashed, 'verify-email')

		/****/
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
		await sendVerifyEmail(user.email, { username, tokenLink });

		return sendJsonResponse(res, 201, true, 'User created successfully. Please verify your email.')
	} catch (error) {
		console.error('Error creating User account', error)
		return sendJsonResponse(res, 500, false, 'Internal server error occurred')
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
			username: isUser.username,
			avatar: isUser.avatar
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
		return res.redirect(302, '/signin')
	} catch (error) {
		console.error('Error clearing user cookies', error)
		return sendJsonResponse(res, 500, false, 'Internal server error occurred')
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


		const csrf = await Csrf.generateToken('githubLogin@videl.com', 'github')
		if (!csrf) {
			return sendJsonResponse(res, 500, false, 'Something went wrong,try again')
		}

		// Construct GitHub OAuth URL
		const githubAuthURL = `https://github.com/login/oauth/authorize?` +
			`client_id=${process.env.GITHUB_CLIENT_ID}` +
			`&redirect_uri=${process.env.GITHUB_REDIRECT_URI}` +
			`&scope=user:email` +
			`&state=${csrf}`;
		res.redirect(302, githubAuthURL);
	} catch (error) {
		console.error('Error initializing Login with GitHub', error)
		return sendJsonResponse(res, 500, false, 'Internal server error occurred')
	}
}

module.exports.githubRegistrationCallBack = async function(req, res) {
	const { code, csrf } = req.query;

	if (!code.trim() || !csrf.trim()) {
		return sendJsonResponse(res, 400, false, 'Provide needed parameters')
	}

	const _csrf = await Csrf.verifyToken(csrf, 'github');

	// Validate state to prevent CSRF
	if (!_csrf) {
		return sendJsonResponse(res, 403, false, 'Invalid state parameter');
	}

	// Remove state after validation
	await Csrf.deleteOne({ token: _csrf, isUsed: true });

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


		const newUser = await User.create({
			username: githubUser.username,
			email: githubUser.email.trim().toLowerCase(),
			password: password,
			isVerified: true,
			avatar: githubUser.avatar,
			authProvider: 'github'
		});

		req.session.user = {
			email: newUser.email,
			userId: newUser._id,
			lastLogin: Date.now(),
			lastAccess: new Date(),
			isVerified: newUser.isVerified,
			username: newUser.username
		}
		await saveSession(req); //save session 
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