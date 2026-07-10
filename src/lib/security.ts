/**
 * Security helpers. The archive accepts content from community pull requests,
 * so everything in frontmatter and story bodies is untrusted input.
 */

/**
 * Serializes a value for embedding inside a <script> tag (JSON-LD, data
 * islands). JSON.stringify alone is NOT safe there: a string containing
 * "</script>" would close the tag and start a new, executable one. Escaping
 * `<` (plus the JS line separators) keeps the payload inert.
 */
export function jsonScript(value: unknown): string {
  return JSON.stringify(value)
    .replaceAll('<', '\\u003c')
    .replaceAll(' ', '\\u2028')
    .replaceAll(' ', '\\u2029');
}
