const express = require('express')
const router = express.Router()

const authRoutes = require('./modules/auth/auth.routes')
const aiRoutes = require('./modules/ai/ai.routes')
const learningRoutes = require('./modules/learning/topic.routes')

router.use('/auth', authRoutes)
router.use('/learning', learningRoutes)
router.use('/ai', aiRoutes)
router.use('/learning', learningRoutes)

module.exports = router
