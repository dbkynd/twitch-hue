import express from 'express'
import passport from 'passport'
import { Strategy as TwitchStrategy } from 'passport-twitch-new'
import UserService from '../lib/user'

const app = express()

app.use(passport.initialize())
app.use(passport.session())

passport.use(
  new TwitchStrategy(
    {
      clientID: process.env.TWITCH_CLIENT_ID,
      clientSecret: process.env.TWITCH_CLIENT_SECRET,
      callbackURL: process.env.TWITCH_CALLBACK_URL,
      scope: 'channel:read:redemptions',
    },
    (
      accessToken: string,
      refreshToken: string,
      params: any,
      profile: UserProfile,
      done: any,
    ) => {
      UserService.session(accessToken, refreshToken, params, profile, done)
    },
  ),
)

passport.serializeUser((user, done) => {
  done(null, user.twitchId)
})

passport.deserializeUser((user: Express.User, done) => {
  done(null, user)
})

export default app
