const Topic = require('./topic.model')
const Quiz = require('./quiz.model')
const QuizResult = require('./quiz-result.model')
const ApiError = require('../../utils/ApiError')

async function createTopics({ topics, subject, level, userId }) {
  const data = topics.map(title => ({
    title,
    subject,
    level,
    userId,
  }))

  return Topic.bulkCreate(data, { returning: true })
}

async function getAllTopics() {
  return Topic.findAll({
    order: [['created_at', 'DESC']],
  })
}

async function getTopicById(id) {
  return Topic.findByPk(id)
}

async function deleteTopicById({ topicId, userId }) {
  const topic = await Topic.findByPk(topicId)
  if (!topic) return false

  if (topic.userId !== userId) {
    throw new ApiError(403, 'Forbidden')
  }

  const quizzes = await Quiz.findAll({
    where: { topicId },
  })

  const quizIds = quizzes.map(q => q.id)

  if (quizIds.length > 0) {
    await QuizResult.destroy({
      where: { quizId: quizIds },
    })
    await Quiz.destroy({
      where: { topicId },
    })
  }

  await Topic.destroy({
    where: { id: topicId },
  })

  return true
}

module.exports = {
  createTopics,
  getAllTopics,
  getTopicById,
  deleteTopicById,
}

