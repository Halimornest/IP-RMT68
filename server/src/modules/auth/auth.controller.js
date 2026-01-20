const { generateToken } = require('./auth.service')
const User = require('../user/user.model')

function sanitizeUser(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
  }
}

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'email and password are required',
      })
    }

    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
      })
    }

    const user = await User.create({
      name,
      email,
      password,
    })

    const token = generateToken(user)

    res.status(201).json({
      success: true,
      user: sanitizeUser(user),
      token,
    })
  } catch (err) {
    next(err)
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      })
    }

    const token = generateToken(user)

    res.json({
      success: true,
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

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    res.json({
      success: true,
      user,
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  register,
  login,
  me,
}
