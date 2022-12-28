import User, { UserDoc } from './user_model'

async function getUser(twitchId: string): Promise<UserDoc | null> {
  return User.findOne({ twitchId })
}

function session(
  accessToken: string,
  refreshToken: string,
  params: any,
  profile: UserProfile,
  done: any,
): void {
  User.findOneAndUpdate(
    { twitchId: profile.id },
    {
      profile,
      'tokens.twitch.accessToken': accessToken,
      'tokens.twitch.refreshToken': refreshToken,
      'tokens.twitch.expiresAt': new Date().valueOf() + params.expires_in * 1000,
      updatedAt: new Date(),
    },
    { upsert: true, new: true },
    (err, user) => {
      done(err, user)
    },
  )
}

export default {
  getUser,
  session,
}
