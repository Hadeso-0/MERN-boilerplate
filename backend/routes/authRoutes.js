const express = require('express')
const {
  registerUser,
  authUser,
  forgetPassword,
  resetPassword,
} = require('../controllers/authControllers')
const router = express.Router()

router.route('/register').post(registerUser)
router.route('/login').post(authUser)
router.route('/forgotpassword').post(forgetPassword)
router.route('/resetpassword/:resetToken').put(resetPassword)

module.exports = router
