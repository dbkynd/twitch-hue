import User, { UserDoc } from './user_model'

async function getUser(twitchId: string): Promise<UserDoc | null> {
  return User.findOne({ twitchId })
}

function session(profile: UserProfile, done: any): void {
  User.findOneAndUpdate(
    { twitchId: profile.id },
    { profile, updatedAt: new Date() },
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
