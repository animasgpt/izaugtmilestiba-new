import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createClient } from "@sanity/client";
import { SITE_QUERY } from "./cms/query";
import type { SiteSnapshot } from "./cms/model";

// https://vitejs.dev/config/
export default defineConfig(async ({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  let initialSnapshot: SiteSnapshot | null = null;
  if (command === "build") {
    for (const name of ["VITE_SUPABASE_URL", "VITE_SUPABASE_PUBLISHABLE_KEY"]) {
      if (!env[name] || env[name].includes("YOUR_")) {
        throw new Error(`Set ${name} in Vercel or .env.local before building.`);
      }
    }
    // Ship actual published content with the site, so first paint never waits
    // for a browser-to-Sanity round trip. Browser refreshes still run normally.
    initialSnapshot = await createClient({
      projectId: env.VITE_SANITY_PROJECT_ID || "sxvw8jh8",
      dataset: env.VITE_SANITY_DATASET || "production",
      apiVersion: "2026-09-10", useCdn: false, perspective: "published",
      timeout: 20_000, maxRetries: 1,
    }).fetch<SiteSnapshot>(SITE_QUERY);
    if (!initialSnapshot || !Array.isArray(initialSnapshot.pages)) {
      throw new Error("Sanity did not return a valid published site snapshot.");
    }
  }
  return {
    define: { __CMS_INITIAL_SNAPSHOT__: JSON.stringify(initialSnapshot) },
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
