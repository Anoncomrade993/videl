const Newsletter = require('../models/Newsletter.js')

const { sendJsonResponse, } = require('../utility/helpers.js')
const { EMAIL_REGEX } = require('../constants.js')



module.exports.suscriberNewsletter = async function(req, res) {
	try {
		const email = req.body.email;
		if (!email) {
			return sendJsonResponse(res, 400, false, 'Provide email to subscribe')
		}
		if (!EMAIL_REGEX.test(email.trim().toLowerCase())) {
			return sendJsonResponse(res, 400, false, 'Invalid email address')
		}
		const exists = await Newsletter.exists({ email });
		if (exists) {
			return sendJsonResponse(res, 400, false, 'Email already subscribed')
		}
		const subscribe = await Newsletter.suscriberEmail(email.trim().toLowerCase())
		if (!subscribe) {
			return sendJsonResponse(res, 500, false, 'Error occurred try again')
		}
		return sendJsonResponse(res, 200, true, 'email subscribed successfully')
	} catch (error) {
		console.error('Error subscribing to Newsletter')
		return sendJsonResponse(res, 500, false, 'Internal server error occurred')
	}
}


module.exports.unSuscriberNewsletter = async function(req, res) {
	try {
		const email = req.body.email;
		if (!email) {
			return sendJsonResponse(res, 400, false, 'Provide email to subscribe')
		}
		if (!EMAIL_REGEX.test(email.trim().toLowerCase())) {
			return sendJsonResponse(res, 400, false, 'Invalid email address')
		}
		const exists = await Newsletter.exists({ email });
		if (!exists) {
			return sendJsonResponse(res, 400, false, 'Email not subscribed')
		}
		const { success, status, message } = await Newsletter.unSuscriberEmail(email.trim().toLowerCase())
		if (!success) {
			return sendJsonResponse(res, status, success, message)
		}
		return sendJsonResponse(res, 200, true, 'email unsubscribed successfully')
	} catch (error) {
		console.error('Error unsubscribing to Newsletter')
		return sendJsonResponse(res, 500, false, 'Internal server error occurred')
	}
}