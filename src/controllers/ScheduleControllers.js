const { deleteCancelledSchedules, cleanUpDatabaseSchedule, updateScheduleStatus } = require("../middlewares/database.js");
const { sendJsonResponse } = require('../utility/helpers.js')

module.exports.scheduler = async function(req, res) {
	try {
		await Promise.all([
      deleteCancelledSchedules(),
      cleanUpDatabaseSchedule(),
      updateScheduleStatus(),
    ]);
		return sendJsonResponse(res, 200, true, 'Schedule handler operation done..🚀')
	} catch (error) {
		console.error('Error in scheduler:', error);
		return sendJsonResponse(res, 500, false, 'Internal server error occurred')
	}
}