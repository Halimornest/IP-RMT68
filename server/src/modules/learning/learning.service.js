const Topic = require('./topic.model')
const UserProgress = require('./progress.model')

const getAllTopics = async () => {
  return Topic.findAll({ where: { isActive: true } })
}

const getTopicById = async (id) => {
  return Topic.findByPk(id)
}

const updateProgress = async ({ userId, topicId, status, lastAction }) => {
  const [progress] = await UserProgress.findOrCreate({
    where: { userId, topicId },
    defaults: { status, lastAction }
  })

  if (!progress.isNewRecord) {
    progress.status = status
    progress.lastAction = lastAction
    await progress.save()
  }

  return progress
}

module.exports = {
  getAllTopics,
  getTopicById,
  updateProgress
}
