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
	forgotPassword,
	cancelDeleteUser
} = require('../controllers/AuthControllers.js')

//const { tokenRequestLimiter } = require('../middlewares/security.js')


authRouter.post('/register', registerUser);
authRouter.post('/verification', emailVerification)
authRouter.post('/signin', loginUser)
authRouter.post('/signout', requireAuth, logoutUser)
authRouter.post('/change-email', requireAuth, changeEmail)
authRouter.post('/change-password', requireAuth, changePassword)
authRouter.post('/request-user-delete', requireAuth, deleteUser)
authRouter.post('/cancel-user-delete', cancelDeleteUser)
authRouter.post('/reset-password', forgotPassword)
authRouter.post('/request-fp-token', /*tokenRequestLimiter , */ request_fp_OTP)
authRouter.post('/request-ev-token', /*tokenRequestLimiter ,*/ request_ev_OTP)
authRouter.post('/request-ce-token', /*tokenRequestLimiter,*/ requireAuth, request_ce_OTP)
authRouter.post('/request-cp-token', /*tokenRequestLimiter, */ requireAuth, request_cp_OTP)

authRouter.get('/profile', requireAuth, getUserProfile)



module.exports = authRouter;