import { Server } from 'http'
import { HttpTerminator, createHttpTerminator } from 'http-terminator'
import app from './app'

let httpTerminator: HttpTerminator

export function start(): void {
  const server = new Server(app)
  const port = process.env.PORT || 3000
  httpTerminator = createHttpTerminator({ server })
  server.listen(port)
  console.log(`Listening on port ${port}`)
}

export async function stop(): Promise<void> {
  if (httpTerminator) await httpTerminator.terminate()
  console.log('Server connections closed')
}
