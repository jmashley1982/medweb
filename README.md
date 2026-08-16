# MedWebDev

Websites for medical practices, each shipping with a content dashboard the
practice's own staff can run.

This repo holds the MedWebDev landing page and two complete demo practice
sites. Both practices are fictional; the sites are real and fully clickable,
admin screens included.

## What's in here

| Path | What it is |
|---|---|
| `index.html` | The MedWebDev landing page — the front door |
| `app.js`, `views/`, `public/`, `seed-data.js` | South Texas Vascular Experts — Express + EJS + SQLite |
| `build-static.mjs` | Prerenders that Express app to flat HTML |
| `sites/austin-heart/` | Austin Heart & Associates — React + Vite |
| `build-site.mjs` | Assembles all three into one deployable `dist/` |
| `archive/` | Superseded work, kept not deleted |

## Building

```
npm install
npm run build      # -> dist/
```

That produces the whole site in one folder:

```
dist/index.html        the landing page
dist/south-texas/      demo one
dist/austin-heart/     demo two
```

`SITE_BASE` controls where the site is served from. Leave it unset for a
domain root (what Cloudflare Pages gives you). GitHub Pages serves this repo
under a subfolder, so that deploy sets `SITE_BASE=/medweb`.

The South Texas Express app still runs on its own for authoring content:

```
npm start          # http://localhost:5000  (admin: admin / vibe123)
```

Its content lives in `seed-data.js` — the single source of truth shared by
both the running server and the static build. Edit it there and rebuild.

The admin sections in the built site get `public/demo-mode.js` injected. It
shows a "Demo preview" banner, prefills the login and intercepts every form
submit, so a visitor can walk the entire CMS and type into any field while
nothing is ever saved.

## Deploying

Everything lives on `main`. Pushing to `main` triggers
`.github/workflows/deploy.yml`, which builds the site and force-pushes the
result to the `gh-pages` branch.

Live: **https://jmashley1982.github.io/medweb/**

That requires Pages to be set to *Deploy from a branch → `gh-pages` → `/ (root)`*
in the repo settings — a one-time switch, already done.

### Moving to Cloudflare Pages

Not wired up yet, and it needs one action in the Cloudflare dashboard that
cannot be done from the API alone. Create a Pages project connected to this
repository with:

| Setting | Value |
|---|---|
| Production branch | `main` |
| Framework preset | None |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | *(blank)* |
| Environment variable | `NODE_VERSION` = `22` |

Leave `SITE_BASE` unset — a Pages project is served at its own domain root.

Once that exists, pushing to `main` publishes to both Cloudflare and GitHub
Pages. Drop `.github/workflows/deploy.yml` when Cloudflare is confirmed good
and you no longer want the GitHub Pages copy.

## State of play

**Done**
- Landing page redesigned as MedWebDev, on the five-colour brand palette
- Both demo sites building from one command
- Everything consolidated onto `main` from four scattered branches
- Publishing on every push to `main`

**Next**
- Connect the Cloudflare Pages project
- Decide whether the landing page should be indexable — it currently carries
  `<meta name="robots" content="noindex">`, so search engines skip it
