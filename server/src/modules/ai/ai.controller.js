const aiService = require('./ai.service')
const { createTopics } = require('../learning/topic.service')

const askAI = async (req, res, next) => {
  try {
    const { topicId, action, level } = req.body

    const result = await aiService.runAI({
      topicId,
      action,
      level,
    })

    res.json({
      answer: result,
    })
  } catch (err) {
    next(err)
  }
}

const generateLearningTopics = async (req, res, next) => {
  try {
    const { subject, level } = req.body

    if (!subject) {
      return res.status(400).json({
        message: 'subject is required',
      })
    }

    const topics = await aiService.generateTopics({
      subject,
      level: level || 'beginner',
    })

    res.json({
      subject,
      level: level || 'beginner',
      topics,
    })
  } catch (err) {
    next(err)
  }
}

const generateAndSaveTopics = async (req, res, next) => {
  try {
    const { subject, level } = req.body
    const userId = req.user.id

    if (!subject) {
      return res.status(400).json({ message: 'subject is required' })
    }

    const topics = await aiService.generateTopics({
      subject,
      level: level || 'beginner',
    })

    const savedTopics = await createTopics({
      topics,
      subject,
      level: level || 'beginner',
      userId,
    })

    res.status(201).json({
      subject,
      level: level || 'beginner',
      count: savedTopics.length,
      topics: savedTopics,
    })
  } catch (err) {
    next(err)
  }
}

const generateOutline = async (req, res, next) => {
  try {
    const { topicId, level } = req.body

    if (!topicId) {
      return res.status(400).json({ message: 'topicId is required' })
    }

    const outline = await aiService.generateOutline({
      topicId,
      level: level || 'beginner',
    })

    res.json({
      topicId,
      level: level || 'beginner',
      outline,
    })
  } catch (err) {
    next(err)
  }
}

const generateQuiz = async (req, res, next) => {
  try {
    const { topicId, level, count } = req.body

    if (!topicId) {
      return res.status(400).json({ message: 'topicId is required' })
    }

    const quiz = await aiService.generateQuiz({
      topicId,
      level: level || 'beginner',
      count: count || 5,
    })

    res.json({
      topicId,
      level: level || 'beginner',
      count: quiz.length,
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

