const express = require('express')
const router = express.Router()
const controller = require('./learning.controller')
const authMiddleware = require('../../middlewares/auth.middleware')
const { getProgress } = require('./progress.controller')

router.use(authMiddleware)

router.get('/topics', controller.getTopics)
router.get('/topics/:id', controller.getTopicDetail)
router.post('/progress', controller.updateProgress)
router.get('/progress/:topicId', authMiddleware, getProgress)

module.exports = router
