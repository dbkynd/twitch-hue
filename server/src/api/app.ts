import express from 'express'
import AuthRoutes from './routes/auth'
import UserRoutes from './routes/user'

const router = express.Router()

router.use('/auth', AuthRoutes)

router.use((req, res, next) => {
  if (!req.user) return res.sendStatus(401)
  next()
})

router.use('/user', UserRoutes)

export default router
