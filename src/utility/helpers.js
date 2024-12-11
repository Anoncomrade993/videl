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


module.exports = {
	generate,
	sendJsonResponse
}