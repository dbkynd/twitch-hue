import MongoStore from 'connect-mongo'
import cors from 'cors'
import express from 'express'
import session, { SessionOptions } from 'express-session'
import helmet from 'helmet'
import morgan from 'morgan'
import { appUrl, mongoUrl } from '../config'
import consola from '../consola'
import App from './app'
import passport from './passport'
import bodyParser from 'body-parser'

const app = express()

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(helmet())
app.use(
  cors({
    origin: appUrl,
    credentials: true,
  }),
)

const sessionOptions: SessionOptions = {
  name: 'sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
  },
  store: MongoStore.create({ mongoUrl }),
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  if (sessionOptions.cookie) sessionOptions.cookie.secure = true // serve secure cookies
}

app.use(session(sessionOptions))

app.use(passport)

app.use(App)

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

export function listen(): void {
  app.listen(3000)
  consola.success({ message: 'Listening on port: 3000', badge: true })
}
