import express from 'express'
import morgan from 'morgan'
import passport from './passport'
import Api from './routes'
import sessionStore from './sessionStore'

const app = express()

app.use(express.json())

const format = process.env.NODE_ENV === 'production' ? 'combined' : 'dev'
if (process.env.NODE_ENV === 'development') {
  app.use(morgan(format))
}

app.use(sessionStore)
app.use(passport.initialize())
app.use(passport.session())

app.use('/api', Api)

app.use((req, res, next) => {
  res.sendStatus(404)
})

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    res.sendStatus(500)
  },
)

export default app
