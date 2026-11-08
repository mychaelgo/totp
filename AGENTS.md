## Learned User Preferences

- Secrets must never be stored or sent anywhere; the app stays fully client-side
- Prefer a simple, modern black/white UI that is mobile friendly

## Learned Workspace Facts

- Client-side TOTP generator built with Vite, React 19, TypeScript, Tailwind v4, and shadcn/ui (neutral theme); tests use Vitest
- TOTP logic lives in `src/lib/totp.ts`, the refresh hook in `src/hooks/useTotp.ts`, and the UI in `src/App.tsx`
- The RFC 6238 test key is derived from ASCII in `src/test/rfc6238.ts`; do not hardcode Base32 test keys in tests
