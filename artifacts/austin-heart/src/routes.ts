// ============================================================
// routes.ts – the site's page identifiers
// ============================================================
// Kept dependency-free so `vite.config.ts` can import it at build time to
// write a real index.html for every client-side route. `demo-content.ts`
// builds its pages from the same lists, so the two cannot drift apart.

export const PAGE_SLUGS = [
  'home',
  'about',
  'services',
  'team',
  'patient-info',
  'contact'
] as const;

export type PageSlug = (typeof PAGE_SLUGS)[number];

/** Page ids are 1-based and follow PAGE_SLUGS order. */
export const PAGE_IDS = PAGE_SLUGS.map((_, i) => i + 1);
