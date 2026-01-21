const { successResponse } = require('../../utils/response')
const { requireUUID, requireFields } = require('../../utils/validation')
const ApiError = require('../../utils/ApiError')
const learningService = require('./learning.service')

async function getTopics(req, res, next) {
  try {
    const topics = await learningService.getAllTopics()
    return successResponse(res, { topics })
  } catch (err) {
    next(err)
  }
}

async function getTopicDetail(req, res, next) {
  try {
    const { id } = req.params
    requireUUID(id, 'topicId')

    const topic = await learningService.getTopicById(id)
    if (!topic) {
      throw new ApiError(404, 'Topic not found')
    }

    return successResponse(res, { topic })
  } catch (err) {
    next(err)
  }
}

async function updateProgress(req, res, next) {
  try {
    requireFields(['topicId', 'status'], req.body)

    const { topicId, status, lastAction } = req.body
    const userId = req.user.id

    requireUUID(topicId, 'topicId')

    const progress = await learningService.updateProgress({
      userId,
      topicId,
      status,
      lastAction,
    })

    return successResponse(res, { progress })
  } catch (err) {
    next(err)
  }
}

async function getProgress(req, res, next) {
  try {
    const { topicId } = req.params
    const userId = req.user.id

    requireUUID(topicId, 'topicId')

    const progress = await learningService.getTopicProgress({
      userId,
      topicId,
    })

    const status =
      progress.mastery >= 80 ? 'completed' : 'in-progress'

    return successResponse(res, {
      ...progress,
      status,
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getTopics,
  getTopicDetail,
  updateProgress,
  getProgress,
}
