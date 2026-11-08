import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { useTotp } from '@/hooks/useTotp'

function App() {
  const [secret, setSecret] = useState('')
  const [digits, setDigits] = useState('6')
  const [period, setPeriod] = useState('30')
  const [copied, setCopied] = useState(false)

  const periodValue = Number(period)
  const { token, error, remaining } = useTotp(secret, Number(digits), periodValue)

  async function copyToken() {
    await navigator.clipboard.writeText(token)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <main className="flex min-h-svh items-start justify-center bg-background p-4 sm:items-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">TOTP Generator</CardTitle>
          <CardDescription>Your secret stays in this browser and is never stored.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="secret">Secret (Base32)</Label>
            <Input
              id="secret"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="JBSWY3DPEHPK3PXP"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              className="font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="digits">Digits</Label>
              <Input
                id="digits"
                type="number"
                inputMode="numeric"
                min={1}
                max={10}
                value={digits}
                onChange={(e) => setDigits(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="period">Time window (seconds)</Label>
              <Input
                id="period"
                type="number"
                inputMode="numeric"
                min={1}
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex flex-col gap-3 rounded-lg border p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-3xl font-semibold tracking-widest sm:text-4xl" aria-live="polite">
                {token || '------'}
              </span>
              <Button variant="outline" size="icon" onClick={copyToken} disabled={!token} aria-label="Copy token">
                {copied ? <Check /> : <Copy />}
              </Button>
            </div>
            <Progress value={remaining > 0 ? (remaining / periodValue) * 100 : 0} />
            <p className="text-sm text-muted-foreground">Expires in {remaining}s</p>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

export default App
