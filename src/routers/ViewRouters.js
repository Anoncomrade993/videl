const express = require('express');
const { requireAuthUI, renderView, handleErrorView } = require('../middlewares/ui.js');
const { logAuditAction } = require('../middlewares/audit.js')
const uiRouter = express.Router();

uiRouter.get('/', (req, res) => {
	if (req.session?.user && req.session?.user.isVerified) {
		return res.send(`
            <!DOCTYPE html>
            <html>
            <head>
            <meta http-equiv="refresh" content="3;url=/dashboard">
            <title>redirecting...</title></head>
            <body></body>
  </html> `);
	}
	renderView('Landing.html')(req, res);
});



uiRouter.get('/welcome', renderView('Landing.html'));
uiRouter.get('/register', renderView('register.html'));
uiRouter.get('/signin', renderView('login.html'));
uiRouter.get('/forgotten-password', renderView('forgotten.html'));

uiRouter.get('/terms', renderView('terms.html'));
uiRouter.get('/policy', renderView('policy.html'));

uiRouter.get('/dashboard', requireAuthUI, async function(req, res) {
	try {
		const user = req.session?.user;

		if (!user || !user.isVerified) {
			const error = new Error('User not authenticated')
			error.status = 401;
			throw error
		}
		const { username, avatar, isAuthWithGitSigned = false } = user
		return res.render('dashboard.html', { username, avatar, isAuthWithGitSigned })
	} catch (error) {
		console.error('Error rendering dashboard', error)
		return res.render('500.html')
	}
});

uiRouter.get('/change-password', requireAuthUI, renderView('change-password.html'));
uiRouter.get('/verification', renderView('verification.html'));

/*
uiRouter.get('/cancel-delete-schedule', renderView('cancel-delete-schedule.html'));
uiRouter.get('/l/:linkId', renderView('link-detail.html'));
uiRouter.get('/l/:linkId/captures', requireAuthUI, renderView('link-captures.html'));
uiRouter.get('/l/:linkId/captures/:captureId', requireAuthUI, renderView('capture-detail'));
*/
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