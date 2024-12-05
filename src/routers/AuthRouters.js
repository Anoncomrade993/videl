const express = require('express')
const authRouter = express.Router()
const {
	requireAuth
} = require('../middlewares/session.js')
const {
	loginUser,
	registerUser,
	logoutUser,
	emailVerification,
	changeEmail,
	changePassword,
	request_ce_OTP,
	request_cp_OTP,
	request_ev_OTP,
	request_fp_OTP,
	getUserProfile,
	deleteUser,
	cancelDeleteUser
} = require('../controllers/AuthControllers.js')

const { tokenRequestLimiter } = require('../middlewares/security.js')


authRouter.post('/register', registerUser);
authRouter.post('/verification', emailVerification)
authRouter.post('/signin', loginUser)
authRouter.post('/signout', requireAuth, logoutUser)
authRouter.post('/change_email', requireAuth, changeEmail)
authRouter.post('/change_password', requireAuth, changePassword)
authRouter.post('/request_user_delete', requireAuth, deleteUser)
authRouter.post('/cancel_user_delete', cancelDeleteUser)

authRouter.post('/request-fp-token', tokenRequestLimiter, request_fp_OTP)
authRouter.post('/request-ev-token', tokenRequestLimiter, request_ev_OTP)
authRouter.post('/request-ce-token', tokenRequestLimiter, requireAuth, request_ce_OTP)
authRouter.post('/request-cp-token', tokenRequestLimiter, requireAuth, request_cp_OTP)

auth.get('/profile', requireAuth, getUserProfile)



module.exports = authRouter;