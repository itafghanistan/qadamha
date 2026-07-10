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

const stories = defineCollection({
  // File ids look like "en/aseel-express" — language folder + slug.
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/stories' }),
  schema: z.object({
    name: z.string().min(1),
    tagline: z.string().min(1),
    founders: z
      .array(
        z.object({
          name: z.string().min(1),
          role: z.string().optional(),
          link: z.string().url().optional(),
        }),
      )
      .min(1),
    team: z.array(z.object({ name: z.string().min(1), role: z.string().optional() })).optional(),
    sector: z.enum(SECTORS),
    city: z.string().min(1),
    yearsActive: z.object({
      start: z.number().int().min(1900).max(2100),
      end: z.number().int().min(1900).max(2100).optional(),
    }),
    status: z.enum(STATUSES),
    reasons: z.array(z.enum(REASONS)).min(1),
    links: z.array(z.object({ label: z.string(), url: z.string().url() })).optional(),
    logo: z.string().optional(),
    sources: z.array(z.object({ label: z.string(), url: z.string().url() })).optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    /** Set on the seed stories so the site can label them as examples. */
    example: z.boolean().default(false),
  }),
});

export const collections = { stories };
