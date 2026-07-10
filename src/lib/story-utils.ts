import type { Locale } from '../i18n';
import { isLocale } from '../i18n';

/** The fields the pure helpers need — a structural subset of a story entry. */
export interface StoryRef {
  id: string;
  data: {
    name: string;
    tagline: string;
    sector: string;
    city: string;
    yearsActive: { start: number; end?: number };
    status: string;
    reasons: string[];
    draft: boolean;
  };
}

/** Splits a collection entry id like "fa/aseel-express" into locale and slug. */
export function parseStoryId(id: string): { locale: Locale; slug: string } {
  const slash = id.indexOf('/');
  const locale = slash === -1 ? '' : id.slice(0, slash);
  const slug = id.slice(slash + 1);
  if (slash === -1 || !isLocale(locale) || slug.length === 0) {
    throw new Error(
      `Story file "${id}" must live in a language folder: en/, fa/ or ps/ (e.g. en/my-startup.md)`,
    );
  }
  return { locale, slug };
}

/**
 * Related stories: shares sector (2 points) or city (1 point) with `story`;
 * highest score first, ties broken by more recent start year.
 */
export function getRelated<T extends StoryRef>(story: T, all: T[], limit = 3): T[] {
  return all
    .filter((s) => s.id !== story.id && !s.data.draft)
    .map((s) => ({
      s,
      score:
        (s.data.sector === story.data.sector ? 2 : 0) + (s.data.city === story.data.city ? 1 : 0),
    }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || b.s.data.yearsActive.start - a.s.data.yearsActive.start)
    .slice(0, limit)
    .map((r) => r.s);
}

/** Entry for the client-side filter index embedded in the stories page. */
export interface FilterEntry {
  slug: string;
  name: string;
  tagline: string;
  sector: string;
  city: string;
  yearStart: number;
  yearEnd: number | null;
  status: string;
  reasons: string[];
}

export function buildFilterIndex(stories: StoryRef[]): FilterEntry[] {
  return stories
    .filter((s) => !s.data.draft)
    .map((s) => ({
      slug: parseStoryId(s.id).slug,
      name: s.data.name,
      tagline: s.data.tagline,
      sector: s.data.sector,
      city: s.data.city,
      yearStart: s.data.yearsActive.start,
      yearEnd: s.data.yearsActive.end ?? null,
      status: s.data.status,
      reasons: s.data.reasons,
    }));
}

/** Groups stories by start year, most recent year first. */
export function groupByYear<T extends StoryRef>(stories: T[]): { year: number; stories: T[] }[] {
  const byYear = new Map<number, T[]>();
  for (const s of stories) {
    if (s.data.draft) continue;
    const year = s.data.yearsActive.start;
    const bucket = byYear.get(year) ?? [];
    bucket.push(s);
    byYear.set(year, bucket);
  }
  return [...byYear.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, grouped]) => ({
      year,
      stories: grouped.sort((a, b) => a.data.name.localeCompare(b.data.name)),
    }));
}
