const mongoose = require('mongoose');


const siteSchema = new mongoose.Schema({
	name: { type: String, required: true, unique: true },
	version: { type: String, required: true, default: '0.0.1' },
	siteId: { type: String, required: true, unique: true },
	status: {
		type: String,
		default: 'active',
		enum: ['active', 'maintenance', 'suspended']
	},
	tier: {
		type: String,
		required: true,
		enum: ['free', 'pro', 'business']
	},
	template: {
		templateId: { type: String, required: true },
		source: { type: String, enum: ['local', 'import'] },
		html: { type: String, required: true },
		styles: { type: String, required: true },
		scripts: [{ type: String }],
		assets: [{ type: String }]
	},
	analytics: {
		views: { type: Number, default: 0 },
		likes: { type: Number, default: 0 },
		uptime: { type: Number },
	}
}, { timestamps: true });

// Static Methods
siteSchema.statics.createSite = async function(data = {}) {
	try {
		if (!data || Object.keys(data).length === 0) {
			return {
				status: 400,
				success: false,
				message: 'Template data must not be empty'
			};
		}
		const site = await this.create(data);
		return {
			status: 201,
			success: true,
			data: site
		};
	} catch (e) {
		return {
			status: 500,
			success: false,
			message: e.message
		};
	}
}

siteSchema.statics.updateSite = async function(siteId, updateData) {
	try {
		const site = await this.findOneAndUpdate({ siteId }, updateData, { new: true });
		if (!site) {
			return { status: 404, success: false, message: 'Site not found' };
		}
		return { status: 200, success: true, data: site };
	} catch (e) {
		return { status: 500, success: false, message: e.message };
	}
}

siteSchema.statics.disableSite = async function(siteId) {
	try {
		const site = await this.findOneAndUpdate({ siteId }, { status: 'suspended' }, { new: true });
		if (!site) {
			return { status: 404, success: false, message: 'Site not found' };
		}
		return { status: 200, success: true, data: site };
	} catch (e) {
		return { status: 500, success: false, message: e.message };
	}
}

siteSchema.statics.deleteSite = async function(siteId) {
	try {
		const result = await this.deleteOne({ siteId });
		if (result.deletedCount === 0) {
			return { status: 404, success: false, message: 'Site not found' };
		}
		return { status: 200, success: true, message: 'Site deleted successfully' };
	} catch (e) {
		return { status: 500, success: false, message: e.message };
	}
}

// Instance Methods
siteSchema.methods.isSuspended = function() {
	return this.status === 'suspended';
}

siteSchema.methods.isDisabled = function() {
	return this.status === 'suspended' || this.status === 'maintenance';
}

siteSchema.methods.suspendSite = async function() {
	this.status = 'suspended';
	await this.save();
	return { status: 200, success: true, message: 'Site suspended successfully' };
}

module.exports = mongoose.model('Site', siteSchema);