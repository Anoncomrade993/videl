const mongoose = require('mongoose');

const Scrypt = require('../services/Scrypt.js')

const userSchema = new mongoose.Schema({
	username: String,
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		lowercase: true,
		validate: {
			validator: function(value) {
				return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
			},
			message: props => `${props.value} is not a valid email!`
		}
	},
	authProviders: {
		type: String,
		default: 'local',
		enum: ['github', 'local']
	},
	password: { type: String, required: true },
	avatar: { type: String, required: false },
	isVerified: { type: Boolean, default: false },
	onKillList: {
		type: Boolean,
		default: false
	},
	killDate: { type: Date, default: null },
	links: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Link' }]
}, { timestamps: true })

userSchema.index({ createdAt: 1 })
userSchema.index({ email: 1 })


userSchema.statics.createUser = async function(data = {}) {
	try {
		if (!data || Object.keys(data).length === 0) return { success: false, message: 'Missing data', user: null }
		data.password = await Scrypt.hashToken(data.password);
		const user = await this.create({ ...data });
		if (!user) return { success: false, message: 'Error creating user', user: null }
		return { success: true, message: 'created successfully', user }
	} catch (databaseError) {
		console.error('DB:Error creating User', databaseError)
		return { success: false, message: 'Internal Error Occurred', user: null }
	}
}
userSchema.methods.comparePassword = async function(password = '') {
	try {
		const isPassword = await Scrypt.verifyToken(password, this.password);
		return isPassword;
	} catch (error) {
		console.error('Error comparing password', error)
		throw error
	}
}



module.exports = mongoose.model('User', userSchema)