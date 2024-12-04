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


authRouter.post('/register', registerUser);
authRouter.post('/verification', emailVerification)
authRouter.post('/signin', loginUser)
authRouter.post('/signout', requireAuth, logoutUser)
authRouter.post('/change_email', requireAuth, changeEmail)
authRouter.post('/change_password', requireAuth, changePassword)
authRouter.post('/request_user_delete', requireAuth, deleteUser)
authRouter.post('/cancel_user_delete', cancelAnimationFrame)

authRouter.post('/request-fp-token', request_fp_OTP)
authRouter.post('/request-ev-token', request_ev_OTP)
authRouter.post('/request-ce-token', requireAuth, request_ce_OTP)
authRouter.post('/request-cp-token', requireAuth, request_cp_OTP)

auth.get('/profile', requireAuth, getUserProfile)



module.exports = authRouter;