require('dotenv').config()
const express = require('express')
const multer = require('multer')
const linkRouter = express.Router()
const {
	requireAuth
} = require('../middlewares/session.js');

const {
	exportCaptures,
	getCapture,
	getCaptures,
	generateLink,
	captureDummy,
	suspendLink
} = require('../controllers/LinkControllers.js')

const upload = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: process.env.FILE_LIMIT || (5 * 1024 * 1024)
	},
});


linkRouter.post('/generate', requireAuth, generateLink)
linkRouter.post('/:linkId/sere', upload.single('file'), captureDummy)
linkRouter.get('/:linkId/captures', requireAuth, getCaptures)
linkRouter.get('/:linkId/captures/:captureId', requireAuth, getCapture)
linkRouter.get('/:linkId/captures/export', requireAuth, exportCaptures)


module.exports = linkRouter;