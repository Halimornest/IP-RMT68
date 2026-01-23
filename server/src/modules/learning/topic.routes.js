const express = require('express')
const router = express.Router()

const {
  generateLearningTopics,
  deleteTopic,
} = require('./topic.controller')

const authMiddleware = require('../../middlewares/auth.middleware')

router.post(
  '/generate',
  authMiddleware,
  generateLearningTopics
)

router.delete(
  '/:id',
  authMiddleware,
  deleteTopic
)

module.exports = router
