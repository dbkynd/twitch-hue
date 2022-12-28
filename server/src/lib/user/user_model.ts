import { Document, Schema, model } from 'mongoose'

const schema = new Schema({
  twitchId: String,
  profile: Object,
  tokens: {
    twitch: {
      accessToken: String,
      refreshToken: String,
      expiresAt: Date,
    },
    hue: {
      accessToken: String,
      refreshToken: String,
      expiresAt: Date,
    },
  },
  updatedAt: Date,
  createdAt: { type: Date, default: new Date() },
})

export interface UserDoc extends Document {
  twitchId: string
  tokens: {
    twitch: Token
    hue: Token
  }
  updatedAt: Date
  createdAt: Date
}

interface Token {
  accessToken: string
  refreshToken: string
  expiresAt: string
}

export default model<UserDoc>('users', schema)
