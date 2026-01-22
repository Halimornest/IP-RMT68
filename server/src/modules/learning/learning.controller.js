const { successResponse } = require('../../utils/response')
const { requireUUID, requireFields } = require('../../utils/validation')
const ApiError = require('../../utils/ApiError')
const learningService = require('./learning.service')
const Topic = require('./topic.model')
const youtubeService = require('../../services/youtube.service')

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
    if (!topic) throw new ApiError(404, 'Topic not found')

    return successResponse(res, { topic })
  } catch (err) {
    next(err)
  }
}

async function updateProgress(req, res, next) {
  try {
    requireFields(['topicId', 'status'], req.body)

    const { topicId, status, lastAction } = req.body
    requireUUID(topicId, 'topicId')

    const progress = await learningService.updateProgress({
      userId: req.user.id,
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
    requireUUID(topicId, 'topicId')

    const progress = await learningService.getTopicProgress({
      userId: req.user.id,
      topicId,
    })

    return successResponse(res, progress)
  } catch (err) {
    next(err)
  }
}

async function getTopicVideos(req, res, next) {
  try {
    const { topicId } = req.params
    requireUUID(topicId, 'topicId')

    const topic = await Topic.findByPk(topicId)
    if (!topic) throw new ApiError(404, 'Topic not found')

    const videos = await youtubeService.searchVideos({
      query: `${topic.title} tutorial`,
      maxResults: 3,
    })

    return successResponse(res, {
      topicId,
      title: topic.title,
      videos,
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
  getTopicVideos,
}
