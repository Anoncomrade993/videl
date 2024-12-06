require('dotenv').config()
const mime = require('mime-types');
const admin = require('firebase-admin');

const UPLOAD_STORAGE = process.env.UPLOAD_STORAGE;

// Initialize Firebase Admin
const serviceAccount = require('../config/serv.js');
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	storageBucket: process.env.STORAGE_BUCKET
});

const bucket = admin.storage().bucket();

async function uploadCaptureFile(req_file, buffer, customMetadata = {}, filename) {
	// Determine the content type using mime-types
	const contentType = mime.lookup(filename) || 
		req_file.mimetype || 
		'application/octet-stream';

	const metadata = {
		contentType: contentType,
		metadata: {
			...customMetadata,
			userId: customMetadata.userId.toString(),
			linkId: customMetadata.linkId,
			captureId: customMetadata.captureId,
			timestamp: Date.now().toString(),
		},
	};

	const filePath = `${UPLOAD_STORAGE}/${filename}`;
	const file = bucket.file(filePath);

	try {
		await file.save(buffer, {
			metadata: metadata,
			contentType: contentType,
		});

		const [url] = await file.getSignedUrl({
			action: 'read',
			expires: Date.now() + (24 * 3600 * 1000),
		});

		return url;
	} catch (error) {
		console.error('Upload error:', error);
		throw error;
	}
}

async function findFileById(captureId) {
	const [files] = await bucket.getFiles({ prefix: UPLOAD_STORAGE });

	for (const file of files) {
		const [metadata] = await file.getMetadata();
		if (metadata.metadata && metadata.metadata.captureId === captureId) {
			return { file, metadata };
		}
	}

	return null;
}

async function findFilesByUserId(userId) {
	const [files] = await bucket.getFiles({ prefix: UPLOAD_STORAGE });
	const userFiles = [];

	for (const file of files) {
		const [metadata] = await file.getMetadata();
		if (metadata.metadata && metadata.metadata.userId === userId) {
			userFiles.push({ file, metadata });
		}
	}

	return userFiles;
}

async function deleteAllFilesByUserId(userId) {
	try {
		const userFiles = await findFilesByUserId(userId);
		if (userFiles.length === 0) {
			return { count: 0, message: 'No files found' };
		}
		let deletedCount = 0;
		for (const fileData of userFiles) {
			try {
				await fileData.file.delete();
				deletedCount++;
			} catch (error) {
				console.error(`Error deleting file ${fileData.file.name}:`, error);
			}
		}
		return { count: deletedCount, message: 'Deletion complete' };
	} catch (error) {
		console.error('Error in bulk file deletion:', error);
		throw new Error('Bulk deletion failed');
	}
}

async function downloadBuffer(captureId) {
	try {
		const fileData = await findFileById(captureId);
		if (!fileData) {
			return { success: false, buffer: null };
		}
		const [buffer] = await fileData.file.download();
		return { success: true, buffer };
	} catch (error) {
		console.error('Error fetching file:', error);
		return { success: false, buffer: null };
	}
}

module.exports = {
	uploadCaptureFile,
	findFileById,
	deleteAllFilesByUserId,
	findFilesByUserId,
	downloadBuffer
};
