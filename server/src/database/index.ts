import mongoose, { MongooseOptions } from 'mongoose'
import { mongoUrl } from '../config'
import consola from '../consola'

mongoose.set('strictQuery', false)

const options: MongooseOptions = {}

export async function connect(url?: string): Promise<void> {
  const address = url || mongoUrl
  const server =
    address.match(/mongodb(\+srv)?:\/\/(.*:.*@)?(.*)(:\d+|\/.*)/) || []
  return mongoose.connect(address, options).then(() => {
    consola.success(`Connected to MongoDB: '${server[3]}'`)
  })
}

export async function disconnect(): Promise<void> {
  await mongoose.disconnect()
  consola.success('Disconnected from the MongoDB')
}
