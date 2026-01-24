const jwt = require('jsonwebtoken')

function generateToken(user) {
  console.log('JWT_SECRET:', process.env.JWT_SECRET)
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  )
}

module.exports = { generateToken }
