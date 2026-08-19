// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Used for canonical URLs, sitemap, and Open Graph tags.
const SITE = 'https://kevinvarick.dev';

export default defineConfig({
  site: SITE,
  integrations: [sitemap()],
  trailingSlash: 'ignore',
  build: {
    inlineStylesheets: 'auto',
  },
});
