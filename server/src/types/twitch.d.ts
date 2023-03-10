interface TwitchProfile {
  id: string
  login: string
  display_name: string
  type: string
  broadcaster_type: string
  description: string
  profile_image_url: string
  offline_image_url: string
  view_count: number
  created_at: string
  provider: 'twitch'
}

interface TwitchTokenRefresh {
  access_token: string
  refresh_token: string
  scope: string[]
  token_type: 'bearer'
}
