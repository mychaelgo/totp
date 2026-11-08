import { describe, expect, it } from 'vitest'
import { RFC_SECRET } from '@/test/rfc6238'
import { base32Decode, generateTotp } from './totp'

describe('base32Decode', () => {
  it('decodes a valid secret', () => {
    expect(new TextDecoder().decode(base32Decode(RFC_SECRET))).toBe('12345678901234567890')
  })

  it('ignores case, whitespace and padding', () => {
    expect(base32Decode('my====')).toEqual(base32Decode('MY'))
    expect(base32Decode(' gezd gnbv ')).toEqual(base32Decode('GEZDGNBV'))
  })

  it('throws on invalid characters', () => {
    expect(() => base32Decode('ABC1')).toThrow('Invalid Base32 character: "1"')
  })

  it('throws on empty input', () => {
    expect(() => base32Decode('   ')).toThrow('Secret is empty')
  })
})

describe('generateTotp', () => {
  it.each([
    [59, '94287082'],
    [1111111109, '07081804'],
    [1111111111, '14050471'],
    [1234567890, '89005924'],
    [2000000000, '69279037'],
    [20000000000, '65353130'],
  ])('matches RFC 6238 vector at %i seconds', async (seconds, expected) => {
    await expect(generateTotp(RFC_SECRET, { digits: 8, period: 30, timestamp: seconds * 1000 })).resolves.toBe(expected)
  })

  it('returns the last N digits for shorter tokens', async () => {
    await expect(generateTotp(RFC_SECRET, { digits: 6, period: 30, timestamp: 59_000 })).resolves.toBe('287082')
  })

  it('returns the same token within one period and changes at the boundary', async () => {
    const at = (timestamp: number) => generateTotp(RFC_SECRET, { digits: 6, period: 60, timestamp })
    expect(await at(60_000)).toBe(await at(119_999))
    expect(await at(119_999)).not.toBe(await at(120_000))
  })

  it('uses the period to compute the counter', async () => {
    // Counter 1 with period 30 equals counter 1 with period 60
    const a = await generateTotp(RFC_SECRET, { digits: 6, period: 30, timestamp: 30_000 })
    const b = await generateTotp(RFC_SECRET, { digits: 6, period: 60, timestamp: 60_000 })
    expect(a).toBe(b)
  })

  it.each([0, 11, 6.5])('rejects invalid digits %s', async (digits) => {
    await expect(generateTotp(RFC_SECRET, { digits, period: 30, timestamp: 0 })).rejects.toThrow('Digits')
  })

  it.each([0, -30, 1.5])('rejects invalid period %s', async (period) => {
    await expect(generateTotp(RFC_SECRET, { digits: 6, period, timestamp: 0 })).rejects.toThrow('Period')
  })

  it('rejects an invalid secret', async () => {
    await expect(generateTotp('!!!', { digits: 6, period: 30, timestamp: 0 })).rejects.toThrow('Invalid Base32')
  })
})
