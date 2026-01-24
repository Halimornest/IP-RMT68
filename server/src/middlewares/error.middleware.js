function errorMiddleware(err, req, res, next) {
  if (process.env.NODE_ENV !== 'test') {
    console.error('ERROR:', err);
  }

  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message,
  });
}

module.exports = errorMiddleware;
