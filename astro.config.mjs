// @ts-check
import { defineConfig, envField } from "astro/config";

import vercel from "@astrojs/vercel";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  adapter: vercel(),
  env: {
    schema: {
      NOCODB_KEY: envField.string({
        context: "server",
        access: "secret",
      }),
      NOCODB_URL: envField.string({
        context: "server",
        access: "secret",
      }),
    },
  },
});
