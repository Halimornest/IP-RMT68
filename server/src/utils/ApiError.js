class ApiError extends Error {
  constructor(statusCode = 500, message = 'Internal Server Error', errors = null) {
    super(message)
    this.statusCode = statusCode
    this.errors = errors
  }
}

module.exports = ApiError
