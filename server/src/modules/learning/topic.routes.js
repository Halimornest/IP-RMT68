const express = require('express')
const router = express.Router()

const {
  generateLearningTopics
} = require('./topic.controller')

const authMiddleware = require('../../middlewares/auth.middleware')

router.post(
  '/topics/generate',
  authMiddleware,
  generateLearningTopics
)

module.exports = router
