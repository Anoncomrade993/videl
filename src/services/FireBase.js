/**
 * @Author : MockingBugs
 **/

require('dotenv').config()
const fileType = require('file-type');
const admin = require('firebase-admin');

const UPLOAD_STORAGE = process.env.UPLOAD_STORAGE;
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyBe4OYwYqSPhw9NPy7Icl-zOLGGqb3pOII",
	authDomain: "mockinbugslabs.firebaseapp.com",
	projectId: "mockinbugslabs",
		messagingSenderId: "1067004858149",
	appId: "1:1067004858149:web:a511d8872320bac2d814cc",
	measurementId: "G-T1NHPP9ZNJ"
};
// Initialize Firebase Admin
const serviceAccount = require('../config/serv.js');
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	storageBucket: process.env.STORAGE_BUCKET
});

const bucket = admin.storage().bucket();



async function uploadCaptureFile(req_file, buffer, customMetadata = {}, filename) {
	// Determine the content type from the buffer
	const detectedType = await fileType.fromBuffer(buffer);
	const contentType = detectedType ? detectedType.mime : req_file.mimetype || 'application/octet-stream';

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


/**
 * 
 * @param {String} captureId
 * @returns {{file, metadata}} 
 * 
 */

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

/**
 * 
 * @param {String} userId
 * @returns {Array<{file, metadata}>}
 * 
 */
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



/**
 * 
 * @param {String} userId
 * @returns {{Number,String}}
 * 
 */
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


module.exports = {
	uploadCaptureFile,
	findFileByCaptureId,
	deleteAllFilesByUserId,
	findFilesByUserId
};