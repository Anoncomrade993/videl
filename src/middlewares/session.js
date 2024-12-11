const { sendJsonResponse } = require('../utility/helpers.js')

module.exports.sessionMiddleware = function(req, res, next) {
	const now = Date.now();

	// Constants in milliseconds
	const TOUCH_AFTER_TIME = 60 * 4 * 1000; // 4min
	const MAX_AGE = 3600 * 1000; // 1hr

	if (!req.session) {
		return next();
	}

	try {
		if (!req.session.createdAt) {
			// Initialize new session
			req.session.createdAt = now;
			req.session.lastAccess = now;
			return next();
		}

		// Check maxAge expiration
		if (now - req.session.createdAt > MAX_AGE) {
			return destroySession(req)
				.then(() => {
					res.clearCookie('connect.sid'); // Clear session cookie
					next();
				})
				.catch(next);
		}

		// Check for inactivity
		if (now - req.session.lastAccess > TOUCH_AFTER_TIME) {
			return destroySession(req)
				.then(() => {
					res.clearCookie('connect.sid'); // Clear session cookie
					next();
				})
				.catch(next);
		}

		// Update last access time
		req.session.lastAccess = now;
		next();

	} catch (error) {
		next(error);
	}
};

// Utility function to safely save session changes
module.exports.saveSession = async function(req) {
	return new Promise((resolve, reject) => {
		req.session.save((error) => {
			if (error) {
				console.error('Session save error:', error);
				reject(error);
			}
			resolve();
		});
	});
};

// Utility function to destroy session
module.exports.destroySession = async function(req) {
	return new Promise((resolve, reject) => {
		req.session.destroy((error) => {
			if (error) {
				console.error('Session destruction error:', error);
				reject(error);
			}
			resolve();
		});
	});
};




// Middleware to validate user authentication and verification
module.exports.requireAuth = function(req, res, next) {
	try {
		const user = req.session?.user;

		if (user) {
			const { isVerified, userId } = user;

			if (!userId) {
				return sendJsonResponse(res, 401, false, 'User is not authenticated');
			}

			if (!isVerified) {
				return sendJsonResponse(res, 403, false, 'User email is not verified');
			}

			// Proceed to the next middleware or route handler
			next();
		} else {
			// No session found, return 401 Unauthorized
			return sendJsonResponse(res, 401, false, 'User is not logged in');
		}
	} catch (error) {
		console.error("Error validating user", error);
		//return res.status(500).json({ message: "Internal Server Error Occurred" });
		next(error)
	}
}


