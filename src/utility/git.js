const { initializeApp, cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');
const simpleGit = require('simple-git');
const path = require('path');
const fs = require('fs').promises;
const os = require('os');
const { v4: uuidv4 } = require('uuid');

class StaticSiteHosting {
	constructor(firebaseCredPath, bucketName) {
		// Initialize Firebase
		initializeApp({
			credential: cert(firebaseCredPath),
			storageBucket: bucketName
		});

		this.bucket = getStorage().bucket();
	}

	async hostSite(repoUrl) {
		// Create a temporary directory
		const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'site-'));

		try {
			// Clone the repository
			await simpleGit().clone(repoUrl, tempDir);

			// Generate unique site ID
			const siteId = uuidv4();

			// Validate site structure
			await this._validateSiteStructure(tempDir);

			// Upload all files
			await this._uploadDirectory(tempDir, siteId);

			// Generate public URL
			const hostUrl = `https://storage.googleapis.com/${this.bucket.name}/${siteId}/index.html`;

			// Clean up temporary directory
			await fs.rm(tempDir, { recursive: true, force: true });

			return hostUrl;
		} catch (error) {
			// Cleanup temp directory in case of error
			await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
			console.error('Site hosting failed:', error);
			throw error;
		}
	}

	async _validateSiteStructure(sitePath) {
		const requiredFiles = ['index.html', 'index.js', 'styles.css'];

		for (let file of requiredFiles) {
			try {
				await fs.access(path.join(sitePath, file));
			} catch {
				throw new Error(`Missing required file: ${file}`);
			}
		}
	}

	async _uploadDirectory(localPath, siteId) {
		const uploadPromises = [];

		const walkDirectory = async (currentPath, relativePath = '') => {
			const entries = await fs.readdir(currentPath, { withFileTypes: true });

			for (const entry of entries) {
				const fullPath = path.join(currentPath, entry.name);
				const relativeFilePath = path.join(relativePath, entry.name);

				if (entry.isDirectory()) {
					await walkDirectory(fullPath, relativeFilePath);
				} else {
					const firebasePath = `${siteId}/${relativeFilePath}`;
					const uploadPromise = this.bucket.upload(fullPath, {
						destination: firebasePath,
						metadata: {
							public: true,
							contentType: this._getContentType(entry.name)
						}
					});
					uploadPromises.push(uploadPromise);
				}
			}
		};

		await walkDirectory(localPath);
		await Promise.all(uploadPromises);
	}

	_getContentType(filename) {
		const ext = path.extname(filename).toLowerCase();
		const contentTypes = {
			'.html': 'text/html',
			'.css': 'text/css',
			'.js': 'application/javascript',
			'.json': 'application/json',
			'.png': 'image/png',
			'.jpg': 'image/jpeg',
			'.jpeg': 'image/jpeg',
			'.gif': 'image/gif',
			'.svg': 'image/svg+xml'
		};
		return contentTypes[ext] || 'application/octet-stream';
	}
}

// Usage Example
async function main() {
	try {
		const hosting = new StaticSiteHosting(
			'./firebase-credentials.json',
			'your-bucket-name.appspot.com'
		);

		const siteUrl = await hosting.hostSite('https://github.com/username/repo.git');
		console.log('Site hosted at:', siteUrl);
	} catch (error) {
		console.error('Hosting failed:', error);
	}
}

module.exports = StaticSiteHosting;




// Server-side (Node.js Express) - server.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Store session/state (in production, use Redis or a more robust solution)
const sessionStore = new Map();

// GitHub OAuth Initiation Route


// GitHub OAuth Callback Route


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});