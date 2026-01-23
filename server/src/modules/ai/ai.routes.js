const express = require('express')
const router = express.Router()
const authMiddleware = require('../../middlewares/auth.middleware')
const controller = require('./ai.controller')

router.use(authMiddleware)

router.post('/ask', controller.askAI)

router.post(
  '/generate-and-save-topics',
  controller.generateAndSaveTopics
)

router.post('/generate-topic', controller.generateLearningTopics)
router.post('/generate-outline', controller.generateOutline)
router.post('/generate-quiz', controller.generateQuiz)

module.exports = router
