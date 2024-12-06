const mongoose = require('mongoose');

const hardwareSignatureSchema = new mongoose.Schema({
	cpuCores: Number,
	deviceMemory: Number,
	maxTouchPoints: Number,
	platform: String,
	hardwareUniqueId: String
}, { _id: false });

const browserEnvironmentSchema = new mongoose.Schema({
	timezone: String,
	languages: [String],
	colorDepth: Number,
	pixelRatio: Number,
	sessionStorage: {
		supported: Boolean,
		details: mongoose.Schema.Types.Mixed
	},
	touchSupport: {
		maxTouchPoints: Number,
		touchEnabled: Boolean,
		touchEvents: [Boolean]
	}
}, { _id: false });

const navigationSignalsSchema = new mongoose.Schema({
	referrer: String,
	connectionType: String,
	connectionSpeed: Number,
	plugins: [{
		name: String,
		description: String
  }],
	timezoneOffset: Number
}, { _id: false });

const performanceProfileSchema = new mongoose.Schema({
	totalExecutionTime: Number,
	memoryUsage: {
		totalJSHeapSize: Number,
		usedJSHeapSize: Number
	},
	performanceEntries: [{
		name: String,
		entryType: String,
		duration: Number
  }]
}, { _id: false });

const mediaFingerprintsSchema = new mongoose.Schema({
	audioCodecs: {
		mp3: Boolean,
		wav: Boolean,
		ogg: Boolean
	},
	videoCodecs: {
		webm: Boolean,
		h264: Boolean,
		ogg: Boolean
	},
	mediaDevices: [{
		kind: String,
		label: String
  }]
}, { _id: false });

const webglSignatureSchema = new mongoose.Schema({
	vendor: String,
	renderer: String,
	version: String,
	shadingLanguageVersion: String
}, { _id: false });

const clockSkewSignatureSchema = new mongoose.Schema({
	browserTime: Number,
	performanceTime: Number,
	difference: Number
}, { _id: false });

const entropySignatureSchema = new mongoose.Schema({
	entropySource: [Number],
	entropyHash: String
}, { _id: false });

const captureSchema = new mongoose.Schema({
	captureId: String,
	linkId: { type: String, required: true },
	rawFingerprint: {
		hardwareSignature: hardwareSignatureSchema,
		browserEnvironment: browserEnvironmentSchema,
		navigationSignals: navigationSignalsSchema,
		performanceProfile: performanceProfileSchema,
		mediaFingerprints: mediaFingerprintsSchema,
		webglSignature: webglSignatureSchema,
		clockSkewSignature: clockSkewSignatureSchema,
		entropySignature: entropySignatureSchema
	},
	computedHash: String,
	confidence: Number,
	mediaUrl: { type: String, immutable: true },
	hasMedia: { type:Boolean, default: false }
}, {
	timestamps: true
});

// Index on the computedHash for faster lookups
captureSchema.index({ computedHash: 1 }, { expiresAfterSeconds: 24 * 3600 /*24hrs expiration*/ });

module.exports = mongoose.model('Capture', captureSchema);
