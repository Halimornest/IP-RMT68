const express = require('express')
const router = express.Router()
const authMiddleware = require('../../middlewares/auth.middleware')
const controller = require('./auth.controller')
const passport = require('passport')

router.post('/login', controller.login)
router.post('/register', controller.register)
router.get('/me', authMiddleware, controller.me)

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
)  

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login`,
  }),
  controller.googleCallback
)

module.exports = router
