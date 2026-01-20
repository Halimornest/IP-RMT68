const Quiz = require('./quiz.model')
const QuizResult = require('./quiz-result.model')

async function getTopicProgress({ userId, topicId }) {
  const quizzes = await Quiz.findAll({
    where: { topicId },
    include: [
      {
        model: QuizResult,
        as: 'results',
        where: { userId },
        required: false,
      },
    ],
  })

  let attempts = 0
  let totalScore = 0
  let bestScore = 0
  let lastScore = 0
  let totalQuestions = 0

  quizzes.forEach(q => {
    totalQuestions = q.totalQuestions

    q.results.forEach(r => {
      attempts++
      totalScore += r.score
      bestScore = Math.max(bestScore, r.score)
      lastScore = r.score
    })
  })

  const averageScore = attempts
    ? Number((totalScore / attempts).toFixed(2))
    : 0

  const mastery = totalQuestions
    ? Math.round((bestScore / totalQuestions) * 100)
    : 0

  return {
    topicId,
    attempts,
    bestScore,
    averageScore,
    lastScore,
    mastery,
  }
}

module.exports = {
  getTopicProgress,
}
