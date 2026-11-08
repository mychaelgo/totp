# TOTP Generator

A simple, mobile-friendly web page for generating time-based one-time passwords (TOTP, RFC 6238).

Live: https://totp.mychaelgo.com

<img src="docs/screenshot.png" alt="TOTP Generator screenshot" width="390" />

## Privacy

Everything runs in your browser using the Web Crypto API. Your secret is never sent anywhere and never stored.

## Development

```bash
npm install
npm run dev     # start dev server
npm test        # run tests
npm run build   # production build to dist/
```

Built with React, Vite, Tailwind CSS and shadcn/ui.

## License

[MIT](LICENSE)
