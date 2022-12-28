import * as app from './app'
import consola from './consola'

consola.info('Application starting...')

app.start().catch((err) => {
  consola.error(err.message)
  process.exit(1)
})

const signals: NodeJS.Signals[] = ['SIGHUP', 'SIGINT', 'SIGTERM']

signals.forEach((signal) => {
  process.on(signal, () => {
    shutdown(signal)
  })
})

const shutdown = (signal: NodeJS.Signals) => {
  consola.info(`Received a ${signal} signal. Attempting graceful shutdown...`)
  app.stop().finally(() => {
    consola.info(`Shutdown completed. Exiting.`)
    process.exit(0)
  })
}
