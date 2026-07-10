import { describe, expect, it } from 'vitest';
import {
  buildFilterIndex,
  getRelated,
  groupByYear,
  parseStoryId,
  type StoryRef,
} from '../src/lib/story-utils';

function story(
  id: string,
  data: Partial<StoryRef['data']> & Pick<StoryRef['data'], 'sector' | 'city'>,
): StoryRef {
  return {
    id,
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

describe('parseStoryId', () => {
  it('splits locale and slug', () => {
    expect(parseStoryId('fa/aseel-express')).toEqual({ locale: 'fa', slug: 'aseel-express' });
    expect(parseStoryId('en/nested/slug')).toEqual({ locale: 'en', slug: 'nested/slug' });
  });

  it('rejects files outside a language folder', () => {
    expect(() => parseStoryId('aseel-express')).toThrow(/language folder/);
    expect(() => parseStoryId('de/aseel-express')).toThrow(/language folder/);
  });
});

describe('getRelated', () => {
  const target = story('en/a', { sector: 'fintech', city: 'Kabul' });
  const sameSector = story('en/b', { sector: 'fintech', city: 'Herat' });
  const sameCity = story('en/c', { sector: 'media', city: 'Kabul' });
  const both = story('en/d', { sector: 'fintech', city: 'Kabul' });
  const unrelated = story('en/e', { sector: 'gaming', city: 'Mazar-i-Sharif' });
  const draft = story('en/f', { sector: 'fintech', city: 'Kabul', draft: true });

  it('ranks sector+city > sector > city and excludes self, drafts, unrelated', () => {
    const related = getRelated(target, [target, sameSector, sameCity, both, unrelated, draft]);
    expect(related.map((s) => s.id)).toEqual(['en/d', 'en/b', 'en/c']);
  });

  it('respects the limit', () => {
    expect(getRelated(target, [sameSector, sameCity, both], 1)).toHaveLength(1);
  });
});

describe('buildFilterIndex', () => {
  it('maps fields and excludes drafts', () => {
    const s = story('en/a', { sector: 'edtech', city: 'Herat' });
    s.data.yearsActive = { start: 2016, end: 2021 };
    const draft = story('en/b', { sector: 'edtech', city: 'Herat', draft: true });
    const index = buildFilterIndex([s, draft]);
    expect(index).toEqual([
      {
        slug: 'a',
        name: 'en/a',
        tagline: 'tagline',
        sector: 'edtech',
        city: 'Herat',
        yearStart: 2016,
        yearEnd: 2021,
        status: 'stopped',
        reasons: ['war'],
      },
    ]);
  });
});

describe('groupByYear', () => {
  it('groups by start year, newest year first, stories alphabetical', () => {
    const a = story('en/a', { sector: 'media', city: 'Kabul' });
    a.data.yearsActive = { start: 2015 };
    const b = story('en/b', { sector: 'media', city: 'Kabul' });
    b.data.yearsActive = { start: 2020 };
    const c = story('en/c', { sector: 'media', city: 'Kabul' });
    c.data.yearsActive = { start: 2020 };
    c.data.name = 'Aaa';
    const groups = groupByYear([a, b, c]);
    expect(groups.map((g) => g.year)).toEqual([2020, 2015]);
    expect(groups[0]!.stories.map((s) => s.data.name)).toEqual(['Aaa', 'en/b']);
  });
});
