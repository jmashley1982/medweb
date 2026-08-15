import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { copyFileSync } from "fs";

// Both of these have sensible defaults on purpose. A static `vite build` never
// starts a server, so failing the build over a dev-server port is wrong — and
// a repo that cannot be cloned and built without hidden environment variables
// is a trap for whoever picks it up next (including CI).
const port = Number(process.env.PORT ?? 5173);
const basePath = process.env.BASE_PATH ?? "/";

// GitHub Pages has no rewrite rules, so a deep link like /page/services would
// 404 before the SPA router ever loads. Serving the same document as 404.html
// makes Pages hand those URLs to the app instead. Cloudflare Pages uses
// public/_redirects for the same job and ignores this file.
function spaFallback404() {
  return {
    name: "spa-fallback-404",
    closeBundle() {
      const out = path.resolve(import.meta.dirname, "dist/public");
      copyFileSync(path.join(out, "index.html"), path.join(out, "404.html"));
    },
  };
}

export default defineConfig({
  base: basePath,
  plugins: [react(), tailwindcss(), spaFallback404()],
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
