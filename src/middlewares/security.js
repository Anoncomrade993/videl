/**
 * 
 * Checkmate XSS,SQLI trials
 * OTHERS
 * 
 * @Author - MockingBugs
 */
require('dotenv').config();
const rateLimit = require('express-rate-limiter')
const { sendJsonResponse } = require('../utility/helpers.js')
const { logAuditAction } = require('./audit.js')

// Function to detect potential attacks
function detectPotentialAttack(req) {
	// Check for SQL injection attempts
	const sqlInjectionPattern = /(\%27)|(\')|(\-\-)|(\%23)|(#)/i;
	if (sqlInjectionPattern.test(req.path) || sqlInjectionPattern.test(JSON.stringify(req.body))) {
		return { attack: true, name: 'SQli Attack' }
	}

	// Check for XSS attempts
	const xssPattern = /((\%3C)|<)((\%2F)|\/)*[a-z0-9\%]+((\%3E)|>)/i;
	if (xssPattern.test(req.path) || xssPattern.test(JSON.stringify(req.body))) {
		return { attacked: true, name: 'XSS Attack' }
	}

	// Check for path traversal attempts
	const pathTraversalPattern = /\.\.\//;
	if (pathTraversalPattern.test(req.path)) {
		return { attacked: true, name: 'Path Treversal Attack' }
	}

	return { attacked: false, name: null }

};









module.exports.attackMiddleware = async function(req, res, next) {
	const ip = req.ip;

	const { attacked, name } = detectPotentialAttack(req);
	// Check for potential attacks

	if (attacked) {
		await logAuditAction('Attacker', req.path, ip, req.get('User-Agent'), true, {
			message: `Tried 😂😂😂 ${name}`,
			timestamp: new Date().toDateString()
		})
		return sendJsonResponse(res, 403, false, 'Access denied DickHead !!!');
	}
	next();
};



module.exports.tokenRequestLimiter = () => {
	return rateLimit({
		windowMs: 10 * 60 * 1000, //10min cool down 
		max: 15, // max numbers of request 
		message: 'Too many token requests, please try again later',
		standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
		legacyHeaders: false, // Disable the `X-RateLimit-*` headers
		handler: (req, res) => {
			res.status(429).json({
				error: 'Too many requests, please try again later',
				blockedAt: new Date().toISOString()
			});
		}
	});
};