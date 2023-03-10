import crypto from 'crypto'
import express from 'express'
import { Request } from 'express-serve-static-core'
import { ParsedQs } from 'qs'

const router = express.Router()

// Notification request headers
const TWITCH_MESSAGE_ID = 'Twitch-Eventsub-Message-Id'.toLowerCase()
const TWITCH_MESSAGE_TIMESTAMP =
  'Twitch-Eventsub-Message-Timestamp'.toLowerCase()
const TWITCH_MESSAGE_SIGNATURE =
  'Twitch-Eventsub-Message-Signature'.toLowerCase()
const MESSAGE_TYPE = 'Twitch-Eventsub-Message-Type'.toLowerCase()

// Notification message types
const MESSAGE_TYPE_VERIFICATION = 'webhook_callback_verification'
const MESSAGE_TYPE_NOTIFICATION = 'notification'
const MESSAGE_TYPE_REVOCATION = 'revocation'

// Prepend this string to the HMAC that's created from the message
const HMAC_PREFIX = 'sha256='

router.post('/eventsub', (req, res) => {
  const secret = getSecret()
  const message = getHmacMessage(req)
  const hmac = HMAC_PREFIX + getHmac(secret, message) // Signature to compare

  if (verifyMessage(hmac, req.headers[TWITCH_MESSAGE_SIGNATURE] as string)) {
    // Get JSON object from body, so you can process the message.
    const notification = JSON.parse(req.body)

    if (MESSAGE_TYPE_NOTIFICATION === req.headers[MESSAGE_TYPE]) {
      res.sendStatus(204)
      // TODO: Do something with the event's data.

      console.log(`Event type: ${notification.subscription.type}`)
      console.log(JSON.stringify(notification.event, null, 4))
    } else if (MESSAGE_TYPE_VERIFICATION === req.headers[MESSAGE_TYPE]) {
      res.status(200).send(notification.challenge)
    } else if (MESSAGE_TYPE_REVOCATION === req.headers[MESSAGE_TYPE]) {
      res.sendStatus(204)

      console.log(`${notification.subscription.type} notifications revoked!`)
      console.log(`reason: ${notification.subscription.status}`)
      console.log(
        `condition: ${JSON.stringify(
          notification.subscription.condition,
          null,
          4,
        )}`,
      )
    } else {
      res.sendStatus(204)
      console.log(`Unknown message type: ${req.headers[MESSAGE_TYPE]}`)
    }
  } else {
    res.sendStatus(403)
  }
})

function getSecret() {
  return process.env.TWITCH_EVENTSUB_SECRET
}

// Build the message used to get the HMAC.
function getHmacMessage(
  request: Request<object, any, any, ParsedQs, Record<string, any>>,
): string {
  return ((((request.headers[TWITCH_MESSAGE_ID] as string) +
    request.headers[TWITCH_MESSAGE_TIMESTAMP]) as string) +
    request.body) as string
}

// Get the HMAC.
function getHmac(secret: string, message: string) {
  return crypto.createHmac('sha256', secret).update(message).digest('hex')
}

// Verify whether our hash matches the hash that Twitch passed in the header.
function verifyMessage(hmac: string, verifySignature: string) {
  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(verifySignature))
}
