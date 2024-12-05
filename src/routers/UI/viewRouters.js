const express = require('express');
const { requireAuthUI, renderView, handleErrorView } = require('./utils.js');

const uiRouter = express.Router();

uiRouter.get('/welcome', renderView('landing'));
uiRouter.get('/register', renderView('register'));
uiRouter.get('/signin', renderView('signin'));
uiRouter.get('/forgotten-password', renderView('forgotten-password'));

uiRouter.get('/terms', renderView('terms'));
uiRouter.get('/policy', renderView('policy'));

uiRouter.get('/', (req, res) => {
	if (req.session?.user) {
		return res.send(`
            <!DOCTYPE html>
            <html>
            <head>
            <meta http-equiv="refresh" content="3;url=/dashboard">
            <title>Redirecting...</title></head>
            <body></body>
  </html> `);
	}
	renderView('landing')(req, res);
});

uiRouter.get('/dashboard', requireAuthUI, renderView('dashboard'));
uiRouter.get('/change-password', requireAuthUI, renderView('change-password'));
uiRouter.get('/email-verification', requireAuthUI, renderView('email-verification'));
uiRouter.get('/cancel-delete-schedule', renderView('cancel-delete-schedule'));

uiRouter.get('/l/:linkId', renderView('link-detail'));
uiRouter.get('/l/:linkId/captures', requireAuthUI, renderView('link-captures'));
uiRouter.get('/l/:linkId/captures/:captureId', requireAuthUI, renderView('capture-detail'));

uiRouter.use((err, req, res, next) => {
	console.error('Unhandled Error:', err);

	const isApiRequest = req.xhr || req.accepts('json');

	const logError = async () => {
		try {
			await logAuditAction(
				req.session?.user?.userId || null,
				req.path,
				req.ip,
				req.get('User-Agent'),
				'error',
				{
					error: err.message,
					stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
				}
			);
		} catch (logError) {
			console.error('Error logging failed', logError);
		}
	};

	logError();

	if (isApiRequest) {
		return res.status(err.status || 500).json({
			status: 'error',
			message: err.message || 'An unexpected error occurred'
		});
	}

	handleErrorView(err, req, res);
});

module.exports = uiRouter;