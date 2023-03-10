import crypto, { BinaryToTextEncoding } from 'crypto'
import axios, { AxiosError } from 'axios'
import hueApi from '../axios/hue_api'
import UserService from '../lib/user'
import { UserDoc } from '../lib/user/user_model'

const clientID = process.env.HUE_CLIENT_ID
const clientSecret = process.env.HUE_CLIENT_SECRET
const appID = process.env.HUE_APP_ID
const deviceID = 'twitch_hue_connector_remote'
const deviceName = ''

function getAuthorizationURL() {
  return `https://api.meethue.com/oauth2/auth?clientid=${clientID}&appid=${appID}&deviceid=${deviceID}&devicename=${deviceName}&response_type=code`
}

async function handleCallback(code: string): Promise<HueToken> {
  const url = `https://api.meethue.com/oauth2/token?grant_type=authorization_code&code=${code}`
  const authStr = await axios.post(url).catch((res: AxiosError) => {
    return getAuthString(res, 'token')
  })
  return axios
    .post(
      url,
      {},
      {
        headers: { Authorization: authStr as string },
      },
    )
    .then(({ data }) => data)
}

async function refreshToken(token: string): Promise<HueToken> {
  const url = 'https://api.meethue.com/oauth2/refresh?grant_type=refresh_token'
  const authStr = await axios.post(url).catch((res) => {
    return getAuthString(res, 'refresh')
  })
  return axios
    .post(
      url,
      { refresh_token: token },
      {
        headers: { Authorization: authStr as string },
      },
    )
    .then(({ data }) => data)
}

function getAuthString(res: AxiosError, type: 'token' | 'refresh'): string {
  if (res.response?.status !== 401) {
    throw new Error('Invalid code or state')
  }
  if (!res.response.headers['www-authenticate']) {
    throw new Error(
      'Unexpected error: www-authenticate headers not included in response',
    )
  }

  const [digestRealmStr, nonceStr] = res.response.headers['www-authenticate']
    .replace(/"/g, '')
    .split(',')
  const [, digestRealm] = digestRealmStr.split('=')
  const [, nonce] = nonceStr.split('=')

  const hash1 = md5(`${clientID}:${digestRealm}:${clientSecret}`)
  const hash2 = md5('POST:/oauth2/token')
  const response = md5(`${hash1}:${nonce}:${hash2}`)
  return `Digest username="${clientID}", realm="${digestRealm}", nonce="${nonce}", uri="/oauth2/${type}", response="${response}"`
}

function md5(str: string) {
  return hash(str, 'md5', 'hex')
}

function hash(
  str: string,
  algorithm: string,
  outEncoding: BinaryToTextEncoding,
) {
  const hash = crypto.createHash(algorithm)
  hash.update(str)
  return hash.digest(outEncoding || 'base64')
}

async function getLights(user: UserDoc) {
  return hueApi
    .get(`/bridge/${user.bridgeUsername}/lights`, {
      headers: {
        Authorization: 'Bearer ' + user.tokens.hue.accessToken,
      },
    })
    .then(({ data }) => data)
}

async function createUser(user: UserDoc) {
  await hueApi.put(
    '/bridge/0/config',
    { linkbutton: true },
    {
      headers: {
        Authorization: 'Bearer ' + user.tokens.hue.accessToken,
      },
    },
  )
  const username = await hueApi
    .post(
      '/bridge',
      {
        devicetype: 'twitch_hue_remote',
      },
      {
        headers: {
          Authorization: 'Bearer ' + user.tokens.hue.accessToken,
        },
      },
    )
    .then(({ data }) => data[0].success.username)
  await UserService.setBridgeUsername(user.twitchId, username)
}

export default {
  getAuthorizationURL,
  handleCallback,
  getLights,
  createUser,
  refreshToken,
}
