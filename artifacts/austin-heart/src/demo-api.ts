// ============================================================
// demo-api.ts – stand-in for the generated API client
// ============================================================
// The public demo has no backend. This module mirrors the export names and
// call signatures of `@workspace/api-client-react` exactly, so the page
// components only need their import specifier swapped — no logic changes.
//
// Reads resolve instantly from the bundled content in `demo-content.ts`.
// Writes are deliberately inert: they announce themselves with a toast and
// return without firing `onSuccess` or `onError`, so the form neither
// navigates away nor shows a scary red failure. Whatever the visitor typed
// stays on screen.

import { toast } from '@/hooks/use-toast';
import {
  DEMO_PAGES,
  type Page,
  type PageSummary,
  type AuthStatus
} from '@/demo-content';

// `PageInputTemplate` is declared as both a const and a type, so this single
// re-export carries both meanings.
export { PageInputTemplate } from '@/demo-content';
export type { Page, PageSummary, AuthStatus } from '@/demo-content';

export const DEMO_NOTICE = "Demo preview — changes aren't saved.";

function demoNotice() {
  toast({
    title: DEMO_NOTICE,
    description: 'This is a read-only sample of the CMS.'
  });
}

/** Shape of a settled react-query read, which is all the components consume. */
function settled<T>(data: T) {
  return {
    data,
    isLoading: false,
    isPending: false,
    isError: false,
    error: null
  };
}

// ---- Public reads ---------------------------------------------------

export const useListPages = () =>
  settled<PageSummary[]>(
    DEMO_PAGES.map(({ id, title, slug, template }) => ({
      id,
      title,
      slug,
      template
    }))
  );

export const useGetPageBySlug = (slug: string) =>
  settled<Page | undefined>(DEMO_PAGES.find((p) => p.slug === slug));

// ---- Admin reads ----------------------------------------------------

export const useAdminListPages = () => settled<Page[]>(DEMO_PAGES);

export const useAdminGetPage = (id: number, _options?: unknown) =>
  settled<Page | undefined>(DEMO_PAGES.find((p) => p.id === id));

// Reported as signed in so the admin is browsable straight from a link.
// AdminLayout bounces to /admin/login otherwise, and there is no session
// to establish without a server.
export const useAdminMe = () =>
  settled<AuthStatus>({ authenticated: true, username: 'demo' });

export const getAdminListPagesQueryKey = () => ['demo', 'admin', 'pages'] as const;
export const getAdminGetPageQueryKey = (id: number) =>
  ['demo', 'admin', 'page', id] as const;

// ---- Auth -----------------------------------------------------------

// Any credentials work: the login screen is part of the walkthrough, not a
// barrier, so nobody needs a password from the sales rep to look around.
export const useAdminLogin = () => ({
  isPending: false,
  mutate: (
    _vars: { data: { username: string; password: string } },
    options?: { onSuccess?: (res: AuthStatus) => void; onError?: () => void }
  ) => options?.onSuccess?.({ authenticated: true, username: 'demo' })
});

export const useAdminLogout = () => ({
  isPending: false,
  mutate: (_vars?: unknown, options?: { onSuccess?: () => void }) =>
    options?.onSuccess?.()
});

// ---- Writes (all inert) ---------------------------------------------

const blockedMutation = () => ({
  isPending: false,
  mutate: (_vars?: unknown, _options?: unknown) => demoNotice()
});

export const useAdminCreatePage = blockedMutation;
export const useAdminUpdatePage = blockedMutation;
export const useAdminDeletePage = blockedMutation;

export { demoNotice };
