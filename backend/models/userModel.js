const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema(
  {
    uname: {
      type: String,
      required: [true, 'Please provide a Username'],
    },
    email: {
      type: String,
      required: [true, 'Please provide a email'],
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minLength: 8,
      select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// will encrypt password everytime its saved
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.generateToken = async function () {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: JWT_EXPIRE,
  })
}

userSchema.methods.generateResetToken = async function () {
  const resetToken = crypto.randomBytes(20).toString('hex')
  this.resetPasswordToken = resetToken
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')
  this.resetPasswordExpire = Date.now() + 10 * (60 * 1000) // 10 minutes
  return resetToken
}

const User = mongoose.model('User', userSchema)

module.exports = User
