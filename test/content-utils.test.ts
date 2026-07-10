import { describe, expect, it } from 'vitest';
import {
  buildFilterIndex,
  getRelated,
  groupByYear,
  normalizeSearchText,
  parseContentId,
  type IdeaRef,
} from '../src/lib/content-utils';

function idea(
  id: string,
  data: Partial<IdeaRef['data']> & Pick<IdeaRef['data'], 'sectors' | 'city'>,
  body = '',
): IdeaRef {
  return {
    id,
    body,
    data: {
      name: id,
      tagline: 'tagline',
      yearsActive: { start: 2018 },
      status: 'stopped',
      reasons: ['war'],
      draft: false,
      ...data,
    },
  };
}

describe('parseContentId', () => {
  it('splits locale and slug', () => {
    expect(parseContentId('fa/aseel-express')).toEqual({ locale: 'fa', slug: 'aseel-express' });
    expect(parseContentId('en/nested/slug')).toEqual({ locale: 'en', slug: 'nested/slug' });
  });

  it('rejects files outside a language folder', () => {
    expect(() => parseContentId('aseel-express')).toThrow(/language folder/);
    expect(() => parseContentId('de/aseel-express')).toThrow(/language folder/);
  });
});

describe('normalizeSearchText', () => {
  it('lowercases and collapses whitespace', () => {
    expect(normalizeSearchText('  Aseel   Express ')).toBe('aseel express');
  });

  it('unifies Arabic-script variants so users can search either way', () => {
    // Arabic yeh/kaf vs Persian yeh/keheh
    expect(normalizeSearchText('علي')).toBe(normalizeSearchText('علی'));
    expect(normalizeSearchText('كابل')).toBe(normalizeSearchText('کابل'));
    // ZWNJ treated as a space: «قدم‌ها» matches «قدم ها»
    expect(normalizeSearchText('قدم‌ها')).toBe('قدم ها');
  });
});

describe('getRelated', () => {
  const target = idea('en/a', { sectors: ['fintech'], city: 'Kabul' });
  const sameSector = idea('en/b', { sectors: ['fintech'], city: 'Herat' });
  const sameCity = idea('en/c', { sectors: ['media'], city: 'Kabul' });
  const both = idea('en/d', { sectors: ['fintech'], city: 'Kabul' });
  const unrelated = idea('en/e', { sectors: ['gaming'], city: 'Mazar-i-Sharif' });
  const draft = idea('en/f', { sectors: ['fintech'], city: 'Kabul', draft: true });

  it('ranks sector+city > sector > city and excludes self, drafts, unrelated', () => {
    const related = getRelated(target, [target, sameSector, sameCity, both, unrelated, draft]);
    expect(related.map((s) => s.id)).toEqual(['en/d', 'en/b', 'en/c']);
  });

  it('respects the limit', () => {
    expect(getRelated(target, [sameSector, sameCity, both], 1)).toHaveLength(1);
  });

  it('matches when any category overlaps (multi-category ideas)', () => {
    const multi = idea('en/g', { sectors: ['gaming', 'fintech'], city: 'Herat' });
    expect(getRelated(target, [multi, unrelated]).map((s) => s.id)).toEqual(['en/g']);
  });
});

describe('buildFilterIndex', () => {
  it('maps fields, builds a search haystack, and excludes drafts', () => {
    const s = idea('en/a', { sectors: ['edtech'], city: 'Herat' }, 'She recorded video lessons.');
    s.data.name = 'Dars Online';
    s.data.yearsActive = { start: 2016, end: 2021 };
    s.data.founders = [{ name: 'Zahra Hosseini' }];
    const draft = idea('en/b', { sectors: ['edtech'], city: 'Herat', draft: true });

    const index = buildFilterIndex([s, draft], () => 'Edtech Stopped');
    expect(index).toHaveLength(1);
    const entry = index[0]!;
    expect(entry.slug).toBe('a');
    expect(entry.yearStart).toBe(2016);
    expect(entry.yearEnd).toBe(2021);
    // Haystack covers name, founders, body, and the extra localized labels.
    expect(entry.search).toContain('dars online');
    expect(entry.search).toContain('zahra hosseini');
    expect(entry.search).toContain('video lessons');
    expect(entry.search).toContain('edtech stopped');
  });
});

describe('groupByYear', () => {
  it('groups by start year, newest year first, ideas alphabetical', () => {
    const a = idea('en/a', { sectors: ['media'], city: 'Kabul' });
    a.data.yearsActive = { start: 2015 };
    const b = idea('en/b', { sectors: ['media'], city: 'Kabul' });
    b.data.yearsActive = { start: 2020 };
    const c = idea('en/c', { sectors: ['media'], city: 'Kabul' });
    c.data.yearsActive = { start: 2020 };
    c.data.name = 'Aaa';
    const groups = groupByYear([a, b, c]);
    expect(groups.map((g) => g.year)).toEqual([2020, 2015]);
    expect(groups[0]!.ideas.map((s) => s.data.name)).toEqual(['Aaa', 'en/b']);
  });
});
