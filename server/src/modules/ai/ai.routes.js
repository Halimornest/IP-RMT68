const express = require('express')
const router = express.Router()
const aiController = require('./ai.controller')
const authMiddleware = require('../../middlewares/auth.middleware')

router.use(authMiddleware)

router.post('/ask', aiController.askAI)

module.exports = router
