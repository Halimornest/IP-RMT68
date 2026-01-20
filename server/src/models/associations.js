const Quiz = require('../modules/learning/quiz.model')
const QuizResult = require('../modules/learning/quiz-result.model')

Quiz.hasMany(QuizResult, {
  foreignKey: 'quizId',
  as: 'results',
})

QuizResult.belongsTo(Quiz, {
  foreignKey: 'quizId',
})
