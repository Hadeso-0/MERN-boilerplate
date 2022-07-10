const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const ErrorResponse = require('../utils/errorResponse')

const registerUser = asyncHandler(async (req, res, next) => {
  const { uname, email, password } = req.body

  if (!uname || !email || !password) {
    res
      .status(400)
      .json({ success: false, error: 'Please provide all the fields.' })
  }

  try {
    const emailExists = await User.findOne({ email })
    if (emailExists) {
      res.status(400)
      throw new Error('Email Already Registered')
    }

    const user = await User.create({
      uname,
      email,
      password,
    })
    if (user) {
      res.status(201).json({
        success: true,
        user: {
          _id: user._id,
          uname: user.uname,
          email: user.email,
          isAdmin: user.isAdmin,
        },
        token: user.generateToken(),
      })
    }
  } catch (error) {
    next(error)
  }
})

const authUser = asyncHandler(async (req, res) => {
  const { login, password } = req.body

  if (!login || !password) {
    return next(new ErrorResponse('Please provide Credentials', 400))
  }

  try {
    let user = await User.findOne({ email: login }).select('+password')
    if (!user) user = await User.findOne({ uname: login }).select('+password')

    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        success: true,
        user: {
          _id: user._id,
          uname: user.uname,
          email: user.email,
          isAdmin: user.isAdmin,
        },
        token: user.generateToken(),
      })
    } else return next(new ErrorResponse('Invalid Credentials', 401))
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) return next(new ErrorResponse('Email could not be sent', 404))

    const resetToken = user.generateResetToken()
    await user.save()
    const resetURL = `${BASE_URL}/resetpassword/${resetToken}`
    const message = `
      <h1>You have requested a password reset</h1>
      <p>Please make a put request to the following link:</p>
      <a href=${resetURL} clicktracking=off>${resetURL}</a>
    `
  } catch (error) {}
})

const resetPassword = asyncHandler(async (req, res) => {})

module.exports = { registerUser, authUser, resetPassword, forgetPassword }
