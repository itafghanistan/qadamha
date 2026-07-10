import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n';
import type { Idea } from './ideas';

export type Person = CollectionEntry<'people'>;

export async function getPerson(id: string | undefined): Promise<Person | undefined> {
  if (!id) return undefined;
  return await getEntry('people', id);
}

export async function getPeople(): Promise<Person[]> {
  return await getCollection('people');
}

/** The person's display name for a locale (falls back to the base name). */
export function personName(person: Person, locale: Locale): string {
  if (locale === 'fa') return person.data.name_fa ?? person.data.name;
  if (locale === 'ps') return person.data.name_ps ?? person.data.name;
  return person.data.name;
}

/** Ideas (already filtered to a locale) this person founded or worked on. */
export function ideasForPerson(personId: string, ideas: Idea[]): Idea[] {
  return ideas.filter((idea) =>
    [...idea.data.founders, ...(idea.data.team ?? [])].some((c) => c.person === personId),
  );
}
