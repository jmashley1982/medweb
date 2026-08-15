# Deploying — South Texas Vascular Experts (demo)

This branch builds to a **fully static site**. There is no server, no database and
no API at runtime, so it hosts for free on Cloudflare Pages with no cold starts.

## What the build does

`npm run build` runs `build-static.mjs`, which prerenders every page the Express
app would serve into flat HTML under `dist/`:

- the 8 public pages, at clean URLs (`/about`, `/staff`, …) plus `/` for the home page
- the admin section — login, dashboard, add-page, and an edit form per page — each
  populated with the real content

The admin pages get `public/demo-mode.js` injected. It shows a "Demo preview"
banner and intercepts **every** form submit, so visitors can click through the whole
CMS and type into any field, but nothing is ever saved. Signing in works from any
username/password and simply lands on the dashboard.

## Cloudflare Pages settings

Create a project connected to this repository with:

| Setting | Value |
|---|---|
| Production branch | `claude/medical-demo-public-urls-s3hiln` |
| Framework preset | None |
| Build command | `npm ci --omit=optional && npm run build` |
| Build output directory | `dist` |
| Root directory | *(leave blank)* |
| Environment variable | `NODE_VERSION` = `20` |

Under **Settings → Builds → Branch control**, set it to include **only**
`claude/medical-demo-public-urls-s3hiln`. This repository holds a second, unrelated
site on another branch; without this, Pages will try to build that branch with npm
and fail on every push.

### Why `--omit=optional`

`sqlite3` is the only native module here and it is needed solely by the live Express
server (`npm start`), never by the static build. It sits in `optionalDependencies`
so the Cloudflare build skips compiling it entirely — faster builds and one less
thing that can fail. A plain local `npm install` still installs it, so `npm start`
keeps working with no extra flags.

## Running the original server locally

The Express + EJS + SQLite app is untouched and still works for authoring content:

```
npm install
npm start          # http://localhost:5000  (admin: admin / vibe123)
```

Content lives in `seed-data.js` — the single source of truth shared by both the
server's database seeding and the static build. Edit it there and rebuild.
