import * as server from './api'
import * as database from './database'

export async function start(): Promise<void> {
  await database.connect()
  server.start()
}

export async function stop(): Promise<void> {
  const shutdownSequence = [server.stop, database.disconnect]

  for (let i = 0; i < shutdownSequence.length; i++) {
    try {
      await shutdownSequence[i]()
    } catch (e) {
      console.error(e)
    }
  }
}
