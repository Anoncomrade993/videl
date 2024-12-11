const winston = require('winston');
const { createLogger, format, transports } = winston;

// Create a logger with multiple transports
const logger = createLogger({
	level: 'error',
	format: format.combine(
		format.timestamp({
			format: 'YYYY-MM-DD HH:mm:ss'
		}),
		format.errors({ stack: true }),
		format.splat(),
		format.json()
	),
	transports: [
        // Write all logs with level `error` and below to `error.log`
        new transports.File({ filename: 'logs/error.log' }),
        // Write to console for immediate visibility
        new transports.Console({
			format: format.combine(
				format.colorize(),
				format.simple()
			)
		})
    ]
});

// Import error page templates
const e404 = require('../shared/404.html.js');
const e403 = require('../shared/403.html.js');
const e500 = require('../shared/500.html.js');

// Error page mapping
const ERROR_PAGES = {
	403: e403,
	404: e404,
	500: e500
};

// Global error handling middleware
const globalErrorHandler = (err, req, res, next) => {
	// Determine the appropriate status code
	const statusCode = err.status || 500;
	const errorMessage = err.message || 'Unexpected Error';

	// Log the full error details
	logger.error(`Error in ${req.method} ${req.originalUrl}`, {
		method: req.method,
		url: req.originalUrl,
		body: req.body,
		query: req.query,
		params: req.params,
		statusCode,
		errorMessage,
		stack: err.stack
	});

	// Determine the appropriate error page
	const errorPage = ERROR_PAGES[statusCode] || ERROR_PAGES[500];

	// Respond based on the request type
	if (req.accepts('html')) {
		// If the client accepts HTML, send an HTML error page
		res.status(statusCode).send(errorPage);
	} else if (req.accepts('json')) {
		// If the client accepts JSON, send a JSON error response
		res.status(statusCode).json({
			error: {
				status: statusCode,
				message: errorMessage
			}
		});
	} else {
		// Fallback to plain text
		res.status(statusCode).type('text').send(errorMessage);
	}
};

// 404 handler for undefined routes
const notFoundHandler = (req, res, next) => {
	const error = new Error('Resource Not Found');
	error.status = 404;
	next(error);
};

module.exports = {
	globalErrorHandler,
	notFoundHandler
};

