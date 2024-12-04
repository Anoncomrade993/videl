function generateRandomString(length = 0, charset = '') {
	return Array.from({ length }, () => charset.charAt(Math.floor(Math.random() * charset.length))).join('');
}

function generate(long = 4) {
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

function renderUi(path = '', data = {}) {
	return function(req, res) {
		return res.render(path, { data })
	}
}
module.exports = {
	generate,
	sendJsonResponse,
	renderUi
}