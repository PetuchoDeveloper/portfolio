// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// TODO(owner): replace with your real domain before going public.
// Used for canonical URLs, sitemap, and Open Graph tags.
const SITE = 'https://petucho.dev';

export default defineConfig({
  site: SITE,
  integrations: [sitemap()],
  trailingSlash: 'ignore',
  build: {
    inlineStylesheets: 'auto',
  },
});
