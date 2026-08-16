import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { copyFileSync, mkdirSync } from "fs";
import { PAGE_IDS, PAGE_SLUGS } from "./src/routes";

// Both of these have sensible defaults on purpose. A static `vite build` never
// starts a server, so failing the build over a dev-server port is wrong — and
// a repo that cannot be cloned and built without hidden environment variables
// is a trap for whoever picks it up next (including CI).
const port = Number(process.env.PORT ?? 5173);
const basePath = process.env.BASE_PATH ?? "/";

// Every client-side route, written out as a real <route>/index.html copy of the
// app shell.
//
// A single SPA fallback is not enough on GitHub Pages: it only honours a
// 404.html at the *site* root, not one nested inside a project subdirectory, so
// /austin-heart/admin returned a hard 404 before the router ever loaded. Real
// files sidestep host-specific rewrite rules altogether, and work identically
// on Cloudflare Pages. 404.html is still emitted as a backstop for anything not
// listed here.
function staticRouteShells() {
  return {
    name: "static-route-shells",
    closeBundle() {
      const out = path.resolve(import.meta.dirname, "dist/public");
      const shell = path.join(out, "index.html");

      const routes = [
        "terms",
        "privacy",
        "admin",
        "admin/login",
        "admin/pages/add",
        ...PAGE_SLUGS.filter((slug) => slug !== "home").map((slug) => `page/${slug}`),
        ...PAGE_IDS.map((id) => `admin/pages/${id}/edit`),
      ];

      for (const route of routes) {
        const dir = path.join(out, route);
        mkdirSync(dir, { recursive: true });
        copyFileSync(shell, path.join(dir, "index.html"));
      }

      copyFileSync(shell, path.join(out, "404.html"));
      console.log(`static-route-shells: wrote ${routes.length} route shells`);
    },
  };
}

export default defineConfig({
  base: basePath,
  plugins: [react(), tailwindcss(), staticRouteShells()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
