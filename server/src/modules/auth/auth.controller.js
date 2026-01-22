const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../user/user.model')
const { generateToken } = require('./auth.service')
const { successResponse } = require('../../utils/response')
const { requireFields } = require('../../utils/validation')
const ApiError = require('../../utils/ApiError')

function sanitizeUser(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
  }
}

async function register(req, res, next) {
  try {
    requireFields(['email', 'password'], req.body)

    const { email, password } = req.body

    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      throw new ApiError(409, 'Email already registered')
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await User.create({
      email,
      passwordHash,
      provider: 'local',
    })

    const token = generateToken(user)

    return successResponse(res, {
      user: sanitizeUser(user),
      token,
    }, 201)
  } catch (err) {
    next(err)
  }
}

async function login(req, res, next) {
  try {
    requireFields(['email', 'password'], req.body)

    const { email, password } = req.body

    const user = await User.findOne({ where: { email } })
    if (!user) throw new ApiError(401, 'Invalid credentials')

    const isMatch = await user.comparePassword(password)
    if (!isMatch) throw new ApiError(401, 'Invalid credentials')

    const token = generateToken(user)

    return successResponse(res, {
      user: sanitizeUser(user),
      token,
    })
  } catch (err) {
    next(err)
  }
}

async function me(req, res, next) {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['passwordHash'] },
    })

    if (!user) throw new ApiError(404, 'User not found')

    return successResponse(res, { user })
  } catch (err) {
    next(err)
  }
}

async function googleCallback(req, res) {
  const user = req.user

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  res.redirect(
    `${process.env.CLIENT_URL}/oauth-success?token=${token}`
  )
}

module.exports = {
  register,
  login,
  me,
  googleCallback,
}
