import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { RFC_SECRET } from '@/test/rfc6238'
import { useTotp } from './useTotp'

// Polls with the real setTimeout, because setInterval is faked for the hook's ticker
async function waitFor(assertion: () => void) {
  for (let attempt = 0; ; attempt++) {
    try {
      return assertion()
    } catch (error) {
      if (attempt >= 100) throw error
      await act(() => new Promise((resolve) => setTimeout(resolve, 10)))
    }
  }
}

describe('useTotp', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date', 'setInterval', 'clearInterval'] })
    vi.setSystemTime(59_000)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns the token and seconds remaining', async () => {
    const { result } = renderHook(() => useTotp(RFC_SECRET, 8, 30))
    await waitFor(() => expect(result.current.token).toBe('94287082'))
    expect(result.current.remaining).toBe(1)
    expect(result.current.error).toBe('')
  })

  it('counts down and refreshes the token at the window boundary', async () => {
    vi.setSystemTime(55_000)
    const { result } = renderHook(() => useTotp(RFC_SECRET, 6, 30))
    await waitFor(() => expect(result.current.token).toBe('287082'))
    expect(result.current.remaining).toBe(5)

    act(() => vi.advanceTimersByTime(1000))
    expect(result.current.remaining).toBe(4)

    act(() => vi.advanceTimersByTime(4000))
    expect(result.current.remaining).toBe(30)
    await waitFor(() => expect(result.current.token).not.toBe('287082'))
  })

  it('returns an error for an invalid secret', async () => {
    const { result } = renderHook(() => useTotp('INVALID1', 6, 30))
    await waitFor(() => expect(result.current.error).toBe('Invalid Base32 character: "1"'))
    expect(result.current.token).toBe('')
  })

  it('returns an error for invalid options', async () => {
    const { result } = renderHook(() => useTotp(RFC_SECRET, 6, 0))
    await waitFor(() => expect(result.current.error).toContain('Period'))
    expect(result.current.remaining).toBe(0)
  })

  it('returns nothing for an empty secret', () => {
    const { result } = renderHook(() => useTotp('  ', 6, 30))
    expect(result.current.token).toBe('')
    expect(result.current.error).toBe('')
  })

  it('updates when inputs change', async () => {
    const { result, rerender } = renderHook(({ digits }) => useTotp(RFC_SECRET, digits, 30), {
      initialProps: { digits: 8 },
    })
    await waitFor(() => expect(result.current.token).toBe('94287082'))
    rerender({ digits: 6 })
    await waitFor(() => expect(result.current.token).toBe('287082'))
  })
})
