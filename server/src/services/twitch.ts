import axios from 'axios'

async function subscribe() {
  axios.post(
    'https://api.twitch.tv/helix/eventsub/subscriptions',
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
  )
}
