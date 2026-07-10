import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const SECTORS = [
  'fintech',
  'edtech',
  'healthtech',
  'ecommerce',
  'media',
  'agritech',
  'logistics',
  'energy',
  'social',
  'gaming',
  'tooling',
  'other',
] as const;

export const STATUSES = ['stopped', 'paused', 'incomplete'] as const;

export const REASONS = [
  'war',
  'funding',
  'migration',
  'sanctions',
  'market',
  'infrastructure',
  'regulation',
  'team',
  'personal',
  'other',
] as const;

export const POST_TYPES = ['story', 'update', 'opinion', 'video'] as const;

/**
 * Content arrives via community pull requests, so URL fields must be
 * http(s) only — httpUrl alone would accept javascript: URLs,
 * which become clickable script execution when rendered as links.
 */
const httpUrl = z
  .string()
  .url()
  .refine((u) => u.startsWith('https://') || u.startsWith('http://'), {
    message: 'must be an http:// or https:// URL',
  });

/** Images must live in this repository under public/ — no external URLs. */
const sitePath = z
  .string()
  .regex(/^\/[a-zA-Z0-9_\-./]+$/, {
    message: 'must be a site-relative path under public/, e.g. /logos/my-startup.svg',
  })
  .refine((p) => !p.includes('..'), { message: 'must not contain ".."' });

/** A person credited on an idea. `person` links to an entry in the people collection. */
const credit = z.object({
  name: z.string().min(1),
  role: z.string().optional(),
  person: z.string().optional(),
  link: httpUrl.optional(),
});

const ideas = defineCollection({
  // File ids look like "en/aseel-express" — language folder + slug.
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/ideas' }),
  schema: z.object({
    name: z.string().min(1),
    tagline: z.string().min(1),
    /** Path under public/, e.g. "/logos/aseel-express.svg". Cards show a monogram if missing. */
    logo: sitePath.optional(),
    founders: z.array(credit).min(1),
    team: z.array(credit).optional(),
    /** One or more categories — an idea can belong to several at once. */
    sectors: z.array(z.enum(SECTORS)).min(1),
    city: z.string().min(1),
    yearsActive: z.object({
      start: z.number().int().min(1900).max(2100),
      end: z.number().int().min(1900).max(2100).optional(),
    }),
    status: z.enum(STATUSES),
    reasons: z.array(z.enum(REASONS)).min(1),
    /** Snapshot of the product on the Wayback Machine (or similar) — shown prominently in the sidebar. */
    archive: httpUrl.optional(),
    /** Screenshot of the product (path under public/, e.g. "/screenshots/my-app.png") shown inside the archive preview card. */
    archiveImage: sitePath.optional(),
    links: z.array(z.object({ label: z.string(), url: httpUrl })).optional(),
    sources: z.array(z.object({ label: z.string(), url: httpUrl })).optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    /** Set on the seed ideas so the site can label them as examples. */
    example: z.boolean().default(false),
  }),
});

const posts = defineCollection({
  // Same layout as ideas: "fa/my-post" — language folder + slug links translations.
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string().min(1),
    date: z.coerce.date(),
    type: z.enum(POST_TYPES),
    /** Slug of the idea this post is about (optional — posts can stand alone). */
    idea: z.string().optional(),
    author: z.object({
      /** Id of an entry in the people collection (preferred — shows avatar + profile link). */
      person: z.string().optional(),
      /** Fallback display name when there is no profile. */
      name: z.string().optional(),
    }),
    /** YouTube URL for video posts — embedded on the post page. */
    videoUrl: httpUrl.optional(),
    draft: z.boolean().default(false),
    example: z.boolean().default(false),
  }),
});

const people = defineCollection({
  // Flat folder; the file name is the person id, e.g. "zahra-hosseini.md".
  loader: glob({ pattern: '[^_]*.md', base: './src/content/people' }),
  schema: z.object({
    name: z.string().min(1),
    /** Display names for RTL pages; fall back to `name`. */
    name_fa: z.string().optional(),
    name_ps: z.string().optional(),
    /** Path under public/, e.g. "/avatars/zahra-hosseini.svg". */
    avatar: sitePath.optional(),
    city: z.string().optional(),
    links: z.array(z.object({ label: z.string(), url: httpUrl })).optional(),
    example: z.boolean().default(false),
  }),
});

export const collections = { ideas, posts, people };
