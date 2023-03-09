import express from 'express'
import AuthRoutes from './auth'
import userAuth from '../middleware/userAuth'
import UserRoutes from './user'
import UserService from '../../lib/user'
import axios from 'axios'

const router = express.Router()

router.use('/auth', AuthRoutes)
router.use(userAuth)
router.use('/user', UserRoutes)

router.get('/hue/connected', async (req, res, next) => {
  try {
    const user = await UserService.getUser(req.user)
    const hasToken = Boolean(user?.tokens.hue.accessToken)
    res.status(200).json({ connected: hasToken })
  } catch (e) {
    next(e)
  }
})

router.get('/hue/bridge', async (req, res, next) => {
  try {
    const user = await UserService.getUser(req.user)
    const hasBridge = Boolean(user?.bridgeUsername)
    res.status(200).json({ connected: hasBridge })
  } catch (e) {
    next(e)
  }
})

router.post('/hue/user/create', async (req, res, next) => {
  try {
    const user = await UserService.getUser(req.user)
    await axios.put(
      'https://api.meethue.com/bridge/0/config',
      { linkbutton: true },
      {
        headers: {
          Authorization: 'Bearer ' + user?.tokens.hue.accessToken,
        },
      },
    )
    const username = await axios
      .post(
        'https://api.meethue.com/bridge/',
        {
          devicetype: 'twitch_hue_remote',
        },
        {
          headers: {
            Authorization: 'Bearer ' + user?.tokens.hue.accessToken,
          },
        },
      )
      .then(({ data }) => data[0].success.username)
    await UserService.setBridgeUsername(req.user, username)
    res.status(204)
  } catch (e) {
    next(e)
  }
})

router.get('/hue/lights', async (req, res, next) => {
  try {
    const user = await UserService.getUser(req.user)
    const lights = await axios
      .get(`https://api.meethue.com/bridge/${user?.bridgeUsername}/lights`, {
        headers: {
          Authorization: 'Bearer ' + user?.tokens.hue.accessToken,
        },
      })
      .then(({ data }) => data)
    res.status(200).json(lights)
  } catch (e) {
    next(e)
  }
})

router.get('/twitch/redemptions', async (req, res, next) => {
  try {
    const user = await UserService.getUser(req.user)
    const redemptions = await axios(
      'https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=51533859',
      {
        headers: {
          Authorization: 'Bearer ' + process.env.TEMP_TOKEN, //+ user?.tokens.twitch.accessToken,
          'Client-ID': process.env.TEMP_CLIENT_ID,
        },
      },
    ).then(({ data }) => data.data)
    res.status(200).json(redemptions)
  } catch (e) {
    next(e)
  }
})
export default router
