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


// Error handler with auditing
const errorHandler = async function(err, req, res, next) {
	await logAuditAction(
		req.session?.user?.userId || "",
		req.path,
		req.ip,
		req.get('User-Agent'),
		'failure', { error: err.message, stack: err.stack }
	);

	res.status(500).json({ error: 'An unexpected error occurred' });
	next();
};

module.exports = {
	auditMiddleware,
	errorHandler,
	logAuditAction
};