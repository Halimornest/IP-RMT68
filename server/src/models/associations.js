require('../config/database')

const User = require('../modules/user/user.model')
const Topic = require('../modules/learning/topic.model')
const Quiz = require('../modules/learning/quiz.model')
const QuizResult = require('../modules/learning/quiz-result.model')

Topic.hasMany(Quiz, {
  foreignKey: 'topicId',
  as: 'Quizzes',
})

Quiz.belongsTo(Topic, {
  foreignKey: 'topicId',
})

Quiz.hasMany(QuizResult, {
  foreignKey: 'quizId',
  as: 'results',
})

QuizResult.belongsTo(Quiz, {
  foreignKey: 'quizId',
})

module.exports = {
  User,
  Topic,
  Quiz,
  QuizResult,
}
