import express from 'express'
import HueService from '../../services/hue'

const router = express.Router()

router.get('/status', async (req, res, next) => {
  try {
    const hasToken = Boolean(req.user?.tokens.hue.accessToken)
    const hasBridge = Boolean(req.user?.bridgeUsername)
    res.status(200).json({ hasToken, hasBridge })
  } catch (e) {
    next(e)
  }
})

router.post('/user/create', async (req, res, next) => {
  try {
    await HueService.createUser(req.user)
    res.sendStatus(204)
  } catch (e) {
    next(e)
  }
})

router.get('/lights', async (req, res, next) => {
  try {
    const lights = await HueService.getLights(req.user)
    res.status(200).json(lights)
  } catch (e) {
    next(e)
  }
})

export default router
