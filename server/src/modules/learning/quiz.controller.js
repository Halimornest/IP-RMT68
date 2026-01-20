const { saveQuiz, submitQuiz } = require('./quiz.service')
const aiService = require('../ai/ai.service')

const generateAndSaveQuiz = async (req, res, next) => {
  try {
    const { topicId, level, count } = req.body

    const quiz = await aiService.generateQuiz({
      topicId,
      level: level || 'beginner',
      count: count || 5,
    })

    const savedQuiz = await saveQuiz({
      topicId,
      level: level || 'beginner',
      quiz,
    })

    res.status(201).json({
      quizId: savedQuiz.id,
      topicId,
      level: savedQuiz.level,
      totalQuestions: quiz.length,
    })
  } catch (err) {
    next(err)
  }
}

const submitQuizAnswers = async (req, res, next) => {
  try {
    const { quizId, answers } = req.body
    const userId = req.user.id

    if (!quizId || !answers) {
      return res.status(400).json({ message: 'quizId and answers required' })
    }

    const result = await submitQuiz({
      quizId,
      userId,
      answers,
    })

    res.json(result)
  } catch (err) {
    next(err)
  }
}

async function explainQuestion(req, res, next) {
  try {
    const {
      question,
      options,
      correctOptionIndex,
      selectedOptionIndex,
      level,
    } = req.body

    const explanation = await aiService.generateExplanation({
      question,
      options,
      correctOptionIndex,
      selectedOptionIndex,
      level,
    })

    res.json({
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
