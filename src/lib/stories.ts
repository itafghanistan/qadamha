import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n';
import { LOCALES } from '../i18n';
import { parseStoryId } from './story-utils';

export type Story = CollectionEntry<'stories'>;

/** All published (non-draft) stories written in `locale`, newest first. */
export async function getStories(locale: Locale): Promise<Story[]> {
  const all = await getCollection(
    'stories',
    (entry) => !entry.data.draft && parseStoryId(entry.id).locale === locale,
  );
  return all.sort((a, b) => b.data.yearsActive.start - a.data.yearsActive.start);
}

/** Locales in which a story slug exists (non-draft), in site order. */
export async function getTranslations(slug: string): Promise<Locale[]> {
  const entries = await getCollection(
    'stories',
    (entry) => !entry.data.draft && parseStoryId(entry.id).slug === slug,
  );
  const present = new Set(entries.map((e) => parseStoryId(e.id).locale));
  return LOCALES.filter((l) => present.has(l));
}
