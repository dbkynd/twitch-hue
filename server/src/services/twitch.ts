import twitchApi from '../axios/twitch_api'
import { UserDoc } from '../lib/user/user_model'

async function subscribe() {
  /*twitchApi.post(
    '/eventsub/subscriptions',
    {
      type: 'channel.channel_points_custom_reward_redemption.add',
      version: 1,
      condition: {
        broadcaster_user_id: '',
      },
      transport: {
        method: 'webhooks',
        callback: '',
        secret: '',
      },
    },
    {
      headers: {
        Authorization: 'Bearer ' + 'test',
        'Client-Id': '',
      },
    },
  )*/
}

export async function getRedemptions(user: UserDoc) {
  let id = user.twitchId
  id = '51533859' // TODO
  return twitchApi
    .get(`/channel_points/custom_rewards?broadcaster_id=${id}`, {
      headers: {
        Authorization: 'Bearer ' + process.env.TEMP_TOKEN, //+ user?.tokens.twitch.accessToken, // TODO
        'Client-ID': process.env.TEMP_CLIENT_ID, // TODO
      },
    })
    .then(({ data }) => data.data)
}
