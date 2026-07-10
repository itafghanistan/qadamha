// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// GitHub Pages project site: served at https://itafghanistan.github.io/qadamha/
// When a custom domain arrives: set site to it, base to '/', and update
// SITE_URL in src/config.ts.
export const SITE = 'https://itafghanistan.github.io';

export default defineConfig({
  site: SITE,
  base: '/qadamha',
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          fa: 'fa-AF',
          ps: 'ps',
        },
      },
    }),
  ],
});
