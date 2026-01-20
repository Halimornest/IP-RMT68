const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/database')

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: true
    },
    provider: {
      type: DataTypes.ENUM('local', 'google'),
      defaultValue: 'local'
    },
    role: {
      type: DataTypes.ENUM('student', 'admin'),
      defaultValue: 'student'
    }
  },
  {
    tableName: 'users',
    underscored: true
  }
)

module.exports = User
