/**
 * Resolve a path in `public/` against the deployment's base URL.
 *
 * Vite rewrites the asset URLs it can see at build time, but not string
 * literals like `src="/images/foo.jpg"`. When the site is served from a
 * subpath (GitHub Pages serves this repo under /medweb/austin-heart/) those
 * absolute paths would resolve against the domain root and 404.
 *
 * Pass the path without a leading slash: asset('images/dr-gomez.jpg').
 */
export function asset(path: string): string {
  return import.meta.env.BASE_URL.replace(/\/$/, '') + '/' + path.replace(/^\//, '');
}
