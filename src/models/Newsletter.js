const mongoose = require('mongoose')

const newsletterSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true }
}, { timestamps: true })

newsletterSchema.statics.suscribeEmail = async function(email = '') {
	try {
		const subscriber = await this.create({ email });
		if (!subscriber) return false
		return true
	} catch (error) {
		console.error('Error suscribing User', error)
		return false
	}
}

newsletterSchema.statics.unSuscribeEmail = async function(email = '') {
	try {
		const subscriber = await this.deleteOne({ email });
		if (!subscriber) return { success: false, status: 404, message: 'error cancelling subscription' }
		return { success: false, status: 200, message: 'subscription cancelled successfully' }
	} catch (error) {
		console.error('Error suscribing User', error)
		return { success: false, status: 500, message: 'Error occurred,try again' }
	}
}


module.exports = mongoose.model('Newsletter', newsletterSchema)