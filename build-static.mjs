// ============================================================
// build-static.mjs – prerender the site to static HTML
// ============================================================
// The live app (app.js) is Express + EJS + SQLite. For the public demo we
// render every page it would serve into flat HTML files, so the site can be
// hosted for free on any static host with no server, no database and no
// cold starts.
//
// The admin section is rendered too — populated with the real content — and
// gets `public/demo-mode.js` injected, which freezes every form. Visitors can
// walk the whole CMS and see how it works; nothing is saved.
//
//   node build-static.mjs   ->   ./dist

import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';
import ejs from 'ejs';

const require = createRequire(import.meta.url);
const { pages: seedPages } = require('./seed-data.js');

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const VIEWS = path.join(ROOT, 'views');
const PUBLIC = path.join(ROOT, 'public');
const DIST = path.join(ROOT, 'dist');

// Where the site will be served from. Empty means the domain root (Cloudflare
// Pages); GitHub Pages serves this repo under a subpath, e.g.
// BASE_PATH=/medweb/south-texas. Normalised to "" or "/foo" (no trailing slash).
const BASE = (process.env.BASE_PATH ?? '')
  .trim()
  .replace(/\/+$/, '')
  .replace(/^(?!\/|$)/, '/');

// Mirror the shape app.js hands to the templates: rows carry a numeric id and
// a parsed `content` object.
const pageRows = seedPages.map((p, i) => ({
  id: i + 1,
  slug: p.slug,
  title: p.title,
  content: p.content,
  template: 'standard'
}));

// The nav is built from `SELECT id, slug, title FROM pages ORDER BY title`.
const navPages = pageRows
  .map(({ id, slug, title }) => ({ id, slug, title }))
  .sort((a, b) => a.title.localeCompare(b.title));

// `req` is only ever read for query-string flash messages in the admin views.
const reqStub = { query: {} };

async function render(view, data) {
  return ejs.renderFile(path.join(VIEWS, `${view}.ejs`), data, { async: false });
}

// Written as <dir>/index.html so links like `/about` resolve without a
// trailing slash or a .html suffix on any static host.
async function writePage(routePath, html) {
  const dir = routePath === '/' ? DIST : path.join(DIST, routePath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, 'index.html'), withBase(html), 'utf8');
  return path.relative(ROOT, path.join(dir, 'index.html'));
}

// The EJS templates emit root-absolute URLs (/style.css, /uploads/x.png,
// /about). Those are correct at a domain root but resolve outside the site
// when it is served from a subpath, so rewrite them at build time. Protocol
// relative (//host) and absolute (https://) URLs are left alone.
function withBase(html) {
  if (!BASE) return html;
  return (
    html
      .replace(/\b(href|src|action)="\/(?!\/)/g, (_m, attr) => `${attr}="${BASE}/`)
      // The hero uses a CSS custom property: style="--hero-img: url('/uploads/x.png')"
      .replace(/url\((['"]?)\/(?!\/)/g, (_m, q) => `url(${q}${BASE}/`)
  );
}

// Pull in the read-only guard just before </body>, telling it where the site
// is rooted so its own navigation targets stay correct too.
// Emitted root-absolute like everything else in the templates; writePage runs
// withBase over the finished document, so this gets rewritten with the rest.
function withDemoMode(html) {
  const tag =
    `<script>window.__DEMO_BASE__=${JSON.stringify(BASE)};</script>` +
    `<script src="/demo-mode.js" defer></script>`;
  return html.includes('</body>')
    ? html.replace('</body>', `  ${tag}\n</body>`)
    : html + tag;
}

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  for (const entry of await fs.readdir(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) await copyDir(from, to);
    else await fs.copyFile(from, to);
  }
}

async function main() {
  await fs.rm(DIST, { recursive: true, force: true });
  await fs.mkdir(DIST, { recursive: true });

  const written = [];

  // ---- Public pages -------------------------------------------------
  for (const page of pageRows) {
    const html = await render('layout', {
      page,
      pages: navPages,
      currentSlug: page.slug,
      // Renders the "⚙ Admin" nav link, so a visitor can find the CMS
      // without being told where it lives.
      isLoggedIn: true
    });
    written.push(await writePage(`/${page.slug}`, html));

    // app.js redirects `/` -> `/home`; statically we just serve it at both.
    if (page.slug === 'home') {
      written.push(await writePage('/', html));
    }
  }

  // ---- Admin section (frozen) ---------------------------------------
  written.push(
    await writePage('/admin', withDemoMode(await render('admin-login', { error: null })))
  );

  written.push(
    await writePage(
      '/admin/dashboard',
      withDemoMode(await render('admin-dashboard', { pages: navPages, req: reqStub }))
    )
  );

  written.push(
    await writePage('/admin/add', withDemoMode(await render('admin-add', { error: null })))
  );

  for (const page of pageRows) {
    const html = await render('admin-edit', {
      page,
      error: null,
      success: null,
      req: reqStub
    });
    written.push(await writePage(`/admin/edit/${page.id}`, withDemoMode(html)));
  }

  // ---- Static assets -------------------------------------------------
  await copyDir(PUBLIC, DIST);

  console.log(`Built ${written.length} pages into ${path.relative(ROOT, DIST)}/`);
  for (const f of written) console.log(`  ${f}`);
}

main().catch((err) => {
  console.error('Static build failed:');
  console.error(err);
  process.exit(1);
});
