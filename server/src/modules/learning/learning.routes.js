const express = require('express')
const router = express.Router()
const authMiddleware = require('../../middlewares/auth.middleware')
const controller = require('./learning.controller')

router.use(authMiddleware)

router.get('/topics', controller.getTopics)
router.get('/topics/:id', controller.getTopicDetail)
router.post('/progress', controller.updateProgress)
router.get('/progress/:topicId', controller.getProgress)

module.exports = router
