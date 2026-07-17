# ✦ blun

A personal feedback inbox — local-first, no accounts. Everything lives in the
browser's `localStorage`, seeded with sample data on first run. Three linked
entities: **Feedback**, **Contacts**, **Features**. Bilingual UI (English /
Russian). Built with React 19 + TypeScript + Vite.

## Run locally

```sh
npm install
npm run dev      # http://localhost:5173
```

- `/` — animated landing page
- `/app` — inbox · `/app/contacts` · `/app/features`

Other scripts: `npm run build` (type-check + production build to `dist/`),
`npm run preview` (serve the built output), `npm run lint`.

## Deploy to Cloudflare Pages

### 1. Push to GitHub

```sh
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<you>/blun.git
git push -u origin main
```

### 2. Connect the repo in Cloudflare

Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** →
**Connect to Git** → pick this repo, then set:

| Setting | Value |
| --- | --- |
| Framework preset | Vite |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | `22.12.0` (already pinned via `.node-version`) |

Click **Save and Deploy**. Every push to `main` redeploys automatically.

### Or deploy from the CLI (Wrangler)

```sh
npm run build
npx wrangler pages deploy dist --project-name blun
```

## Notes for Cloudflare Pages

- **`public/_redirects`** (`/* /index.html 200`) makes the client-side routes
  (`/app`, `/app/contacts`, …) resolve on hard refresh / deep links. Vite copies
  it into `dist/` at build time — don't remove it.
- **`.node-version`** pins Node 22 so the build matches Vite 8's requirements.
- **`wrangler.toml`** sets the Pages output dir for CLI deploys.
- Fonts load from Google Fonts at runtime; no other external calls. All data is
  client-side only — there is no backend to configure.
