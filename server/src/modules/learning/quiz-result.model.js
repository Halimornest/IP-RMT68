const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/database')

const QuizResult = sequelize.define(
  'QuizResult',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    quizId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    answers: {
      type: DataTypes.JSONB, 
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'quiz_results',
    underscored: true,
  }
)

module.exports = QuizResult
