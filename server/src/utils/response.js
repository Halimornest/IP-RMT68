function successResponse(res, data, statusCode = 200, message = 'Success') {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  })
}

function errorResponse(
  res,
  message = 'Something went wrong',
  statusCode = 500,
  errors = null
) {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  })
}

module.exports = {
  successResponse,
  errorResponse,
}
