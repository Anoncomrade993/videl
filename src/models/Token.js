const mongoose = require('mongoose');
const { verifyToken, hashToken } = require('../services/Scrypt.js');
const { generate } = require('../utility/helpers.js');

const tokenSchema = new mongoose.Schema({
	email: { type: String, required: true, immutable: true },
	hashed: { type: String, required: true, unique: true, immutable: true },
	purpose: {
		type: String,
		required: true,
		enum: ['verifyEmail', 'changeEmail', 'forgotPassword', 'changePassword', 'deleteUser']
	},
	isUsed: { type: Boolean, default: false }
}, { timestamps: true });

tokenSchema.index({ createdAt: 1 }, { expiresAfterSeconds: 300 });

tokenSchema.statics.generateToken = async function({ email, purpose }, length = 16, expirationDuration = 300000) {
	try {

		await this.deleteMany({ email, isUsed: false, purpose });
		if (!email || !purpose) return { success: false, message: "Missing parameters", plain: null, hashed: null };

		const plain = generate(length);
		const hashed = await hashToken(plain);

		const expiresAt = new Date(Date.now() + expirationDuration);

		const token = await this.create({
			email,
			purpose,
			hashed,
			expiresAt
		});
		if (!token) return { success: false, message: "Error creating Token", plain: null, hashed: null };
		return { success: true, message: "Token created successfully", plain, hashed: token.hashed };
	} catch (error) {
		console.error('Error generating Token ', error);
		return { success: false, message: "Internal Error Occurred", plain: null, hashed: null };
	}
};

tokenSchema.statics.generateShortLivedToken = async function(email, purpose, length = 8) {
	return await this.generateToken(email, purpose, length, 5 * 60 * 1000);
};

tokenSchema.statics.generateLongLivedToken = async function(email, purpose, length = 8) {
	return await this.generateToken(email, purpose, length, 14 * 24 * 60 * 60 * 1000);
};

tokenSchema.statics.verifyToken = async function(token, purpose) {
	try {
		if (!token || !purpose) {
			return { success: false, status: 400, message: "Missing parameters" };
		}

		const tokenDoc = await this.findOne({
			hashed: token,
			isUsed: false,
			purpose
		});

		if (!tokenDoc) {
			return { success: false, status: 404, message: "Invalid or expired token" };
		}


		/** 
		 * since hashed token is used,no need for matching again 
 		
				const isValid = await verifyToken(token, tokenDoc.hashed);

				if (!isValid) {
					return { success: false, status: 400, message: "Invalid token" };
				}
		**/
		tokenDoc.isUsed = true;
		await tokenDoc.save();

		return {
			success: true,
			status: 200,
			message: "Token verified successfully",
			email: tokenDoc.email
		};
	} catch (error) {
		console.error('Error verifying token:', error);
		return { success: false, status: 500, message: "Internal error occurred" };
	}
};



module.exports = mongoose.model('Token', tokenSchema);