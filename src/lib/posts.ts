import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n';
import { LOCALES } from '../i18n';
import { parseContentId } from './content-utils';

export type Post = CollectionEntry<'posts'>;

/** All published posts written in `locale`, newest first. */
export async function getPosts(locale: Locale): Promise<Post[]> {
  const all = await getCollection(
    'posts',
    (entry) => !entry.data.draft && parseContentId(entry.id).locale === locale,
  );
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Published posts in `locale` about the idea with this slug, newest first. */
export async function getPostsForIdea(locale: Locale, ideaSlug: string): Promise<Post[]> {
  return (await getPosts(locale)).filter((p) => p.data.idea === ideaSlug);
}

/** Published posts (any locale) authored by a person, newest first. */
export async function getPostsByPerson(personId: string): Promise<Post[]> {
  const all = await getCollection(
    'posts',
    (entry) => !entry.data.draft && entry.data.author.person === personId,
  );
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Locales in which a post slug exists (non-draft), in site order. */
export async function getPostTranslations(slug: string): Promise<Locale[]> {
  const entries = await getCollection(
    'posts',
    (entry) => !entry.data.draft && parseContentId(entry.id).slug === slug,
  );
  const present = new Set(entries.map((e) => parseContentId(e.id).locale));
  return LOCALES.filter((l) => present.has(l));
}

/** Extracts a YouTube video id from watch/short/embed URLs, or null. */
export function youTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,20})/,
  );
  return match?.[1] ?? null;
}
