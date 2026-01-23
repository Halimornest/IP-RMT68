const express = require('express')
const router = express.Router()
const authMiddleware = require('../../middlewares/auth.middleware')
const controller = require('./progress.controller')

router.use(authMiddleware)

router.get('/my', controller.getMyProgress)
router.get('/topic/:topicId', controller.getProgress)
router.get('/history/:topicId', controller.getHistory)

module.exports = router
