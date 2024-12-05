const { FILE_LIMIT } = require('../constants.js');

function fileHandler(req, res, next) {
	try {
		const file = req.file;

		if (file) {
			const { size: fileSize, mimetype, originalname } = file;

			// Check file size
			if (fileSize >= FILE_LIMIT) {
				return res.status(400).json({ message: `File size should not exceed ${FILE_LIMIT / (1024 * 1024)}MB` });
			}

			// Allowed and blacklisted file extensions
			const allowedExtensions = ['.jpg', '.jpeg', '.png'];
			const blacklistedExtensions = new Set([
                // Executable files
                '.exe', '.msi', '.bat', '.cmd', '.com', '.jar', '.gadget', '.ws', '.wsf', '.vb', '.vbs', '.vbe', '.js',
                // Scripts
                '.py', '.rb', '.php', '.asp', '.aspx', '.jsp', '.cgi',
                // System files
                '.sys', '.dll', '.bin', '.drv', '.nls',
                // Compressed files
                '.zip', '.rar', '.7z', '.tar', '.gz',
                // Video files
                '.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv', '.m4v',
                // Audio files
                '.mp3', '.wav', '.ogg', '.m4a', '.aac',
                // Other potentially dangerous formats
                '.apk', '.app', '.ipa', '.dmg', '.iso', '.img', '.hta',
                // Potentially inappropriate for school
                '.torrent'
            ]);

			// Check file extension
			const fileExtension = originalname.toLowerCase().slice(originalname.lastIndexOf('.'));
			if (!allowedExtensions.includes(fileExtension) || blacklistedExtensions.has(fileExtension)) {
				return res.status(400).json({ message: "Unacceptable file type" });
			}

			// Check MIME type
			const disallowedMimeTypes = [
                'application/x-msdownload',
                'application/vnd.android.package-archive',
                'application/x-executable',
                'application/x-sharedlib',
                'application/x-hta',
                'text/javascript',
                'application/javascript',
                'video/',
                'audio/'
            ];

			const isDisallowedMimeType = disallowedMimeTypes.some(type =>
				mimetype.startsWith(type) || mimetype === type
			);

			if (isDisallowedMimeType) {
				return res.status(400).json({ message: "Unacceptable file type" });
			}
		}
		next();
	} catch (e) {
		console.error('Error in file handler:', e);
		return res.status(500).json({ message: "Error processing file" });
	}
}

module.exports = fileHandler;