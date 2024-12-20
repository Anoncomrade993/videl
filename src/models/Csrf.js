const mongoose = require('mongoose');
const crypto = require('crypto');

const csrfSchema = new mongoose.Schema({
	token: {
		type: String,
		required: true,
		unique: true
	},
	purpose: {
		type: String,
		required: true,
		enum: [
            'verifyEmail',
            'changeEmail',
            'changePassword',
            'forgotPassword',
            'deleteUser',
            'github'
        ]
	},
	email: {
		type: String,
		required: true,
		lowercase: true,
		trim: true
	},
	used: {
		type: Boolean,
		default: false
	}
}, {
	timestamps: true
});

csrfSchema.statics.generateToken = function(email, purpose) {
	const token = crypto.randomBytes(32).toString('hex');
	return this.create({ token, email, purpose, used: false });
};

csrfSchema.statics.verifyToken = async function(token, purpose) {
	const csrfToken = await this.findOne({
		token,
		purpose,
		used: false
	});

	if (!csrfToken) {
		throw new Error('Invalid or expired token');
	}

	csrfToken.used = true;
	await csrfToken.save();

	return csrfToken;
};

csrfSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

module.exports = mongoose.model('Csrf', csrfSchema);