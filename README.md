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

## Contributing

Contributions are welcome.

1. Fork the repository and create a branch: `git checkout -b my-change`
2. Install dependencies: `npm install`
3. Make your changes and add tests for new behavior
4. Make sure everything passes: `npm test && npm run lint && npm run build`
5. Commit, push to your fork and open a pull request describing the change

Please keep the app fully client-side: secrets must never be sent over the network or stored.

## License

[MIT](LICENSE)
