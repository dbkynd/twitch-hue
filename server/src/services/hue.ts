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
  return axios
    .post(
      `https://api.meethue.com/oauth2/token?grant_type=authorization_code&code=${code}`,
    )
    .then((res) => {
      if (res.status !== 401) {
        throw new Error('Invalid code or state')
      }
      if (!res.headers['www-authenticate']) {
        throw new Error(
          'Unexpected error: www-authenticate headers not included in response',
        )
      }

      const [digestRealmStr, nonceStr] = res.headers['www-authenticate']
        .replace(/\"/g, '')
        .split(',')
      const [_, digestRealm] = digestRealmStr.split('=')
      const [__, nonce] = nonceStr.split('=')

      const hash1 = md5(`${clientID}:${digestRealm}:${clientSecret}`)
      const hash2 = md5('POST:/oauth2/token')
      const response = md5(`${hash1}:${nonce}:${hash2}`)
      const authStr = `Digest username="${clientID}", realm="${digestRealm}", nonce="${nonce}", uri="/oauth2/token", response="${response}"`
      return axios.post(
        `https://api.meethue.com/oauth2/token?grant_type=authorization_code&code=${code}`,
        {},
        {
          headers: { Authorization: authStr },
        },
      ).then(({data}) => data)
    })
    .catch((err) => {
      throw err
    })
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
