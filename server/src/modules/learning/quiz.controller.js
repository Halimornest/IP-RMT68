const { saveQuiz, submitQuiz } = require('./quiz.service')
const aiService = require('../ai/ai.service')

const { successResponse } = require('../../utils/response')
const { requireFields, requireUUID } = require('../../utils/validation')
const ApiError = require('../../utils/ApiError')

const generateAndSaveQuiz = async (req, res, next) => {
  try {
    requireFields(['topicId'], req.body)

    const { topicId, level = 'beginner', count = 5 } = req.body

    requireUUID(topicId, 'topicId')

    const quiz = await aiService.generateQuiz({
      topicId,
      level,
      count,
    })

    if (!Array.isArray(quiz) || quiz.length === 0) {
      throw new ApiError(500, 'Failed to generate quiz')
    }

    const savedQuiz = await saveQuiz({
      topicId,
      level,
      quiz,
    })

    return successResponse(
      res,
      {
        quizId: savedQuiz.id,
        topicId,
        level: savedQuiz.level,
        totalQuestions: quiz.length,
        quiz, 
      },
      201
    )
  } catch (err) {
    next(err)
  }
}

const submitQuizAnswers = async (req, res, next) => {
  try {
    requireFields(['quizId', 'answers'], req.body)

    const { quizId, answers } = req.body
    const userId = req.user.id

    requireUUID(quizId, 'quizId')

    if (!Array.isArray(answers)) {
      throw new ApiError(400, 'answers must be an array')
    }

    const result = await submitQuiz({
      quizId,
      userId,
      answers,
    })

    return successResponse(res, result)
  } catch (err) {
    next(err)
  }
}

async function explainQuestion(req, res, next) {
  try {
    requireFields(
      [
        'question',
        'options',
        'correctOptionIndex',
        'selectedOptionIndex',
      ],
      req.body
    )

    const {
      question,
      options,
      correctOptionIndex,
      selectedOptionIndex,
      level = 'beginner',
    } = req.body

    if (!Array.isArray(options)) {
      throw new ApiError(400, 'options must be an array')
    }

    const explanation = await aiService.generateExplanation({
      question,
      options,
      correctOptionIndex,
      selectedOptionIndex,
      level,
    })

    return successResponse(res, {
      explanation,
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  generateAndSaveQuiz,
  submitQuizAnswers,
  explainQuestion,
}
