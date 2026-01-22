const Topic = require('../modules/learning/topic.model')
const Quiz = require('../modules/learning/quiz.model')
const QuizResult = require('../modules/learning/quiz-result.model')

Topic.hasMany(Quiz, {
  foreignKey: 'topicId',
  as: 'Quizzes',
})

Quiz.belongsTo(Topic, {
  foreignKey: 'topicId',
  as: 'Topic',
})

Quiz.hasMany(QuizResult, {
  foreignKey: 'quizId',
  as: 'results',
})

QuizResult.belongsTo(Quiz, {
  foreignKey: 'quizId',
  as: 'Quiz',
})

