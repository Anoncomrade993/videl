/**
 * 
 * 26/12/2024
 * The Idea is mine 
 * code by Claude .
 * Hell no AI wouldn't take my job
 * works only on my command 
 */

const os = require('os');
const fs = require('fs').promises;
const path = require('path');
const simpleGit = require('simple-git');



//By ME
module.exports.cloneGitRepo = async function(templateId = "", repo_url = "", branch = "main") {
	if (!repo_url.trim()) {
		return { success: false, status: 400, message: "missing field" }
	}
	const git = new simpleGit();
	const tempDir = fs.mkdtemp(path.join(os.tempdir(), templateId))

	try {
		const clone = await git.clone(repo_url.trim(), tempDir, ['--depth', '1', branch])
		if (!clone) {
			await fs.rm(tempDir, { recursive: true, force: true });
			return {
				success: false,
				status: 400,
				message: "Error cloning repo"
			}
		};
		await fs.rm(path.join(tempDir, '.git', { recursive: true, force: true }));
		return {
			success: true,
			status: 200,
			message: 'cloned successfully',
			templateId,
			tempDir
		}
	} catch (e) {
		await fs.rm(tempDir, { recursive: true, force: true });
		return {
			success: false,
			status: 500,
			message: 'Internal server error occurred '
		}
	}
}
//ME
module.exports.readRepoDir = async function(tempDir = "") {
	try {
		const files = await fs.readdir(tempDir.trim());
		const fileList = [];

		if (!files || files.length === 0) {
			return { found: false, fileList: null };
		}

		for (const file of files) {
			const filePath = path.join(tempDir, file);
			const stat = await fs.stat(filePath);

			if (stat.isDirectory()) {
				// Recursively read subdirectory
				const subDirResult = await readRepoDir(filePath);
				if (subDirResult.found) {
					// Add subdirectory files with their relative paths
					subDirResult.fileList.forEach(subFile => {
						fileList.push(path.join(file, subFile));
					});
				}
			} else {
				fileList.push(file);
			}
		}
		return { found: true, fileList };
	} catch (error) {
		console.error('Error reading dir:', error);
		return { found: false, fileList: null };
	}
}
//ME
module.exports.fileExistsInRepo = async function(tempDir, scannedHtmlResult = {}) {
	const { scripts, styles, images, audios, videos, fonts, others } = scannedHtmlResult;

	const allResults = [...scripts, ...styles, ...images, ...audios, ...videos, ...fonts, ...others];

	const fileExists = async (filename) => {
		const filePath = path.join(tempDir, filename);
		try {
			await fs.access(filePath, fs.constants.F_OK);
			return true; // File exists
		} catch (error) {
			return false; // File not exist
		}
	};

	const existencePromises = allResults.map(async (pathFile) => {
		const exists = await fileExists(pathFile);
		return { path: pathFile, exists };
	});

	const results = await Promise.all(existencePromises);

	// Filter files that exist
	const existingFiles = results.filter(result => result.exists).map(result => result.path);

	if (!existingFiles.length > 0) {
		return []
	}

	return existingFiles;
};
//BY Claude
module.exports.scanHtmlAssets = function(html) {
	const assets = {
		scripts: [],
		styles: [],
		images: [],
		videos: [],
		audios: [],
		fonts: [],
		others: []
	};

	// clean and validate URLs
	const cleanUrl = url => url.replace(/['"]/g, '').trim();

	// categorize file type
	const categorizeUrl = url => {
		const ext = url.split('.').pop().toLowerCase();
		if (['js', 'mjs'].includes(ext)) return 'scripts';
		if (['css', 'scss', 'sass', 'less'].includes(ext)) return 'styles';
		if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'ico'].includes(ext)) return 'images';
		if (['mp4', 'webm', 'ogv'].includes(ext)) return 'videos';
		if (['mp3', 'wav', 'ogg'].includes(ext)) return 'audios';
		if (['ttf', 'woff', 'woff2', 'eot'].includes(ext)) return 'fonts';
		return 'others';
	};

	// Extract URLs from HTML
	const patterns = {
		scripts: /<script[^>]+src=["']([^"']+)["'][^>]*>/gi,
		styles: /<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["'][^>]*>/gi,
		images: /<img[^>]+src=["']([^"']+)["'][^>]*>/gi,
		videos: /<video[^>]*>.*?<source[^>]+src=["']([^"']+)["'][^>]*>.*?<\/video>|<video[^>]+src=["']([^"']+)["'][^>]*>/gi,
		audios: /<audio[^>]*>.*?<source[^>]+src=["']([^"']+)["'][^>]*>.*?<\/audio>|<audio[^>]+src=["']([^"']+)["'][^>]*>/gi,
		bgImages: /style=["'][^"']*background-image:\s*url\(['"]?([^'")\s]+)['"]?\)[^"']*/gi
	};

	// Extract  URLs with the defined patterns
	for (const [type, pattern] of Object.entries(patterns)) {
		let match;
		while ((match = pattern.exec(html)) !== null) {
			const url = cleanUrl(match[1] || match[2]);

			// Ignore http or https URLs
			if (!url.startsWith('http://') && !url.startsWith('https://')) {
				if (type === 'bgImages') {
					assets[categorizeUrl(url)].push(url);
				} else {
					assets[type].push(url);
				}
			}
		}
	}

	// Remove duplicates and empty values
	for (let type in assets) {
		assets[type] = [...new Set(assets[type].filter(Boolean))];
	}

	return assets;
};
//Claude
module.exports.modifyAssetPaths = function(html, templateId) {
	// Regular expression to match asset URLs
	const assetPatterns = {
		scripts: /<script[^>]+src=["']([^"']+)["'][^>]*>/gi,
		styles: /<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["'][^>]*>/gi,
		images: /<img[^>]+src=["']([^"']+)["'][^>]*>/gi,
		videos: /<video[^>]*>.*?<source[^>]+src=["']([^"']+)["'][^>]*>.*?<\/video>|<video[^>]+src=["']([^"']+)["'][^>]*>/gi,
		audios: /<audio[^>]*>.*?<source[^>]+src=["']([^"']+)["'][^>]*>.*?<\/audio>|<audio[^>]+src=["']([^"']+)["'][^>]*>/gi
	};

	let updatedHtml = html;

	for (const [type, pattern] of Object.entries(assetPatterns)) {
		updatedHtml = updatedHtml.replace(pattern, (match, url) => {
			// Clean URL and ignore absolute URLs
			const cleanedUrl = url.replace(/['"]/g, '').trim();
			if (cleanedUrl.startsWith('http://') || cleanedUrl.startsWith('https://')) {
				return match; // Return original match if it's an absolute URL
			}

			// Generate new URL
			const newUrl = generateAssetUrl(templateId, type, cleanedUrl);
			return match.replace(url, newUrl);
		});
	}

	return updatedHtml;
}
//Claude
function generateAssetUrl(templateId, type, filename) {
	switch (type) {
		case 'scripts':
			return `/${templateId}/scripts/${filename}`;
		case 'styles':
			return `/${templateId}/styles/${filename}`;
		case 'images':
		case 'videos':
		case 'audios':
		case 'fonts':
			return `/${templateId}/assets/${filename}`;
		default:
			return `/${templateId}/assets/${filename}`; //Others 
	}
}