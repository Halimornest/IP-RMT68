const express = require('express')
const router = express.Router()
const authMiddleware = require('../../middlewares/auth.middleware')
const {
  generateAndSaveQuiz,
  submitQuizAnswers,
} = require('./quiz.controller')
const { explainQuestion } = require('./quiz.controller')

router.use(authMiddleware)

router.post('/generate-and-save', generateAndSaveQuiz)
router.post('/submit', submitQuizAnswers)
router.post('/explain', authMiddleware, explainQuestion)

module.exports = router
