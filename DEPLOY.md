# Deploying — South Texas Vascular Experts (demo)

This branch builds to a **fully static site**. There is no server, no database and
no API at runtime, so it hosts for free with no cold starts.

## What the build does

`npm run build` runs `build-static.mjs`, which prerenders every page the Express
app would serve into flat HTML under `dist/`:

- the 8 public pages, at clean URLs (`/about`, `/staff`, …) plus `/` for the home page
- the admin section — login, dashboard, add-page, and an edit form per page — each
  populated with the real content

The admin pages get `public/demo-mode.js` injected. It shows a "Demo preview"
banner and intercepts **every** form submit, so visitors can click through the whole
CMS and type into any field, but nothing is ever saved. The login form is prefilled
and its `required` attributes are stripped, so signing in is a single click and no
one has to invent credentials.

### `BASE_PATH`

Unset, the build emits root-absolute URLs (`/style.css`, `/about`) — correct when the
site is served at a domain root. Set it to serve from a subdirectory:

```
BASE_PATH=/medweb/south-texas npm run build
```

Every `href`, `src`, `action` and CSS `url()` is rewritten to that prefix, and
`demo-mode.js` reads the same value so its redirects stay correct.

## Where this is deployed today

**GitHub Pages**, automatically, via `.github/workflows/deploy-demos.yml`.

Every push to `claude/medical-demo-public-urls-s3hiln` or
`claude/austin-heart-public-url` rebuilds *both* demo sites, assembles them with the
landing page from `.github/index.html`, and force-pushes the result to the
`gh-pages` branch:

| URL | Source |
|---|---|
| https://jmashley1982.github.io/medweb/ | `.github/index.html` |
| https://jmashley1982.github.io/medweb/south-texas/ | this branch |
| https://jmashley1982.github.io/medweb/austin-heart/ | `claude/austin-heart-public-url` |

Pages must be set to **Deploy from a branch → `gh-pages` → `/ (root)`** in the
repository settings. That is a one-time switch: the built-in `GITHUB_TOKEN` can
publish to the branch but cannot create the Pages site itself, so
`actions/configure-pages` with `enablement: true` fails with "Resource not
accessible by integration".

> **If this branch is ever merged and deleted**, the workflow breaks — it checks the
> two `claude/*` branches out by name. Keep the branches, or update the `ref:` values
> in the workflow first.

## Alternative: Cloudflare Pages

Nicer URLs (`*.pages.dev`, one project per site) if you'd rather not use the
`/medweb/` subpath. Create a project connected to this repository with:

| Setting | Value |
|---|---|
| Production branch | `claude/medical-demo-public-urls-s3hiln` |
| Framework preset | None |
| Build command | `npm ci --omit=optional && npm run build` |
| Build output directory | `dist` |
| Root directory | *(leave blank)* |
| Environment variable | `NODE_VERSION` = `20` |

Leave `BASE_PATH` unset — a Pages project is served at its own domain root.

Under **Settings → Builds → Branch control**, include **only**
`claude/medical-demo-public-urls-s3hiln`. This repository holds a second, unrelated
site on another branch; without this, Pages will try to build that branch with npm
and fail on every push.

### Why `--omit=optional`

`sqlite3` is the only native module here and it is needed solely by the live Express
server (`npm start`), never by the static build. It sits in `optionalDependencies`
so the build skips compiling it entirely — faster, and one less thing that can fail.
A plain local `npm install` still installs it, so `npm start` keeps working with no
extra flags.

## Running the original server locally

The Express + EJS + SQLite app is untouched and still works for authoring content:

```
npm install
npm start          # http://localhost:5000  (admin: admin / vibe123)
```

Content lives in `seed-data.js` — the single source of truth shared by both the
server's database seeding and the static build. Edit it there and rebuild.
