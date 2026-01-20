const express = require('express')
const router = express.Router()
const { generateOutline } = require('./ai.controller')
const authMiddleware = require('../../middlewares/auth.middleware')
const {
  askAI,
  generateLearningTopics,
  generateAndSaveTopics,
} = require('./ai.controller')
const { generateQuiz } = require('./ai.controller')

router.use(authMiddleware)

router.post('/ask', askAI)
router.post('/generate-topic', generateLearningTopics)
router.post('/generate-topic-and-save', generateAndSaveTopics)
router.post('/generate-outline', generateOutline)
router.post('/generate-quiz', generateQuiz)

module.exports = router
