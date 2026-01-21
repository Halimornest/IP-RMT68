const ApiError = require('./ApiError')

function requireFields(fields, source) {
  const missing = fields.filter(
    field =>
      source[field] === undefined ||
      source[field] === null ||
      source[field] === ''
  )

  if (missing.length > 0) {
    throw new ApiError(
      400,
      `Missing required fields: ${missing.join(', ')}`
    )
  }
}

function isUUID(value) {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(value)
}

function requireUUID(value, fieldName = 'id') {
  if (!isUUID(value)) {
    throw new ApiError(400, `Invalid ${fieldName}`)
  }
}

module.exports = {
  requireFields,
  requireUUID,
}
