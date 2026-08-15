# Deploying — Austin Heart & Associates (demo)

This branch builds to a **fully static single-page app**. There is no server, no
database and no API at runtime, so it hosts for free on Cloudflare Pages with no
cold starts.

## What changed from the original

The original build was a pnpm monorepo: a React SPA talking to an Express API
backed by Postgres, all running on Replit. That Replit environment and its
database are gone, and with them every page of content and every uploaded image
— none of it was ever in the repository.

Since a prospective client only needs to *see* how the CMS works, the backend
was removed rather than rebuilt:

- `src/demo-content.ts` holds the six pages of content that used to live in
  Postgres. This is the single source of truth for the site.
- `src/demo-api.ts` mirrors the export names and call signatures of the old
  generated API client, so the page components only needed their import
  specifier swapped. Reads resolve instantly from the bundled content; writes
  are inert and show a "changes aren't saved" toast.
- The admin reports itself as signed in, so `/admin` is browsable straight from
  a link. `/admin/login` still works as a screen — any credentials are accepted
  — so it stays part of the walkthrough without anyone needing a password.
- `artifacts/api-server/`, `lib/db/`, `lib/api-spec/`, `lib/api-zod/`,
  `lib/api-client-react/`, `artifacts/mockup-sandbox/` and `scripts/` were
  deleted. They are preserved on the original `austin-heart` branch.
- All Replit-specific configuration is gone: the three `@replit/*` Vite plugins,
  the `.replit-artifact` descriptors, `replit.md`, and the `pnpm-workspace.yaml`
  `overrides` block that nulled out every non-linux-x64 native binary (which
  would have produced a broken install on any other platform).
- Photography and the logo were regenerated, since the originals are gone.

`vite.config.ts` no longer throws when `PORT` and `BASE_PATH` are unset — they
default to `5173` and `/`. A static build never starts a server, so failing over
a dev-server port was wrong, and it means no hidden environment variables are
needed to build the repo.

## Cloudflare Pages settings

Create a project connected to this repository with:

| Setting | Value |
|---|---|
| Production branch | `claude/austin-heart-public-url` |
| Framework preset | None |
| Build command | `pnpm install --frozen-lockfile && pnpm run build` |
| Build output directory | `artifacts/austin-heart/dist/public` |
| Root directory | *(leave blank — the build must run from the workspace root so `catalog:` versions resolve)* |
| Environment variables | `NODE_VERSION` = `22.14.0`, `PNPM_VERSION` = `10.33.0` |

Under **Settings → Builds → Branch control**, set it to include **only**
`claude/austin-heart-public-url`. This repository holds a second, unrelated site
on another branch; without this, Pages will try to build that branch with pnpm
and fail on every push.

`NODE_VERSION` matters: Vite 7 requires Node ≥ 20.19 / ≥ 22.12, which is newer
than Cloudflare's default. `PNPM_VERSION` matters because `catalog:` specifiers
need pnpm ≥ 9.5 and `minimumReleaseAge` needs ≥ 10.4.

The SPA fallback lives in `artifacts/austin-heart/public/_redirects`
(`/* /index.html 200`). Vite copies it into the output root. Without it, a hard
refresh on `/page/services` or `/admin` returns a 404, because those routes
exist only inside the client-side router.

## Running locally

```
pnpm install
pnpm dev            # http://localhost:5173
pnpm run build      # -> artifacts/austin-heart/dist/public
pnpm run typecheck
```

## Editing the content

Everything a visitor reads on the public pages comes from
`artifacts/austin-heart/src/demo-content.ts`. Array order is nav order. The
`content` field is an HTML string rendered into a Tailwind `prose` block, so use
`<h2>`, `<p>` and `<ul>` rather than markdown.

Two exceptions, both hardcoded in components rather than in the content module:
the Team page (`src/pages/TeamPage.tsx`, which holds the staff bios) and the
home page layout (`src/pages/Home.tsx`, which holds the hero copy, stats and
service chips).
