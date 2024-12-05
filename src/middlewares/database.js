const { deleteAllFilesByUserId } = require('../services/FireBase.js');
const { sendJsonResponse } = require('../utility/helpers.js');
const Schedule = require('../models/Schedule.js');
const User = require('../models/User.js');
const Link = require('../models/Link.js');
const Capture = require('../models/Capture.js');



// Cron job function to update completed schedules
async function updateScheduleStatus() {
	try {
		const currentTime = Date.now();
		const result = await Schedule.updateMany({
			status: 'pending',
			completeAt: { $lt: currentTime }
		}, { $set: { status: 'completed' } });

		console.log(`${result.modifiedCount} schedules updated to completed.`);
	} catch (e) {
		console.error('Error updating schedules:', e);
	}
}

async function deleteCancelledSchedules() {
	try {
		const result = await Schedule.deleteMany({ status: 'cancelled' });
		console.log(`${result.deletedCount} cancelled schedules deleted.`);
	} catch (e) {
		console.error('Error deleting cancelled schedules:', e);
	}
}

async function cleanUpDatabaseSchedule() {
	try {
		const userIds = await getUserIdsFromCompletedSchedules();
		if (userIds.length > 0) {
			await Promise.all([
                deleteUsers(userIds),
                deleteLinks(userIds),
                deleteAllFilesByUserId(userIds),
                deleteCaptures()
            ]);
		} else {
			console.log('No students to delete.');
		}
	} catch (error) {
		console.error('Error during database cleanup:', error);
	}
}

async function getUserIdsFromCompletedSchedules() {
	const completedSchedules = await Schedule.find({ status: 'completed' }).select('user');
	return completedSchedules.map(schedule => schedule.user).filter(Boolean);
}

async function deleteUsers(userIds) {
	try {
		const result = await User.deleteMany({ _id: { $in: userIds } });
		console.log(`${result.deletedCount} users deleted.`);
	} catch (error) {
		console.error('Error deleting users:', error);
	}
}

async function deleteLinks(userIds) {
	try {
		const result = await Link.deleteMany({ user: { $in: userIds } });
		console.log(`${result.deletedCount} links deleted.`);
	} catch (error) {
		console.error('Error deleting links:', error);
	}
}

async function deleteCaptures() {
	try {
		const now = Date.now();
		const expiration = new Date(now - (24 * 3600 * 1000)); // 24 hours ago

		// Delete captures older than 24 hours
		const result = await Capture.deleteMany({ createdAt: { $lt: expiration } });
		console.log(`${result.deletedCount} captures deleted.`);
	} catch (error) {
		console.error('Error deleting captures:', error);
	}
}

module.exports = {
	deleteCancelledSchedules,
	cleanUpDatabaseSchedule,
	updateScheduleStatus,
};