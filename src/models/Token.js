const mongoose = require('mongoose');
const { verifyToken, hashToken } = require('../services/Scrypt.js');
const { generate } = require('../utility/helpers.js');



const tokenSchema = new mongoose.Schema({
	email: { type: String, required: true, immutable: true },
	hashed: { type: String, required: true },
	purpose: {
		type: String,
		required: true,
		enum: ['verifyEmail', 'changeEmail', 'forgotPassword', 'changePassword', 'deleteUser']
	},
	isUsed: { type: Boolean, default: false }
}, { timestamps: true });

tokenSchema.index({ createdAt: 1 }, { expiresAfterSeconds: 300 });

tokenSchema.statics.generateToken = async function(data = {}) {
	try {
		await this.deleteMany({ email: data.email, isUsed: false, purpose: data.purpose });
		if (!data || Object.keys(data).length === 0) return { success: false, message: "Missing parameters", plain: null };

		const plain = generate();
		const hashed = await hashToken(plain);

		const token = await this.create({
			...data,
			hashed
		});
		if (!token) return { success: false, message: "Error creating Token", plain: null };
		return { success: true, message: "Token created successfully", plain };
	} catch (error) {
		console.error('Error generating Token ', error);
		return { success: false, message: "Internal Error Occurred", plain: null };
	}
};



//for API specifically 
tokenSchema.statics.VerifyToken = async function(data = {}) {
	try {
		const { email, token, purpose } = data;

		if (!email || !token || !purpose) {
			return { success: false, status: 400, message: "Missing parameters" };
		}

		const tokenDoc = await this.findOne({
			email,
			purpose,
			isUsed: false
		});

		if (!tokenDoc) {
			return { success: false, status: 404, message: "Invalid or expired token" };
		}

		const isValid = await verifyToken(token, tokenDoc.hashed);

		if (!isValid) {
			return { success: false, status: 400, message: "Invalid token" };
		}

		// Mark token as used

		await this.findByIdAndUpdate(tokenDoc._id, { isUsed: true });

		return {
			success: true,
			status: 200,
			message: "Token verified successfully",
		};
	} catch (error) {
		console.error('Error verifying token:', error);
		return { success: false, status: 500, message: "Internal error occurred" };
	}
};

module.exports = mongoose.model('Token', tokenSchema);