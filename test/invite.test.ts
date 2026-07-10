import { describe, expect, it } from 'vitest';
import { buildInviteSearch } from '../src/lib/invite';

describe('buildInviteSearch', () => {
  it('builds a query string with just the idea when name is blank', () => {
    expect(buildInviteSearch('Same-day delivery app', '')).toBe(
      '?idea=Same-day+delivery+app',
    );
  });

  it('includes name when provided', () => {
    expect(buildInviteSearch('Same-day delivery app', 'Bilal')).toBe(
      '?idea=Same-day+delivery+app&name=Bilal',
    );
  });

  it('trims whitespace from both fields', () => {
    expect(buildInviteSearch('  An idea  ', '  Bilal  ')).toBe('?idea=An+idea&name=Bilal');
  });

  it('omits name when it is only whitespace', () => {
    expect(buildInviteSearch('An idea', '   ')).toBe('?idea=An+idea');
  });

  it('encodes special characters', () => {
    const search = buildInviteSearch('Farmers & markets?', 'Zahra Hosseini');
    const params = new URLSearchParams(search);
    expect(params.get('idea')).toBe('Farmers & markets?');
    expect(params.get('name')).toBe('Zahra Hosseini');
  });

  it('returns an empty string when idea is blank', () => {
    expect(buildInviteSearch('', 'Bilal')).toBe('');
    expect(buildInviteSearch('   ', '')).toBe('');
  });
});
