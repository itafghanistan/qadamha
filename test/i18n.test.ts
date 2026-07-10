import { describe, expect, it } from 'vitest';
import {
  DICTIONARY_KEYS,
  LOCALES,
  formatNumber,
  formatYear,
  isLocale,
  localizePath,
  useTranslations,
} from '../src/i18n';

describe('dictionaries', () => {
  it('all locales have exactly the same keys', () => {
    const enKeys = [...DICTIONARY_KEYS.en].sort();
    for (const locale of LOCALES) {
      expect([...DICTIONARY_KEYS[locale]].sort(), `keys of ${locale}.json`).toEqual(enKeys);
    }
  });

  it('no dictionary value is empty', () => {
    for (const locale of LOCALES) {
      const t = useTranslations(locale);
      for (const key of DICTIONARY_KEYS[locale]) {
        expect(t(key).trim(), `${locale}:${key}`).not.toBe('');
      }
    }
  });
});

describe('useTranslations', () => {
  it('returns the translated string', () => {
    expect(useTranslations('en')('nav.stories')).toBe('Stories');
    expect(useTranslations('fa')('nav.stories')).toBe('داستان‌ها');
    expect(useTranslations('ps')('nav.stories')).toBe('کیسې');
  });

  it('falls back to English, then to the key', () => {
    const t = useTranslations('fa');
    expect(t('definitely.not.a.key')).toBe('definitely.not.a.key');
  });

  it('interpolates variables', () => {
    expect(useTranslations('en')('home.count', { count: 12 })).toBe('12 steps recorded so far');
  });
});

describe('isLocale / localizePath', () => {
  it('recognizes supported locales only', () => {
    expect(isLocale('fa')).toBe(true);
    expect(isLocale('de')).toBe(false);
  });

  it('builds localized paths', () => {
    expect(localizePath('en')).toBe('/en/');
    expect(localizePath('fa', '/stories/')).toBe('/fa/stories/');
    expect(localizePath('ps', 'timeline/')).toBe('/ps/timeline/');
  });
});

describe('formatNumber', () => {
  it('uses locale digits', () => {
    expect(formatNumber('en', 42)).toBe('42');
    expect(formatNumber('fa', 42)).toBe('۴۲');
  });
});

describe('formatYear', () => {
  it('renders years without grouping separators', () => {
    expect(formatYear('en', 2020)).toBe('2020');
    expect(formatYear('fa', 2020)).toBe('۲۰۲۰');
  });
});
