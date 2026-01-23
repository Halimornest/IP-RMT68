const Topic = require('./topic.model')
const Quiz = require('./quiz.model')
const QuizResult = require('./quiz-result.model')

async function getMyProgress({ userId }) {
  const topics = await Topic.findAll({
    include: [
      {
        model: Quiz,
        as: 'Quizzes',
        include: [
          {
            model: QuizResult,
            as: 'results',
            where: { userId },
            required: false,
          },
        ],
      },
    ],
  })

  return topics
    .map(topic => {
      let attempts = 0
      let bestScore = 0
      let lastScore = null

      topic.Quizzes.forEach(q => {
        q.results.forEach(r => {
          attempts++
          bestScore = Math.max(bestScore, r.score)
          lastScore = r.score
        })
      })

      if (attempts === 0) return null

      return {
        topicId: topic.id,
        title: topic.title,
        attempts,
        bestScore,
        lastScore,
        status: bestScore >= 70 ? 'completed' : 'in_progress',
      }
    })
    .filter(Boolean)
}

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

  quizzes.forEach(q => {
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

  return {
    topicId,
    attempts,
    bestScore,
    averageScore,
    lastScore,
    mastery: bestScore,
    status: bestScore >= 70 ? 'completed' : 'in_progress',
  }
}

async function getQuizHistory({ userId, topicId }) {
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
    order: [[{ model: QuizResult, as: 'results' }, 'created_at', 'DESC']],
  })

  const history = []

  quizzes.forEach(q => {
    q.results.forEach(r => {
      history.push({
        score: r.score,
        submittedAt: r.created_at,
      })
    })
  })

  return history
}

module.exports = {
  getMyProgress,
  getTopicProgress,
  getQuizHistory,
}
