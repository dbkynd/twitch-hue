import passport from 'passport'
import { Strategy as TwitchStrategy } from 'passport-twitch-new'
import UserService from '../lib/user'

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
      UserService.updateSession(
        accessToken,
        refreshToken,
        params,
        profile,
        done,
      )
    },
  ),
)

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser(async (userId: string, done) => {
  const user = await UserService.getUser(userId)
  if (!user) {
    done(new Error('User Not Found'), null)
    return
  }
  done(null, user)
})

export default passport
