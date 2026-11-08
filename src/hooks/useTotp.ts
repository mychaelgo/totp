import { useEffect, useState } from 'react'
import { generateTotp } from '@/lib/totp'

type Result = { token: string; error: string }

const EMPTY: Result = { token: '', error: '' }

export function useTotp(secret: string, digits: number, period: number) {
  const [now, setNow] = useState(() => Date.now())
  const [result, setResult] = useState<Result>(EMPTY)

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const validPeriod = Number.isInteger(period) && period > 0
  const seconds = Math.floor(now / 1000)
  const step = validPeriod ? Math.floor(seconds / period) : 0
  const remaining = validPeriod ? period - (seconds % period) : 0
  const hasSecret = secret.trim() !== ''

  useEffect(() => {
    if (!hasSecret) return
    let cancelled = false
    generateTotp(secret, { digits, period, timestamp: step * period * 1000 }).then(
      (token) => !cancelled && setResult({ token, error: '' }),
      (error: Error) => !cancelled && setResult({ token: '', error: error.message }),
    )
    return () => {
      cancelled = true
    }
  }, [hasSecret, secret, digits, period, step])

  return { ...(hasSecret ? result : EMPTY), remaining }
}
