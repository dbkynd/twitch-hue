import { Document, Schema, model } from 'mongoose'

const schema = new Schema({
  twitchId: String,
  profile: Object,
  tokens: {
    twitch: {
      accessToken: String,
      refreshToken: String,
    },
    hue: {
      accessToken: String,
      refreshToken: String,
    },
  },
  bridgeUsername: String,
  updatedAt: Date,
  createdAt: { type: Date, default: new Date() },
})

export interface UserDoc extends Document {
  twitchId: string
  profile: UserProfile
  tokens: {
    twitch: Token
    hue: Token
  }
  bridgeUsername: string
  updatedAt: Date
  createdAt: Date
}

interface Token {
  accessToken: string
  refreshToken: string
}

export default model<UserDoc>('users', schema)
