const mongoose = require('mongoose')
const { generate } = require('../utility/helpers.js')

const templateSchema = new mongoose.Schema({
	templateId: { type: String, unique: true, required: true, immutable: true },
	title: { type: String, required: true, immutable: true },
	templateUrl: { type: String, required: true, unique: true, immutable: true },
	category: {
		type: String,
		enum: [
		'scam-bait',
		'porn-bait',
		'pedo-bait',
		'leaks-bait',
		'crypto-scam-bait',
		'gift-card-bait'
		]
	},
	templateType: {
		type: String,
		required: true,
		enum: ['free', 'paid']
	}
}, { timestamps: true });




templateSchema.statics.createTemplate = async function(data = { category, templateUrl, templateType, title }) {
	try {
		if (!data || Object.keys(data).length === 0) {
			return { success: false, status: 400, message: "missing parameters" }
		}
		const templateId = generate(11);
		const template = await this.create({ ...data, templateId });
		if (!template) {
			return { success: false, status: 500, message: "Internal server error occurred" }
		}
		return {
			success: true,
			status: 201,
			message: "created successfully",
			templateId
		}
	} catch (error) {
		console.error('Error creating template');
		return {
			success: false,
			status: 500,
			message: "Internal server error occurred"
		}
	}
}
module.exports = templateSchema;