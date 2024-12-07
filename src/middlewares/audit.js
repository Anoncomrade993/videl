const AuditLog = require('../models/Audit.js');

const auditMiddleware = async function(req, res, next) {
	const originalJson = res.json;

	res.json = function(data) {
		const logData = {
			logId: (req.session && req.session.user && req.session.user.userId) || null,
			action: req.path,
			ipAddress: req.ip,
			userAgent: req.get('User-Agent'),
			status: res.statusCode < 400 ? 'success' : 'failure',
			details: { responseData: data }
		};

		AuditLog.logAction(logData).catch(error => {
			console.error('Error logging audit action:', error);
		});

		originalJson.call(this, data);
	};

	next();
};


// Utility function for logging Student actions
const logAuditAction = async function(userId, action, ipAddress, userAgent, status, details) {
	try {
		await AuditLog.logAction({
			userId: userId || null,
			action,
			ipAddress,
			userAgent,
			status,
			details
		});
	} catch (error) {
		console.error('Error logging audit action:', error);
	}
};



function getErrorMessage(statusCode) {
	switch (statusCode) {
		case 400:
			return "Bad Request: The server could not understand the request.";
		case 401:
			return "Unauthorized: Access is denied due to invalid credentials.";
		case 403:
			return "Forbidden: You do not have permission to access this resource.";
		case 404:
			return "Not Found: The requested resource could not be found.";
		case 500:
			return "Internal Server Error: Something went wrong on the server.";
		default:
			return 'An unexpected error occurred.';
	}
}




module.exports = {
	auditMiddleware,
	getErrorMessage,
	logAuditAction
};