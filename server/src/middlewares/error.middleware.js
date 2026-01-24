const ApiError = require('../utils/ApiError')

function errorMiddleware(err, req, res, next) {
  const status = err.statusCode || err.status || 500

  return res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
    errors: err.errors || null,
  })
}

module.exports = errorMiddleware
