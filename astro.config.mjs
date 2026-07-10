// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// The canonical production URL. Change this once when the real domain is ready.
export const SITE = 'https://qadamha.org';

export default defineConfig({
  site: SITE,
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
