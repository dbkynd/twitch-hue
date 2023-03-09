import express from 'express'
import passport from 'passport'
import { appUrl } from '../../config'
import HueService from '../../services/hue'
import User from '../../lib/user'

const router = express.Router()

router.get('/twitch', passport.authenticate('twitch'))

router.get(
  '/twitch/callback',
  passport.authenticate('twitch', {
    successRedirect: `${appUrl}/home`,
    failureRedirect: `${appUrl}/error`,
  }),
)

router.get('/hue', (req, res, next) => {
  const url = HueService.getAuthorizationURL()
  res.redirect(url)
})

router.get('/hue/callback', async (req, res, next) => {
  try {
    const { code } = req.query
    const tokenData: HueToken = await HueService.handleCallback(code as string)
    await User.setHueToken(req.user, tokenData)
    res.redirect(`${appUrl}/home`)
  } catch (e) {
    next(e)
  }
})

router.get('/logout', (req, res, next) => {
  req.session.destroy(function () {
    res.sendStatus(204)
  })
})

export default router
