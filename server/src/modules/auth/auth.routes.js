const express = require('express')
const router = express.Router()
const authMiddleware = require('../../middlewares/auth.middleware')
const { login, me } = require('./auth.controller')

router.post('/login', login)
router.get('/me', authMiddleware, me)

module.exports = router
