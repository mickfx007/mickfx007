# Style Word Generator – Nano Banana

Edge+Node Next.js 14 app that extracts style from reference images using OpenAI + Anthropic, fact-checks with Perplexity, and renders a target word in that style via Nano Banana.

## Env

Create `.env.local` with:

```
NANOBANANA_API_KEY=
# NANOBANANA_API_BASE=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
PERPLEXITY_API_KEY=
```

## Scripts

- `npm run dev`
- `npm run build && npm start`
- `npm run lint`
- `npm run format`
- `npm run test`
- `npm run e2e`

## Deploy

- Vercel-ready. Add env vars in project settings.