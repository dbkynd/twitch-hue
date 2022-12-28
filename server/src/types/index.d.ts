interface UserProfile {
  id: string
  login: string
  display_name: string
  type: string
  broadcaster_type: string
  description: string
  profile_image_url: string
  offline_image_url: string
  view_count: number
  email: string
  created_at: string
  provider: 'twitch'
}

interface Items {
  name: string
  value: [number, number]
  uuid: string
  device?: string | null
}

interface Options {
  multi: boolean
}
