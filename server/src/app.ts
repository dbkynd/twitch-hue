import * as server from './api'
import * as database from './database'

export async function start(): Promise<void> {
  await database.connect()
  server.listen()
}

export async function stop(): Promise<void> {
  await database.disconnect()
}
