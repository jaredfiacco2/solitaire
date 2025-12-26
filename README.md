# Solitaire

A premium, mobile-first Klondike Solitaire card game.

**Live:** https://solitaire.jfiacco.com

## Features

- Classic Klondike Solitaire gameplay
- Draw 1 or Draw 3 mode toggle
- Tap-to-move cards (mobile friendly)
- Timer and move counter
- Statistics tracking (localStorage)
- Win celebration animation
- Dark mode casino-themed design

## Development

```bash
npm install
npm run dev
```

## Deployment

Deployment is handled via GitHub Actions on push to `main`.

### Initial Infrastructure Setup

1. Deploy CDK stack:
```bash
cd infra
npm install
npx cdk bootstrap
npx cdk deploy
```

2. Configure GitHub repository variables:
- `S3_BUCKET`: Output from CDK deploy
- `CLOUDFRONT_ID`: Output from CDK deploy

3. Configure GitHub repository secrets:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

## Tech Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- AWS S3 + CloudFront
- AWS CDK for infrastructure
