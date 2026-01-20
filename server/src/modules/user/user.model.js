const { DataTypes } = require('sequelize')
const bcrypt = require('bcrypt')
const { sequelize } = require('../../config/database')

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  passwordHash: {
    type: DataTypes.STRING,
  },
  provider: {
    type: DataTypes.ENUM('local', 'google'),
    defaultValue: 'local',
  },
  role: {
    type: DataTypes.ENUM('student', 'admin'),
    defaultValue: 'student',
  },
}, {
  tableName: 'users',
  underscored: true,
})

User.prototype.comparePassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash)
}

module.exports = User
