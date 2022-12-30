import express from 'express'
import UserService from '../../lib/user'

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const user = await UserService.getUser(req.user)
    if (!user) return res.sendStatus(404)
    res.status(200).json(user)
  } catch (err) {
    next()
  }
})

/*router.put('/items', async (req, res, next) => {
  const { items }: { items: Items[] } = req.body
  if (!items) return res.status(400).json({ message: 'Missing items array' })
  try {
    await UserService.updateItems(req.user, items)
    res.sendStatus(204)
  } catch (e) {
    next(e)
  }
})

router.put('/options', async (req, res, next) => {
  const { options }: { options: Options } = req.body
  if (!options)
    return res.status(400).json({ message: 'Missing options object' })
  try {
    await UserService.updateOptions(req.user, options)
    res.sendStatus(204)
  } catch (e) {
    next(e)
  }
})*/

export default router
