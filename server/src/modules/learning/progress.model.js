const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/database')

const UserProgress = sequelize.define('UserProgress', {
  userId: DataTypes.UUID,
  topicId: DataTypes.UUID,
  status: {
    type: DataTypes.ENUM('not_started', 'in_progress', 'completed'),
    defaultValue: 'not_started'
  },
  lastAction: DataTypes.STRING
}, {
  tableName: 'user_progress',
  underscored: true
})

module.exports = UserProgress
