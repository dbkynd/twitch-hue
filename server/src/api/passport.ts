import passport from 'passport'
import { Strategy as TwitchStrategy } from 'passport-twitch-new'
import hash from '../hash'
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
  const hue = user.tokens.hue
  const twitch = user.tokens.twitch
  if (hue.accessToken) hue.accessToken = hash.decrypt(hue.accessToken)
  if (hue.refreshToken) hue.refreshToken = hash.decrypt(hue.refreshToken)
  if (twitch.accessToken) twitch.accessToken = hash.decrypt(twitch.accessToken)
  if (twitch.refreshToken)
    twitch.refreshToken = hash.decrypt(twitch.refreshToken)
  if (user.bridgeUsername)
    user.bridgeUsername = hash.decrypt(user.bridgeUsername)
  done(null, user)
})

export default passport
