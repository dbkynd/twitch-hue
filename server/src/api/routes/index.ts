import express from 'express'
import userAuth from '../middleware/userAuth'
import AuthRoutes from './auth'
import HueRoutes from './hue'
import TwitchRoutes from './twitch'
import UserRoutes from './user'

const router = express.Router()

router.use('/auth', AuthRoutes)
router.use(userAuth)
router.use((req, res, next) => {
  console.log(req.user)
  next()
})
router.use('/user', UserRoutes)
router.use('/twitch', TwitchRoutes)
router.use('/hue', HueRoutes)

export default router
