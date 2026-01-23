const Topic = require('./topic.model')
const UserProgress = require('./progress.model')
const Quiz = require('./quiz.model')
const QuizResult = require('./quiz-result.model')

async function getAllTopics() {
  return Topic.findAll({
    order: [['created_at', 'DESC']],
  })
}

async function getTopicById(id) {
  return Topic.findByPk(id)
}

async function updateProgress({ userId, topicId, status, lastAction }) {
  const [progress, created] = await UserProgress.findOrCreate({
    where: { userId, topicId },
    defaults: { status, lastAction },
  })

  if (!created) {
    progress.status = status
    progress.lastAction = lastAction
    await progress.save()
  }

  return progress
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
  let totalQuestions = 0

  quizzes.forEach(q => {
    const questions = Array.isArray(q.questions) ? q.questions : []
    const questionCount = questions.length
    if (!questionCount) return

    totalQuestions = questionCount

    const results = Array.isArray(q.results) ? q.results : []
    results.forEach(r => {
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
  getAllTopics,
  getTopicById,
  updateProgress,
  getTopicProgress,
}
