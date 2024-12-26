require('dotenv').config();
const admin = require('firebase-admin');
const fs = require('fs').promises;
const path = require('path');


const serviceAccount = require('../config/serv.js');
const UPLOAD_STORAGE = process.env.UPLOAD_STORAGE;

// Initialize Firebase Admin
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	storageBucket: process.env.STORAGE_BUCKET
});

const bucket = admin.storage().bucket();;


module.exports.findTemplate = async function(templateId) {
	try {
		const [files] = await bucket.getFiles({
			prefix: `${UPLOAD_STORAGE}/${templateId}`
		});

		if (!files.length) {
			return null;
		}

		const fileUrls = await Promise.all(
			files.map(async (file) => {
				const [url] = await file.getSignedUrl({
					action: 'read',
					expires: Date.now() + (12 * 7 * 24 * 60 * 60 * 1000),
				});
				return {
					path: file.name,
					url,
					metadata: file.metadata?.metadata || {}
				};
			})
		);

		return fileUrls.length ? {
			templateId,
			files: fileUrls,
			metadata: filteredFiles[0].metadata?.metadata || {}
		} : null;
	} catch (error) {
		throw new Error(`Failed to find template: ${error.message}`);
	}
}

module.exports.uploadTemplate = async function(templatePath, templateId) {
	const files = {
		html: '/index.html',
		css: '/styles/style.css',
		js: '/scripts/main.js',
		assets: '/assets'
	};

	const uploadPromises = [];

	for (const [type, filePath] of Object.entries(files)) {
		if (type === 'assets') {
			const assets = fs.readdirSync(path.join(templatePath, 'assets'));
			for (const asset of assets) {
				const fileUpload = bucket.upload(
					path.join(templatePath, 'assets', asset),
					{
						destination: `${UPLOAD_STORAGE}/${templateId}/assets/${asset}`,
						public: true
					}
				);
				uploadPromises.push(fileUpload);
			}
		} else {
			const fileUpload = bucket.upload(
				path.join(templatePath, filePath),
				{
					destination: `${UPLOAD_STORAGE}/${templateId}${filePath}`,
					public: true
				}
			);
			uploadPromises.push(fileUpload);
		}
	}

	await Promise.all(uploadPromises);
	return templateId;
}



// Update template files
module.exports.updateTemplate = async function(templateId, templatePath) {
	// First delete existing files
	await deleteTemplate(templateId);

	const files = {
		html: '/index.html',
		css: '/styles/style.css',
		js: '/scripts/main.js',
		assets: '/assets'
	};

	const uploadPromises = [];

	for (const [type, filePath] of Object.entries(files)) {
		if (type === 'assets') {
			const assets = fs.readdirSync(path.join(templatePath, 'assets'));
			for (const asset of assets) {
				const fileUpload = bucket.upload(
					path.join(templatePath, 'assets', asset),
					{
						destination: `templates/${templateId}/assets/${asset}`,
						public: true
					}
				);
				uploadPromises.push(fileUpload);
			}
		} else {
			const fileUpload = bucket.upload(
				path.join(templatePath, filePath),
				{
					destination: `templates/${templateId}${filePath}`,
					public: true
				}
			);
			uploadPromises.push(fileUpload);
		}
	}

	await Promise.all(uploadPromises);
	return templateId;
}

// Delete template files
module.exports.deleteTemplate = async function(templateId) {
	const prefix = `templates/${templateId}/`;
	try {
		const [files] = await bucket.getFiles({ prefix });
		const deletePromises = files.map(file => file.delete());
		await Promise.all(deletePromises);
		return true;
	} catch (error) {
		console.error(`Error deleting template ${templateId}:`, error);
		throw error;
	}
}