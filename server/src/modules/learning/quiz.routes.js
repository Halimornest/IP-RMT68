const express = require('express')
const router = express.Router()
const authMiddleware = require('../../middlewares/auth.middleware')
const controller = require('./quiz.controller')

router.use(authMiddleware)

router.post('/generate-and-save', controller.generateAndSaveQuiz)
router.post('/submit', controller.submitQuizAnswers)
router.post('/explain', controller.explainQuestion)
router.get('/history/:topicId', controller.getQuizHistory)

module.exports = router
