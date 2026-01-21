const aiService = require('./ai.service')
const { createTopics } = require('../learning/topic.service')
const { successResponse } = require('../../utils/response')
const { requireFields, requireUUID } = require('../../utils/validation')
const ApiError = require('../../utils/ApiError')
const retry = require('../../utils/retry')

async function askAI(req, res, next) {
  try {
    requireFields(['topicId', 'action'], req.body)
    const { topicId, action, level = 'beginner' } = req.body
    requireUUID(topicId, 'topicId')

    const answer = await aiService.runAI({ topicId, action, level })
    return successResponse(res, { answer })
  } catch (err) {
    next(err)
  }
}

async function generateLearningTopics(req, res, next) {
  try {
    requireFields(['subject'], req.body)
    const { subject, level = 'beginner' } = req.body

    const topics = await aiService.generateTopics({ subject, level })
    return successResponse(res, { subject, level, topics })
  } catch (err) {
    next(err)
  }
}

async function generateAndSaveTopics(req, res, next) {
  try {
    requireFields(['subject'], req.body)
    const { subject, level = 'beginner' } = req.body
    const userId = req.user.id

    const topics = await retry(
      () => aiService.generateTopics({ subject, level }),
      { retries: 3, delay: 1500 }
    )

    if (!Array.isArray(topics) || topics.length === 0) {
      throw new ApiError(500, 'AI failed to generate learning topics')
    }

    const savedTopics = await createTopics({
      topics,
      subject,
      level,
      userId,
    })

    return successResponse(
      res,
      {
        subject,
        level,
        count: savedTopics.length,
        topics: savedTopics,
      },
      201
    )
  } catch (err) {
    next(err)
  }
}

async function generateOutline(req, res, next) {
  try {
    requireFields(['topicId'], req.body)
    const { topicId, level = 'beginner' } = req.body
    requireUUID(topicId, 'topicId')

    const outline = await aiService.generateOutline({ topicId, level })
    return successResponse(res, { topicId, level, outline })
  } catch (err) {
    next(err)
  }
}

async function generateQuiz(req, res, next) {
  try {
    requireFields(['topicId'], req.body)
    const { topicId, level = 'beginner', count = 5 } = req.body
    requireUUID(topicId, 'topicId')

    const quiz = await aiService.generateQuiz({ topicId, level, count })
    if (!Array.isArray(quiz)) {
      throw new ApiError(500, 'Failed to generate quiz')
    }

    return successResponse(res, {
      topicId,
      level,
      totalQuestions: quiz.length,
      quiz,
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  askAI,
  generateLearningTopics,
  generateAndSaveTopics,
  generateOutline,
  generateQuiz,
}
