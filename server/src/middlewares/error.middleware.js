const ApiError = require('../utils/ApiError')

function errorMiddleware(err, req, res, next) {

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || null,
    })
  }

  return res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    errors: null,
  })
}

module.exports = errorMiddleware
