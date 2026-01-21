const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/auth.middleware')

router.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      env: process.env.NODE_ENV || 'development',
    },
  })
})

router.get('/protected', authMiddleware, (req, res) => {
  res.json({
    success: true,
    data: {
      message: 'You are authenticated',
      user: req.user,
    },
  })
})

router.use('/auth', require('../modules/auth/auth.routes'))
router.use('/ai', require('../modules/ai/ai.routes'))
router.use('/learning', require('../modules/learning/learning.routes'))
router.use('/quiz', require('../modules/learning/quiz.routes'))

module.exports = router
