const mongoose = require('mongoose');


const apiAuditSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.Mixed,
		index: true,
		default: null
	},
	action: {
		type: String,
		required: true,
	},
	date: {
		type: String,
		default: () => new Date().toISOString()
	},
	ipAddress: {
		type: String,
		required: true,
	},
	userAgent: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		enum: ['success', 'failure'],
		required: true,
	},
	details: {
		type: Schema.Types.Mixed,
		default: {},
	},
}, {
	timestamps: true,
});

// Indexes for efficient querying
apiAuditSchema.index({ userId: 1, action: 1, createdAt: -1 });

apiAuditSchema.statics.logAction = async function(logData = {}) {
	return await this.create(logData);
};

apiAuditSchema.statics.getUserLogs = async function(userId = '', limit = 50, skip = 0) {
	return this.find({ userId })
		.sort({ createdAt: -1 })
		.limit(limit)
		.skip(skip);
};

module.exports = mongoose.model('Audit', apiAuditSchema);