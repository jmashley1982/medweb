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
| `wrangler.jsonc` | Tells Cloudflare to serve `dist/` as static files |
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

Everything lives on `main`, in this repository on GitHub. That never changes —
GitHub is where the code and the build live.

The **public site is Cloudflare**, connected to this repo:

**https://medweb.jmashley1982.workers.dev**

Pushing to `main` triggers a Cloudflare build and publishes it. Nothing else
to run.

Cloudflare's Git integration created this as a Worker serving static assets
rather than a classic Pages project — hence the `workers.dev` address rather
than `pages.dev`. It makes no difference to how the site is built or served;
`dist/` is uploaded as static files either way.

`wrangler.jsonc` is what makes that work, and it is not optional. A Worker
deployed from Git with no wrangler config gets Cloudflare's starter script
instead of the site — the deploy succeeds and the address answers "Hello
world". The config declares an assets-only Worker (no `main` entry, so no
code runs on a request) pointing at `./dist`. Its `name` must stay `medweb`
so deploys update this site rather than creating a second Worker.

Its build settings:

| Setting | Value |
|---|---|
| Production branch | `main` |
| Framework preset | None |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | *(blank)* |
| Environment variable | `NODE_VERSION` = `22` |

`SITE_BASE` stays unset — a Pages project is served at its own domain root,
which is exactly what an empty `SITE_BASE` means.

### The retired GitHub Pages copy

This repo used to publish itself to GitHub Pages at
`jmashley1982.github.io/medweb` via a workflow that built with
`SITE_BASE=/medweb`. Cloudflare replaced it, so that workflow is gone.

The `gh-pages` branch still exists and still serves its last build, frozen at
the point Cloudflare took over. To take that old address down for good, set
*Settings → Pages → Source* to **None**. Leave the branch alone otherwise —
deleting it is not needed and not reversible.

## State of play

**Done**
- Landing page redesigned as MedWebDev, on the five-colour brand palette
- Both demo sites building from one command
- Everything consolidated onto `main` from four scattered branches
- Cloudflare Pages connected; pushing to `main` publishes the public site
- GitHub Pages publishing retired

**Next**
- Switch *Settings → Pages → Source* to **None** to retire the old
  `jmashley1982.github.io/medweb` address, which is now frozen
- Decide whether the landing page should be indexable — it currently carries
  `<meta name="robots" content="noindex">`, so search engines skip it
- Three superseded branches (`claude/*`, `austin-heart`) can be deleted from
  the repo's Branches page. Their unique code is already saved in `archive/`.
  Do not delete `gh-pages` casually — it still serves the old address.
