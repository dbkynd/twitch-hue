import axios from 'axios'
import UserService from '../lib/user'

const twitchApiInstance = axios.create({
  baseURL: 'https://api.twitch.tv/helix',
})

// Response interceptor for API calls
twitchApiInstance.interceptors.response.use(
  (response) => {
    return response
  },
  async function (error) {
    const originalRequest = error.config
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true
      const accessToken = await refreshAccessToken(
        originalRequest.headers['Authorization'],
      )
      if (!accessToken) return Promise.reject(error)
      originalRequest.headers['Authorization'] = 'Bearer ' + accessToken
      return twitchApiInstance(originalRequest)
    }
    return Promise.reject(error)
  },
)

async function refreshAccessToken(authHeader: string): Promise<string | null> {
  const accessToken = authHeader.split(' ')[1]
  const user = await UserService.findUserByTwitchAccessToken(accessToken)
  if (!user) return null
  const refreshToken = user.tokens.twitch.refreshToken
  const response: TwitchTokenRefresh = await axios
    .post('https://id.twitch.tv/oauth2/token', {
      client_id: process.env.TWITCH_CLIENT_ID,
      client_secret: process.env.TWITCH_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: encodeURI(refreshToken),
    })
    .then(({ data }) => data)
  await UserService.setTwitchToken(user.twitchId, response)
  return response.access_token
}

export default twitchApiInstance
