const express = require('express')
const router = express.Router()

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

router.use('/auth', require('../modules/auth/auth.routes'))
router.use('/ai', require('../modules/ai/ai.routes'))

router.use('/learning', require('../modules/learning/learning.routes'))
router.use('/quiz', require('../modules/learning/quiz.routes'))
router.use('/progress', require('../modules/learning/progress.routes'))

router.use('/topics', require('../modules/learning/topic.routes')) // ✅ PENTING

module.exports = router
