function errorMiddleware(err, req, res, next) {
  console.error('🔥 ERROR:', err);

  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message,
    stack: err.stack,
  });
}

module.exports = errorMiddleware;
