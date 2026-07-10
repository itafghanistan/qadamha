import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n';
import { isValidPersonId } from './content-utils';
import type { Idea } from './ideas';

export type Person = CollectionEntry<'people'>;

export { PERSON_ID_PATTERN, isValidPersonId } from './content-utils';

export async function getPerson(id: string | undefined): Promise<Person | undefined> {
  if (!id) return undefined;
  return await getEntry('people', id);
}

/**
 * Resolves a `person:` reference and FAILS THE BUILD if it is invalid or
 * missing, so a wrong username in any language can't slip through review.
 */
export async function requirePerson(
  id: string | undefined,
  referencedFrom: string,
): Promise<Person | undefined> {
  if (!id) return undefined;
  if (!isValidPersonId(id)) {
    throw new Error(
      `Invalid person username "${id}" in ${referencedFrom}: usernames are lowercase Latin ` +
        `letters, digits and dashes (e.g. "zahra-hosseini"), and the SAME username must be ` +
        `used in every language. Put localized names in the profile's name_fa/name_ps fields.`,
    );
  }
  const person = await getEntry('people', id);
  if (!person) {
    throw new Error(
      `Unknown person username "${id}" in ${referencedFrom}: no src/content/people/${id}.md ` +
        `exists. Create that profile, or fix the username — it must match the profile file ` +
        `name exactly, in every language.`,
    );
  }
  return person;
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
