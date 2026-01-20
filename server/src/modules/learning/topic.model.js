const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/database')

const Topic = sequelize.define('Topic', {
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  level: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'topics',
  underscored: true
})

module.exports = Topic
