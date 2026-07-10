/** Single place for project-wide constants. */

/**
 * Origin of the production site (no path). The site is currently served from
 * GitHub Pages under the /qadamha base path — when a custom domain arrives,
 * change this and set `base` in astro.config.mjs back to '/'.
 */
export const SITE_URL = 'https://itafghanistan.github.io';

/**
 * Prefixes a site-relative path (e.g. "/favicon.svg") with the deploy base
 * path. Use for assets and any URL not built via localizePath().
 */
export function withBase(path: string): string {
  const base = (import.meta.env.BASE_URL ?? '/').replace(/\/+$/, '');
  return path.startsWith('/') ? `${base}${path}` : `${base}/${path}`;
}

export const GITHUB_REPO = 'https://github.com/itafghanistan/qadamha';
export const GITHUB_IDEA_PATH = `${GITHUB_REPO}/blob/main/src/content/ideas`;
export const GITHUB_NEW_STORY_ISSUE = `${GITHUB_REPO}/issues/new/choose`;
export const GITHUB_NEW_ISSUE = `${GITHUB_REPO}/issues/new`;
export const GITHUB_CONTENT_PATH = `${GITHUB_REPO}/blob/main/src/content`;
/** Submissions from the /submit form that choose email instead of GitHub. */
export const CONTACT_EMAIL = 'rashid.obaidi2003@gmail.com';
