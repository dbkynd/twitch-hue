import User, { UserDoc } from './user_model'

async function getUser(twitchId: string): Promise<UserDoc | null> {
  return User.findOne({ twitchId })
}

async function findUserByTwitchAccessToken(accessToken: string) {
  return User.findOne({ 'tokens.twitch.accessToken': accessToken })
}

async function findUserByHueAccessToken(accessToken: string) {
  return User.findOne({ 'tokens.hue.accessToken': accessToken })
}

function updateSession(
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
      updatedAt: new Date(),
    },
    { upsert: true, new: true },
    (err, user) => {
      done(err, user.twitchId)
    },
  )
}

async function setTwitchToken(twitchId: string, newToken: TwitchTokenRefresh) {
  await User.findOneAndUpdate(
    { twitchId },
    {
      'tokens.twitch.accessToken': newToken.access_token,
      'tokens.twitch.refreshToken': newToken.refresh_token,
      updatedAt: new Date(),
    },
    { upsert: true, new: true },
  )
}

async function setHueToken(twitchId: string, tokenData: HueToken) {
  await User.findOneAndUpdate(
    { twitchId },
    {
      'tokens.hue.accessToken': tokenData.access_token,
      'tokens.hue.refreshToken': tokenData.refresh_token,
      updatedAt: new Date(),
    },
    { upsert: true, new: true },
  )
}

async function setBridgeUsername(twitchId: string, username: string) {
  await User.findOneAndUpdate(
    { twitchId },
    {
      bridgeUsername: username,
      updatedAt: new Date(),
    },
    { upsert: true, new: true },
  )
}

export default {
  getUser,
  updateSession,
  setTwitchToken,
  setHueToken,
  setBridgeUsername,
  findUserByTwitchAccessToken,
  findUserByHueAccessToken,
}
