const mongoose = require('mongoose');
const { generate } = require('../utility/helpers.js')
//videl
// vdl => sigil letters 
//19 + 13 = 32/2 = 16 letter length 

const linkSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	captures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Captures' }],
	linkId: { type: String, required: true, unique: true, immutable: true },
	isSuspended: { type: Boolean, default: false }
}, { timestamps: true });

// Index on the createdAt for faster lookups with 24-hour expiration
linkSchema.index({ createdAt: 1 }, { expiresAfterSeconds: 24 * 3600 });

// Create indexes to improve query performance
linkSchema.index({ linkId: 1 });
linkSchema.index({ user: 1 });
linkSchema.index({ captures: 1 });

// Virtual to get capture count
linkSchema.virtual('captureCount').get(function() {
	return this.captures ? this.captures.length : 'No captures';
});

linkSchema.statics.createLink = async function(user) {
	try {
		if (!user) {
			return { success: falses, status: 400, message: "missing fields", link: null }
		}
		const linkId = generate(16);
		const link = await this.create({ user, linkId });
		if (!link) {
			return { success: false, status: 500, message: _, link: null }
		}
		return { success: true, statu: 201, message: 'created', link }
	} catch (error) {
		console.error('Error creating link', error)
		return { success: false, status: 500, message: "error occurred", link: null }
	}
}

linkSchema.statics.suspendLink = async function(linkId = '') {
	try {
		const link = this.findOne({ linkId });
		if (!link) {
			return { success: false, message: "link not found", isSuspended: false }
		}
		link.isSuspended = true;
		await link.save()
		return { success: true, message: "link suspended", isSuspended: true }
	} catch (e) {
		return { success: false, message: 'error occurred', isSuspended: false }
	}
}

// Static method to retrieve all captures for a link
linkSchema.statics.getCaptures = async function(linkId) {
	try {
		// Find the link and populate captures
		const link = await this.findOne({ linkId })
			.populate({
				path: 'captures',
				model: 'Captures', //Capture model name
				options: {
					sort: { createdAt: -1 }, // Sort by most recent first
					limit: 50 // Limit to prevent overwhelming results
				}
			});

		if (!link) {
			throw new Error('Link not found');
		}

		return {
			link: link,
			captures: link.captures,
			captureCount: link.captureCount
		};
	} catch (e) {
		console.error('Error retrieving captures:', e);
		throw e;
	}
};

// Static method to retrieve a specific capture
linkSchema.statics.getCapture = async function(linkId, captureId) {
	try {
		// Find the link and verify the capture belongs to this link
		const link = await this.findOne({
			linkId,
			captures: mongoose.Types.ObjectId(captureId)
		}).populate({
			path: 'captures',
			match: { _id: mongoose.Types.ObjectId(captureId) },
			model: 'Captures'
		});

		if (!link) {
			throw new Error('Capture not found or does not belong to this link');
		}

		return {
			link: link,
			capture: link.captures[0] // Will be the specific capture
		};
	} catch (e) {
		console.error('Error retrieving specific capture:', e);
		throw e;
	}
};

// Optional: Method to add a new capture to the link
linkSchema.methods.addCapture = async function(captureId) {
	try {
		// Prevent duplicate captures
		if (!this.captures.includes(captureId)) {
			this.captures.push(captureId);
			await this.save();
		}
		return this;
	} catch (e) {
		console.error('Error adding capture:', e);
		throw e;
	}
};

module.exports = mongoose.model('Link', linkSchema);