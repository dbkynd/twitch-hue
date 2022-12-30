import express from 'express'
import passport from 'passport'
import { appUrl } from '../../config'
import HueService from '../../services/hue'

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
    const data = await HueService.handleCallback(code as string)
    console.log(data)
    res.redirect(appUrl)
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
