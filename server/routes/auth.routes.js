import express from 'express'
import authCtrl from '../controllers/auth.controller'

const router = express.Router()

router.route('/auth/signin')//authenticate user with email and password
  .post(authCtrl.signin)
router.route('/auth/signout')//clear the cookie containing a JWT that was set on the response object after signing in
  .get(authCtrl.signout)

export default router
