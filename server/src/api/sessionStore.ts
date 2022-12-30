import MongoStore from 'connect-mongo'
import session, { SessionOptions } from 'express-session'
import { mongoUrl } from '../config'
import app from './app'

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

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  if (sessionOptions.cookie) sessionOptions.cookie.secure = true // serve secure cookies
}

export default session(sessionOptions)
