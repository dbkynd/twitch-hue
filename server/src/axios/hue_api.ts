import axios from 'axios'
import UserService from '../lib/user'
import HueService from '../services/hue'

const hueApiInstance = axios.create({
  baseURL: 'https://api.meethue.com',
})

// Response interceptor for API calls
hueApiInstance.interceptors.response.use(
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
      return hueApiInstance(originalRequest)
    }
    return Promise.reject(error)
  },
)

async function refreshAccessToken(authHeader: string): Promise<string | null> {
  const accessToken = authHeader.split(' ')[1]
  const user = await UserService.findUserByHueAccessToken(accessToken)
  if (!user) return null
  const refreshToken = user.tokens.hue.refreshToken
  const response: HueToken = await HueService.refreshToken(refreshToken)
  await UserService.setHueToken(user.twitchId, response)
  return response.access_token
}

export default hueApiInstance
