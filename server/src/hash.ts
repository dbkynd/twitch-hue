import crypto from 'crypto'

const algorithm = 'aes-256-cbc'
const key = process.env.SECRET
const iv = Buffer.from(process.env.IV, 'hex')

function encrypt(text: string) {
  const cipher = crypto.createCipheriv(algorithm, key, iv)
  return cipher.update(text, 'utf8', 'hex') + cipher.final('hex')
}

function decrypt(hash: string) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv)
  return decipher.update(hash, 'hex', 'utf8') + decipher.final('utf8')
}

export default {
  encrypt,
  decrypt,
}
