const mongoose = require('mongoose')


const sessionSchema = new mongoose.Schema({
	state: { type: String, required: true, unique: true, immutable: true },
}, { timestamps: true });

sessionSchema.index({ state: 1 })
sessionSchema.index({ createdAt: 1 })

module.exports = mongoose.model('TempSession', sessionSchema)
