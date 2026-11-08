const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

export type TotpOptions = {
  digits: number
  period: number
  timestamp: number
}

export function base32Decode(input: string): Uint8Array {
  const clean = input.replace(/\s+/g, '').replace(/=+$/, '').toUpperCase()
  if (!clean) throw new Error('Secret is empty')

  const bytes: number[] = []
  let buffer = 0
  let bits = 0
  for (const char of clean) {
    const value = BASE32_ALPHABET.indexOf(char)
    if (value === -1) throw new Error(`Invalid Base32 character: "${char}"`)
    buffer = (buffer << 5) | value
    bits += 5
    if (bits >= 8) {
      bits -= 8
      bytes.push((buffer >> bits) & 0xff)
    }
  }
  return new Uint8Array(bytes)
}

export async function generateTotp(secret: string, { digits, period, timestamp }: TotpOptions): Promise<string> {
  if (!Number.isInteger(digits) || digits < 1 || digits > 10) throw new Error('Digits must be between 1 and 10')
  if (!Number.isInteger(period) || period < 1) throw new Error('Period must be a positive whole number')

  const key = await crypto.subtle.importKey(
    'raw',
    base32Decode(secret).slice().buffer,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign'],
  )

  const counter = new ArrayBuffer(8)
  new DataView(counter).setBigUint64(0, BigInt(Math.floor(timestamp / 1000 / period)))
  const hmac = new Uint8Array(await crypto.subtle.sign('HMAC', key, counter))

  // Dynamic truncation (RFC 4226 section 5.3)
  const offset = hmac[hmac.length - 1] & 0x0f
  const binary =
    ((hmac[offset] & 0x7f) << 24) | (hmac[offset + 1] << 16) | (hmac[offset + 2] << 8) | hmac[offset + 3]

  return (binary % 10 ** digits).toString().padStart(digits, '0')
}
