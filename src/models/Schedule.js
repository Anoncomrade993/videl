//this schedule module handles account deletion process only 
//might fancy another idea later 

const mongoose = require('mongoose');
const


const scheduleSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
	status: {
		type: String,
		default: 'pending',
		enum: ['pending', 'cancelled', 'completed']
	},
	deadlineAt: {
		type: Date,
		required: true,
		immutable: true
	}
}, { timestamps: true })


scheduleSchema.index({ user: 1 })
scheduleSchema.index({ createdAt: 1 })



scheduleSchema.statics.createSchedule = async function(user) {
	try {

		if (!user) return;
		const now = Date.now()
		const deadlineAt = new Date(now + (14 * 24 * 3600 * 1000))
		const created = await this.create({ user, deadlineAt });
		if (!created) {
			return { success: false, status: 500, message: "error creating schedule" }
		}
		return { success: true, status: 201, message: "created schedule" }
	} catch (error) {
		console.error('DB:Error creating Schedule')
		return { success: false, status: 500, message: "Error creating schedule" }
	}
}

scheduleSchema.statics.cancelSchedule = async function(user) {
	const isSchedule = await this.findOne({ user, status: 'pending' });

	if (!isSchedule) {
		return { success: false }
	} else {
		isSchedule.status = 'cancelled';
		await isSchedule.save();
		return { success: true };
	}
}
module.exports = mongoose.model('Schedule', schedule)