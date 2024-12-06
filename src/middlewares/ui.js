/**
 * @author : MockinBugs 
 * 
 * 
 */


async function requireAuthUI(req, res, next) {
	try {
		const user = req.session?.user;

		if (!user) {
			return res.status(302).redirect('/signin');
		}

		const { isVerified, userId, email, lastAccess, lastLogin, username } = user;

		if (!userId) {
			return res.status(302).redirect('/signin');
		}

		if (!isVerified) {
			return res.status(302).redirect('/email-verification');
		}

		next();
	} catch (error) {
		console.error("UI Authentication Middleware Error", error);
		res.status(302).redirect('/signin');
	}
}

function renderView(path = '', additionalData = {}) {
	return (req, res) => {
		try {
			const viewData = {
				...additionalData,
				user: req.session?.user || null
			};

			res.render(path, { data: viewData });
		} catch (error) {
			console.error(`Error rendering view ${path}:`, error);
			res.status(500).render('error', {
				data: {
					message: 'Failed to render view',
					error: process.env.NODE_ENV !== 'production' ? error : undefined
				}
			});
		}
	};
}

function handleErrorView(err, req, res) {
	const statusCode = err.status || 500;

	res.status(statusCode).render('error', {
		data: {
			status: statusCode,
			message: err.userMessage || 'An unexpected error occurred',
			error: process.env.NODE_ENV !== 'production' ? err : null
		}
	});
}


module.exports = {
	requireAuthUI,
	handleErrorView,
	renderView,
	
}