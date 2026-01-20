const bcrypt = require('bcrypt')
const User = require('../user/user.model')
const { signToken } = require('../../utils/jwt')

const register = async ({ email, password }) => {
  const existingUser = await User.findOne({ where: { email } })
  if (existingUser) {
    throw new Error('Email already registered')
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const user = await User.create({
    email,
    passwordHash,
    provider: 'local'
  })

  const token = signToken({ id: user.id, role: user.role })

  return { user, token }
}

const login = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } })
  if (!user || !user.passwordHash) {
    throw new Error('Invalid credentials')
  }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    throw new Error('Invalid credentials')
  }

  const token = signToken({ id: user.id, role: user.role })

  return { user, token }
}

module.exports = {
  register,
  login
}
