const express = require('express')
const router = express.Router()

router.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      env: process.env.NODE_ENV || 'development',
    },
  })
})

router.use('/auth', require('../modules/auth/auth.routes'))
router.use('/ai', require('../modules/ai/ai.routes'))
router.use('/learning', require('../modules/learning/learning.routes'))
router.use('/quiz', require('../modules/learning/quiz.routes'))
router.use(
  '/progress',
  require('../modules/learning/progress.routes')
)

module.exports = router
