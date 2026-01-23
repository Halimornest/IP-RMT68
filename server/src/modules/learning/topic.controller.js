const {
  generateTopics
} = require('./topic-generator.service')
const { deleteTopicById } = require('./topic.service')
const ApiError = require('../../utils/ApiError')
const { requireUUID } = require('../../utils/validation')

const generateLearningTopics = async (req, res, next) => {
  try {
    const { subject, level } = req.body

    if (!subject || !level) {
      throw new ApiError(400, 'subject and level are required')
    }

    const topics = await generateTopics({ subject, level })

    res.status(201).json({ topics })
  } catch (err) {
    next(err)
  }
}

const deleteTopic = async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    requireUUID(id, 'topicId')

    const deleted = await deleteTopicById({
      topicId: id,
      userId,
    })

    if (!deleted) {
      throw new ApiError(404, 'Topic not found')
    }

    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  generateLearningTopics,
  deleteTopic,
}
