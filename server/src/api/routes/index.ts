import express from 'express'
import AuthRoutes from './auth'
import userAuth from '../middleware/userAuth'
import UserRoutes from './user'

const router = express.Router()

router.use('/auth', AuthRoutes)
router.use(userAuth)
router.use('/user', UserRoutes)

export default router
