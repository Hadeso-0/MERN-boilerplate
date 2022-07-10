const asyncHandler = require('express-async-handler')
const ErrorResponse = require('../utils/errorResponse')

const TestExample = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true, data: 'Access to data granted' })
})

module.exports = { TestExample }
