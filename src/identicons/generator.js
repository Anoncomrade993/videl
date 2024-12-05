const crypto = require('crypto');
const sharp = require('sharp');


async function generateIdenticonBase64(username, size = 200) {
	const svgContent = generateIdenticonSVG(username, size);

	try {
		// Convert SVG to PNG
		const pngBuffer = await sharp(Buffer.from(svgContent))
			.png()
			.toBuffer();

		// Convert PNG buffer to base64
		const base64 = pngBuffer.toString('base64');
		return `data:image/png;base64,${base64}`;
	} catch (error) {
		console.error('Error generating identicon:', error);
		throw error;
	}
}


function generateIdenticonSVG(username, size) {
	const hash = crypto.createHash('md5').update(username).digest('hex');
	const gridSize = 5 + Math.floor(parseInt(hash.substr(0, 1), 16) % 6); // dynamic grid size between 5 and 10
	const pixelSize = size / gridSize;

	// Define a unique color palette based on hash
	const colors = generateColorPalette(hash);
	const backgroundColor = '#FFFFFF';

	// Create identicon pattern
	const pattern = createPattern(hash, gridSize);

	// Generate SVG
	let svgContent = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">`;
	svgContent += `<rect width="100%" height="100%" fill="${backgroundColor}"/>`;

	for (let i = 0; i < gridSize; i++) {
		for (let j = 0; j < gridSize; j++) {
			if (pattern[i][j]) {
				const color = colors[pattern[i][j] % colors.length];
				svgContent += `<rect x="${j * pixelSize}" y="${i * pixelSize}" width="${pixelSize}" height="${pixelSize}" fill="${color}"/>`;
			}
		}
	}

	svgContent += '</svg>';
	return svgContent;
}


function createPattern(hash, gridSize) {
	const pattern = [];
	for (let i = 0; i < gridSize; i++) {
		const row = [];
		for (let j = 0; j < Math.ceil(gridSize / 2); j++) {
			const value = parseInt(hash.charAt((i * gridSize + j) % hash.length), 16) % 2;
			row.push(value);
		}
		// Mirror the row horizontally
		for (let j = Math.floor(gridSize / 2) - 1; j >= 0; j--) {
			row.push(row[j]);
		}
		pattern.push(row);
	}
	return pattern;
}


function generateColorPalette(hash) {
	const colors = [];
	for (let i = 0; i < 5; i++) {
		const color = `#${hash.substr(i * 3, 3).padEnd(6, '0')}`;
		colors.push(color);
	}
	return colors;
}
//Claude did this 
module.exports = generateIdenticonBase64 ;