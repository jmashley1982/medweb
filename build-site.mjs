// ============================================================
// build-site.mjs – assemble the whole MedWebDev site into dist/
// ============================================================
// One command builds everything that gets deployed:
//
//   dist/                    the MedWebDev landing page (index.html)
//   dist/south-texas/        South Texas Vascular Experts demo
//   dist/austin-heart/       Austin Heart & Associates demo
//
// The two demos are separate projects with different toolchains — one is
// Express + EJS prerendered to flat HTML, the other a React/Vite SPA — so
// each is built on its own terms and the output is copied into place.
//
//   npm run build   ->   ./dist
//
// Point any static host at dist/. Cloudflare Pages: build command
// `npm run build`, output directory `dist`.

import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, 'dist');
const AUSTIN = path.join(ROOT, 'sites', 'austin-heart');

// Where the whole site is served from. Empty = a domain root, which is what
// Cloudflare Pages gives us. GitHub Pages serves this repo under /medweb, so
// that deploy sets SITE_BASE=/medweb. Normalised to "" or "/foo".
const SITE_BASE = (process.env.SITE_BASE ?? '')
  .trim()
  .replace(/\/+$/, '')
  .replace(/^(?!\/|$)/, '/');

// pnpm isn't assumed to be on PATH — the Austin Heart workspace pins its own
// version, and `npx pnpm@<version>` works on a bare Node image.
const PNPM = ['--yes', 'pnpm@10.33.0'];

function run(label, cmd, args, opts = {}) {
  console.log(`\n▸ ${label}`);
  const res = spawnSync(cmd, args, {
    stdio: 'inherit',
    shell: false,
    cwd: opts.cwd ?? ROOT,
    env: { ...process.env, ...(opts.env ?? {}) }
  });
  if (res.error) throw res.error;
  if (res.status !== 0) {
    throw new Error(`${label} failed (exit ${res.status})`);
  }
}

async function main() {
  console.log(`Building for ${SITE_BASE || 'the domain root'}`);
  await fs.rm(DIST, { recursive: true, force: true });
  await fs.mkdir(DIST, { recursive: true });

  // ---- Landing page -------------------------------------------------
  await fs.copyFile(path.join(ROOT, 'index.html'), path.join(DIST, 'index.html'));
  // Only a robots.txt at the domain root is ever read, so this one governs the
  // whole site — including the demos, which must stay out of search results.
  await fs.copyFile(path.join(ROOT, 'robots.txt'), path.join(DIST, 'robots.txt'));
  console.log('▸ Landing page and robots.txt copied');

  // ---- Demo A: South Texas Vascular (Express + EJS, prerendered) -----
  run('Build South Texas Vascular', process.execPath, ['build-static.mjs'], {
    env: { BASE_PATH: `${SITE_BASE}/south-texas`, OUT_DIR: path.join(DIST, 'south-texas') }
  });

  // ---- Demo B: Austin Heart (React + Vite) --------------------------
  run('Install Austin Heart deps', 'npx', [...PNPM, 'install', '--frozen-lockfile'], {
    cwd: AUSTIN
  });
  run('Build Austin Heart', 'npx', [...PNPM, 'run', 'build'], {
    cwd: AUSTIN,
    env: { BASE_PATH: `${SITE_BASE}/austin-heart/` }
  });
  await fs.cp(
    path.join(AUSTIN, 'artifacts', 'austin-heart', 'dist', 'public'),
    path.join(DIST, 'austin-heart'),
    { recursive: true }
  );
  console.log('▸ Austin Heart copied');

  // Some hosts (and GitHub Pages) drop paths beginning with an underscore
  // unless this marker is present.
  await fs.writeFile(path.join(DIST, '.nojekyll'), '');

  const top = (await fs.readdir(DIST)).sort().join('  ');
  console.log(`\n✓ Site assembled in dist/\n  ${top}\n`);
}

main().catch((err) => {
  console.error(`\n✗ Build failed: ${err.message}`);
  process.exit(1);
});
