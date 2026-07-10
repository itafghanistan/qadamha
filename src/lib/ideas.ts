import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n';
import { LOCALES } from '../i18n';
import { parseContentId } from './content-utils';

export type Idea = CollectionEntry<'ideas'>;

/** All published (non-draft) ideas written in `locale`, newest first. */
export async function getIdeas(locale: Locale): Promise<Idea[]> {
  const all = await getCollection(
    'ideas',
    (entry) => !entry.data.draft && parseContentId(entry.id).locale === locale,
  );
  return all.sort((a, b) => b.data.yearsActive.start - a.data.yearsActive.start);
}

/** Locales in which an idea slug exists (non-draft), in site order. */
export async function getIdeaTranslations(slug: string): Promise<Locale[]> {
  const entries = await getCollection(
    'ideas',
    (entry) => !entry.data.draft && parseContentId(entry.id).slug === slug,
  );
  const present = new Set(entries.map((e) => parseContentId(e.id).locale));
  return LOCALES.filter((l) => present.has(l));
}
