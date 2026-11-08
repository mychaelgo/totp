const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

function base32Encode(text: string): string {
  let buffer = 0
  let bits = 0
  let output = ''
  for (const byte of new TextEncoder().encode(text)) {
    buffer = (buffer << 8) | byte
    bits += 8
    while (bits >= 5) {
      bits -= 5
      output += BASE32_ALPHABET[(buffer >> bits) & 31]
    }
  }
  if (bits > 0) output += BASE32_ALPHABET[(buffer << (5 - bits)) & 31]
  return output
}

// RFC 6238 SHA-1 test key, Base32-encoded
export const RFC_SECRET = base32Encode('12345678901234567890')
