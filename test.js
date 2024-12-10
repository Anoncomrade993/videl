var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'anoncomrade993@gmail.com',
		pass: 'ecwsijxushvsrity'
	}
});

var mailOptions = {
	from: 'anoncomrade993@gmail.com',
	to: 'mockingbugslabs@proton.me',
	subject: 'Sending Email using Node.js',
	text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info) {
	if (error) {
		console.log(error);
	} else {
		console.log('Email sent: ' + info.response);
	}
});
