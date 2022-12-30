import axios from 'axios'
import crypto, { BinaryToTextEncoding } from 'crypto'

const clientID = process.env.HUE_CLIENT_ID
const clientSecret = process.env.HUE_CLIENT_SECRET
const appID = process.env.HUE_APP_ID
const deviceID = 'twitch_hue_connector_remote'
const deviceName = ''

const tokenURL =
  'https://api.meethue.com/oauth2/token?grant_type=authorization_code'

function getAuthorizationURL() {
  return `https://api.meethue.com/oauth2/auth?clientid=${clientID}&appid=${appID}&deviceid=${deviceID}&devicename=${deviceName}&response_type=code`
}

async function handleCallback(code: string) {
  console.log(code) // xWxB7voT
  const authStr = await axios
    .post(
      `https://api.meethue.com/oauth2/token?grant_type=authorization_code&code=${code}`,
    )
    .catch((res) => {
      if (res.response.status !== 401) {
        throw new Error('Invalid code or state')
      }
      if (!res.response.headers['www-authenticate']) {
        throw new Error(
          'Unexpected error: www-authenticate headers not included in response',
        )
      }

      const [digestRealmStr, nonceStr] = res.response.headers[
        'www-authenticate'
      ]
        .replace(/\"/g, '')
        .split(',')
      const [_, digestRealm] = digestRealmStr.split('=')
      const [__, nonce] = nonceStr.split('=')

      const hash1 = md5(`${clientID}:${digestRealm}:${clientSecret}`)
      const hash2 = md5('POST:/oauth2/token')
      const response = md5(`${hash1}:${nonce}:${hash2}`)
      return `Digest username="${clientID}", realm="${digestRealm}", nonce="${nonce}", uri="/oauth2/token", response="${response}"`
    })
  console.log(authStr)
  return axios
    .post(
      `https://api.meethue.com/oauth2/token?grant_type=authorization_code&code=${code}`,
      {},
      {
        headers: { Authorization: authStr as string },
      },
    )
    .then(({ data }) => data)
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

export default {
  getAuthorizationURL,
  handleCallback,
}
