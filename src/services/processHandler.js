const fs = require('fs').promises
const path = require('path')

const { generate } = require('../utility/helpers.js');
const { uploadTemplate } = require('./FireBase.js')
const {
	readRepoDir,
	cloneGitRepo,
	scanHtmlAssets,
	modifyAssetPaths,
	fileExistsInRepo
} = require('./Videl.js')



async function* processTemplate(templateId, repoUrl, branch, subdomain) {
	try {
		// Step 1: Clone the Git Repository
		yield "Cloning the repository...";
		const cloneResult = await cloneGitRepo(templateId, repoUrl, branch);
		if (!cloneResult.success) {
			yield `Error: ${cloneResult.message}`;
			throw new Error(cloneResult.message);
		}
		yield "Repository cloned successfully.";

		const tempDir = cloneResult.tempDir;

		// Step 2: Read the repository directory for files
		yield "Reading repository directory...";
		const readResult = await readRepoDir(tempDir);
		if (!readResult.found) {
			yield "Error: No files found in the repository.";
			throw new Error("No files found in the repository");
		}
		yield "Files found in the repository.";

		// Step 3: Scan HTML files for assets and modify paths
		yield "Scanning HTML files for assets...";
		const htmlFiles = readResult.fileList.filter(file => file.endsWith('.html'));
		let allAssets = { scripts: [], styles: [], images: [], videos: [], audios: [], fonts: [], others: [] };

		for (const htmlFile of htmlFiles) {
			try {
				const htmlContent = await fs.readFile(path.join(tempDir, htmlFile), 'utf-8');

				// Modify asset paths before scanning
				const updatedHtmlContent = modifyAssetPaths(htmlContent, templateId, subdomain);

				const assets = scanHtmlAssets(updatedHtmlContent);

				for (const [key, value] of Object.entries(assets)) {
					allAssets[key] = [...allAssets[key], ...value];
				}

				// Save the modified HTML back to the file system
				await fs.writeFile(path.join(tempDir, htmlFile), updatedHtmlContent);
				yield `Updated asset paths in ${htmlFile}.`;
			} catch (error) {
				yield `Error processing ${htmlFile}: ${error.message}`;
			}
		}

		// Step 4: Check for existence of assets in the cloned repository
		yield "Checking for existing assets...";
		const existingFiles = await fileExistsInRepo(tempDir, allAssets);
		yield "Asset existence check complete.";

		// Step 5: Upload the template and assets to Firebase
		yield "Uploading template to Firebase...";
		const uploadedTemplateId = await uploadTemplate(tempDir);
		yield "Template uploaded successfully.";

		// Clean up the temporary directory
		await fs.rm(tempDir, { recursive: true, force: true });
		yield "Temporary directory cleaned up.";

		return {
			templateId: uploadedTemplateId,
			existingFiles
		};
	} catch (error) {
		yield `Error:  Internal server error occurred`;
	}
}