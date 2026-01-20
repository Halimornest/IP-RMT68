const express = require('express')
const router = express.Router()
const controller = require('./learning.controller')
const authMiddleware = require('../../middlewares/auth.middleware')

router.use(authMiddleware)

router.get('/topics', controller.getTopics)
router.get('/topics/:id', controller.getTopicDetail)
router.post('/progress', controller.updateProgress)

module.exports = router
