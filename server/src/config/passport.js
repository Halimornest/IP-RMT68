
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../modules/user/user.model')

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value
        if (!email) return done(new Error('No email from Google'), null)

        let user = await User.findOne({ where: { email } })

        if (!user) {
          user = await User.create({
            email,
            name: profile.displayName,
            provider: 'google',
            passwordHash: null,
          })
        }

        return done(null, user)
      } catch (err) {
        return done(err, null)
      }
    }
  )
)