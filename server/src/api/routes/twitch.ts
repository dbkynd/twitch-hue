import express from 'express'
import * as TwitchService from '../../services/twitch'

const router = express.Router()

router.get('/redemptions', async (req, res, next) => {
  try {
    const redemptions = await TwitchService.getRedemptions(req.user)
    res.status(200).json(redemptions)
  } catch (e) {
    next(e)
  }
})

export default router
