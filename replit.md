# Austin Heart & Associates CMS

A fully designed physician's office website with a password-protected CMS dashboard that lets the client edit any page content, upload images/videos, and add new pages.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/austin-heart run dev` — run the public website (port 18888)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Required env: `SESSION_SECRET` — secret for admin session cookies

## Admin Credentials

- Username: `admin`
- Password: `admin123`
- Admin URL: `/admin` (redirects to `/admin/login` if not logged in)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS + Wouter routing
- API: Express 5 + express-session
- DB: PostgreSQL + Drizzle ORM
- File uploads: Multer (stored in `artifacts/api-server/uploads/`)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- **OpenAPI spec**: `lib/api-spec/openapi.yaml`
- **DB schema**: `lib/db/src/schema/pages.ts`
- **API routes**: `artifacts/api-server/src/routes/` (pages.ts, admin.ts)
- **Frontend pages**: `artifacts/austin-heart/src/pages/`
- **Theme/CSS**: `artifacts/austin-heart/src/index.css`

## Architecture decisions

- Session-based admin auth with express-session (hardcoded credentials, configurable via env vars `ADMIN_USERNAME` / `ADMIN_PASSWORD`)
- Uploaded files stored on disk at `artifacts/api-server/uploads/`, served at `/api/admin/uploads/:filename`
- Upload endpoint (`POST /api/admin/upload`) is NOT in the OpenAPI spec (multer multipart upload has codegen limitations); called directly from frontend via fetch
- Page content stored as HTML strings; rendered with dangerouslySetInnerHTML on public pages
- Navigation is CMS-driven: fetched from `GET /api/pages`

## Product

- **Visitors**: See a clean navy-blue-accented site with Home, About, Services, Contact pages. All content is editable.
- **Admin**: Log in at `/admin`, edit any page (title, rich-text content, header image, video URL), add new pages with custom templates, delete pages.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Always run `pnpm --filter @workspace/api-spec run codegen` after changing `lib/api-spec/openapi.yaml`
- The upload route is at `/api/admin/upload` (not in codegen — call via fetch directly)
- DB push only affects dev; production schema is managed by Replit's Publish flow

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
