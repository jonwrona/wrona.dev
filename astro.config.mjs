// @ts-check
import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  integrations: [],
  adapter: node({
    mode: "standalone",
  }),
});