import type { Locale } from '../i18n';
import { isLocale } from '../i18n';

/** The fields the pure helpers need — a structural subset of an idea entry. */
export interface IdeaRef {
  id: string;
  /** Raw Markdown body (present on collection entries) — used for search. */
  body?: string;
  data: {
    name: string;
    tagline: string;
    sector: string;
    city: string;
    yearsActive: { start: number; end?: number };
    status: string;
    reasons: string[];
    draft: boolean;
    founders?: { name: string }[];
  };
}

/**
 * Normalizes text for search across English, Dari, and Pashto:
 * lowercases, strips Arabic diacritics, unifies letter variants that users
 * type interchangeably (ي/ی, ك/ک, آ/أ/إ/ا, ة/ه), and treats ZWNJ as a space
 * so «قدم‌ها» matches «قدم ها».
 */
export function normalizeSearchText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[ً-ٰٟ]/g, '')
    .replace(/‌/g, ' ')
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[أإآ]/g, 'ا')
    .replace(/[ةۀ]/g, 'ه')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Splits a localized collection entry id like "fa/aseel-express" into locale and slug. */
export function parseContentId(id: string): { locale: Locale; slug: string } {
  const slash = id.indexOf('/');
  const locale = slash === -1 ? '' : id.slice(0, slash);
  const slug = id.slice(slash + 1);
  if (slash === -1 || !isLocale(locale) || slug.length === 0) {
    throw new Error(
      `Content file "${id}" must live in a language folder: en/, fa/ or ps/ (e.g. en/my-startup.md)`,
    );
  }
  return { locale, slug };
}

/**
 * Related ideas: shares sector (2 points) or city (1 point) with `idea`;
 * highest score first, ties broken by more recent start year.
 */
export function getRelated<T extends IdeaRef>(idea: T, all: T[], limit = 3): T[] {
  return all
    .filter((s) => s.id !== idea.id && !s.data.draft)
    .map((s) => ({
      s,
      score:
        (s.data.sector === idea.data.sector ? 2 : 0) + (s.data.city === idea.data.city ? 1 : 0),
    }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || b.s.data.yearsActive.start - a.s.data.yearsActive.start)
    .slice(0, limit)
    .map((r) => r.s);
}

/** Entry for the client-side filter index embedded in the ideas page. */
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
  /** Normalized haystack for free-text search. */
  search: string;
}

/** How much of an idea's body text is searchable (keeps the embedded index small). */
const SEARCH_BODY_LIMIT = 2000;

export function buildFilterIndex(
  ideas: IdeaRef[],
  /** Extra locale-specific searchable text per idea, e.g. translated sector/status labels. */
  extraSearchText?: (idea: IdeaRef) => string,
): FilterEntry[] {
  return ideas
    .filter((s) => !s.data.draft)
    .map((s) => ({
      slug: parseContentId(s.id).slug,
      name: s.data.name,
      tagline: s.data.tagline,
      sector: s.data.sector,
      city: s.data.city,
      yearStart: s.data.yearsActive.start,
      yearEnd: s.data.yearsActive.end ?? null,
      status: s.data.status,
      reasons: s.data.reasons,
      search: normalizeSearchText(
        [
          s.data.name,
          s.data.tagline,
          s.data.city,
          ...(s.data.founders?.map((f) => f.name) ?? []),
          extraSearchText?.(s) ?? '',
          (s.body ?? '').slice(0, SEARCH_BODY_LIMIT),
        ].join(' '),
      ),
    }));
}

/** Groups ideas by start year, most recent year first. */
export function groupByYear<T extends IdeaRef>(ideas: T[]): { year: number; ideas: T[] }[] {
  const byYear = new Map<number, T[]>();
  for (const s of ideas) {
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
      ideas: grouped.sort((a, b) => a.data.name.localeCompare(b.data.name)),
    }));
}

/** A deterministic hue for monogram/avatar fallbacks, derived from a slug. */
export function hueFromSlug(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) % 360;
  return hash;
}
