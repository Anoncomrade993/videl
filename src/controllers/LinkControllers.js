const User = require('../models/User.js')
const Link = require('../models/Link.js')
const Capture = require('../models/Capture.js')
const Template = require('../models/Template.js')
const { uploadCaptureFile } = require('../services/FireBase.js')
const { sendJsonResponse } = require('../utility/helpers.js')


module.exports.generateLink = async function(req, res) {
	try {
		const user = req.session.user;
		if (!user || Object.keys(user).length === 0) {
			return sendJsonResponse(res, 401, false, 'You are not authenticated')
		}
		const { templateId } = req.body;

		if (!templateId.trim()) {
			return sendJsonResponse(res, 400, false, 'provide a valid template ID')
		}
		
		const isUser = await User.findById(user.userId);
		if (!isUser) {
			return sendJsonResponse(res, 404, false, 'User not found')
		}


		const { success, status, message, link } = await Link.createLink(user.userId,templateId);
		if (!success) {
			return sendJsonResponse(res, status, success, message);
		}

		isUser.links.push(link._id);
		await isUser.save();
		return sendJsonResponse(res, 201, true, 'link generated successfully', { link: link.linkId })
	} catch (error) {
		return sendJsonResponse(res, 500, false, 'Internal server error occurred')
	}
}


module.exports.captureDummy = async function(req, res) {
	try {
		const user = req.session.user;
		const { linkId } = req.params;

		if (!user || Object.keys(user).length === 0) {
			return sendJsonResponse(res, 401, false, 'You are not authenticated')
		}

		if (!linkId || !linkId.trim()) {
			return sendJsonResponse(res, 400, false, 'invalid url')
		}
		const data = req.body;


		// Validate input data
		if (!data || Object.keys(data).length === 0) {
			return sendJsonResponse(res, 400, false, 'Missing capture data')
		}

		const link = await Link.findOne({ linkId });
		if (!link) {
			return sendJsonResponse(res, 404, false, 'data not found or deleted')
		}
		let captureId = generate(8)
		const holder = {};

		// Handle file upload if it exists
		if (req.file) {
			const { buffer, mimetype, size } = req.file;
			const customMetadata = { userId: user.userId, linkId, captureId, mimetype, size };
			const filename = `${linkId}_${originalname}`;
			try {
				holder.mediaUrl = await uploadCaptureFile(req.file, buffer, customMetadata, filename);
				holder.hasMedia = true;
			} catch (uploadError) {
				console.error('Error uploading post media', uploadError);
				return sendJsonResponse(res, 500, false, "Internal server error occurred");
			}
		}

		const capture = await Capture.create({
			...data,
			...holder,
			captureId
		});
		if (!capture) {
			return sendJsonResponse(res, 500, false, 'Error creating capture')
		}
		link.captures.push(capture._id);
		await link.save()
		return sendJsonResponse(res, 200, true, 'Capture saved successfully')
	} catch (error) {
		console.error('Error capturing mugu', error)
		return sendJsonResponse(res, 500, false, 'Internal server error occurred')
	}
}

module.exports.getCaptures = async function(req, res) {
	try {
		const { linkId } = req.params;
		const user = req.session.user;
		if (!user || Object.keys(user).length === 0) {
			return sendJsonResponse(res, 401, false, 'You are not authenticated')
		}
		if (!linkId) {
			return sendJsonResponse(res, 400, false, 'Missing link ID');
		}

		const result = await Link.getCaptures(linkId);
		return sendJsonResponse(res, 200, true, 'Captures retrieved', result);
	} catch (e) {
		console.error('Error retrieving captures', e);
		return sendJsonResponse(res, 500, false, 'Error retrieving captures');
	}
}

module.exports.getCapture = async function(req, res) {
	try {
		const { linkId, captureId } = req.params;
		const user = req.session.user;
		if (!user || Object.keys(user).length === 0) {
			return sendJsonResponse(res, 401, false, 'You are not authenticated')
		}
		if (!linkId || !captureId) {
			return sendJsonResponse(res, 400, false, 'Missing link or capture ID');
		}

		const result = await Link.getCapture(linkId, captureId);
		return sendJsonResponse(res, 200, true, 'Capture retrieved', result);
	} catch (e) {
		console.error('Error retrieving capture', e);
		return sendJsonResponse(res, 500, false, 'Error retrieving capture');
	}
}


module.exports.exportCaptures = async function(req, res) {
	try {
		// Validate user authentication
		const user = req.session.user;
		if (!user || Object.keys(user).length === 0) {
			return sendJsonResponse(res, 401, false, 'You are not authenticated');
		}

		// Get the linkId from request parameters
		const { linkId } = req.params;
		if (!linkId) {
			return sendJsonResponse(res, 400, false, 'Missing link ID');
		}

		// Retrieve link and its captures
		const linkWithCaptures = await Link.findOne({ linkId })
			.populate({
				path: 'captures',
				model: 'Capture',
				options: {
					sort: { createdAt: -1 } // Sort by most recent first
				}
			});

		if (!linkWithCaptures) {
			return sendJsonResponse(res, 404, false, 'Link not found');
		}

		// Check if user owns the link
		if (linkWithCaptures.user.toString() !== user.userId.toString()) {
			return sendJsonResponse(res, 403, false, 'Unauthorized to export these captures');
		}

		// Prepare export data
		const exportData = {
			linkId: linkWithCaptures.linkId,
			totalCaptures: linkWithCaptures.captures.length,
			captures: linkWithCaptures.captures.map(capture => ({
				captureId: capture.captureId,
				createdAt: capture.createdAt,
				computedHash: capture.computedHash,
				confidence: capture.confidence,
				rawFingerprint: capture.rawFingerprint
			}))
		};

		// Generate filename
		const timestamp = new Date().toISOString().replace(/[:\.]/g, '-');
		const filename = `captures_export_${linkId}_${timestamp}.json`;

		// Send file for download
		res.setHeader('Content-Type', 'application/json');
		res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
		res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

		return sendJsonResponse(res, 200, true, 'Captures exported successfully', {
			filename: filename,
			exportData: exportData
		});
	} catch (error) {
		console.error('Error exporting captures:', error);
		return sendJsonResponse(res, 500, false, 'Failed to export captures', error.message);
	}
};