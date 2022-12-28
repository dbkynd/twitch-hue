import { Document, Schema, model } from 'mongoose'

const schema = new Schema({
  twitchId: String,
  profile: Object,
  updatedAt: Date,
  createdAt: { type: Date, default: new Date() },
})

export interface UserDoc extends Document {
  twitchId: string
  profile: UserProfile
  updatedAt: Date
  createdAt: Date
}

export default model<UserDoc>('users', schema)
