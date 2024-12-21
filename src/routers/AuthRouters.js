const express = require('express')
const authRouter = express.Router()
const {
	requireAuth
} = require('../middlewares/session.js')
const {
	loginUser,
	registerUser,
	logoutUser,
	signInWithGithub,
	githubRegistrationCallBack,
	checkUsername
} = require('../controllers/AuthControllers.js')

const {
	request_du_token,
	request_ce_token,
	request_fp_token,
	request_cp_token,
	request_ev_token,
	//get endpoints to render page
	GET_changeEmail,
	GET_changePassword,
	GET_resetPassword,
	GET_cancelDeletUser,
	GET_emailVerification,

	POST_changeEmail,
	POST_resetPassword,
	POST_deleteUser,
	POST_changePassword

} = require('../controllers/AuthExtension.js')
//const { tokenRequestLimiter } = require('../middlewares/security.js')


authRouter.post('/register', registerUser);
authRouter.post('/signin', loginUser)
authRouter.post('/signout', requireAuth, logoutUser)




authRouter.post('/change-email', requireAuth, POST_changeEmail)
authRouter.post('/change-password', requireAuth, POST_changePassword)
authRouter.post('/reset-password', POST_resetPassword)
authRouter.post('/delete-account', requireAuth, POST_deleteUser)


/***GET endpoints which renders pages to request on the POST endpoints**/

authRouter.get('/change-email/:token', requireAuth, GET_changeEmail)
authRouter.get('/change-password/:token', requireAuth, GET_changePassword)
authRouter.get('/reset-password/:token', GET_resetPassword)
authRouter.get('/cancel-delete-user/:token', GET_cancelDeletUser)
authRouter.get('/verify-email/:token', GET_emailVerification)

/******************ENDSssss**************/



authRouter.post('/request-fp-token', /**tokenRequestLimiter**/ request_fp_token)
authRouter.post('/request-ev-token', /**tokenRequestLimiter**/ request_ev_token)
authRouter.post('/request-ce-token', /**tokenRequestLimiter**/ requireAuth, request_ce_token)
authRouter.post('/request-cp-token', /**tokenRequestLimiter**/ requireAuth, request_cp_token)
authRouter.post('/request_du_token', /**tokenRequestLimiter**/ requireAuth, request_du_token)


authRouter.get('/profile', requireAuth, getUserProfile)
authRouter.get('/gh/initialize', signInWithGithub)
authRouter.get('/check-username', checkUsername)



module.exports = authRouter;