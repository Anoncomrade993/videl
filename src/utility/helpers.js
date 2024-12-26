require('dotenv').config()

function generateRandomString(length = 0, charset = '') {
	return Array.from({ length }, () => charset.charAt(Math.floor(Math.random() * charset.length))).join('');
}

function generate(long = 8) {
	return generateRandomString(long, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
}


function sendJsonResponse(res, status, success, message, data) {
	const response = {
		status,
		success,
		message,
	};
	if (data) response.data = data;

	return res.status(status).json(response);
}

const constructLink = function(kaf, hashed, endpoint) {
	if (kaf) return `${process.env.BASE_URL}/auth/${endpoint}/${hashed}?kaf=${kaf}`
	return `process.env.BASE_URL}/auth/${endpoint}/${hashed}`
}


module.exports = {
	generate,
	sendJsonResponse,
	constructLink
}