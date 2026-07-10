/**
 * Builds the query string for an invite link: `?idea=...` or
 * `?idea=...&name=...`. Both inputs are trimmed; a blank name is omitted
 * entirely rather than sent as an empty param. Returns '' if idea is blank.
 */
export function buildInviteSearch(idea: string, name: string): string {
  const trimmedIdea = idea.trim();
  if (!trimmedIdea) return '';

  const params = new URLSearchParams({ idea: trimmedIdea });
  const trimmedName = name.trim();
  if (trimmedName) params.set('name', trimmedName);
  return `?${params.toString()}`;
}
