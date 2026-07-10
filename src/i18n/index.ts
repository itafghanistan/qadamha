import en from './en.json';
import fa from './fa.json';
import ps from './ps.json';

export const LOCALES = ['en', 'fa', 'ps'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export interface LocaleMeta {
  /** English name of the language */
  name: string;
  /** Name of the language in itself */
  nativeName: string;
  dir: 'ltr' | 'rtl';
  /** BCP 47 tag used in <html lang> and hreflang */
  htmlLang: string;
  /** Locale passed to Intl APIs (digits, dates) */
  intlLocale: string;
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  en: { name: 'English', nativeName: 'English', dir: 'ltr', htmlLang: 'en', intlLocale: 'en' },
  fa: { name: 'Dari', nativeName: 'دری', dir: 'rtl', htmlLang: 'fa-AF', intlLocale: 'fa-AF' },
  ps: { name: 'Pashto', nativeName: 'پښتو', dir: 'rtl', htmlLang: 'ps', intlLocale: 'ps-AF' },
};

const DICTS: Record<Locale, Record<string, string>> = { en, fa, ps };

export function isLocale(x: string): x is Locale {
  return (LOCALES as readonly string[]).includes(x);
}

export type Translator = (key: string, vars?: Record<string, string | number>) => string;

/**
 * Returns a translator for the locale. Missing keys fall back to English,
 * then to the key itself. `{var}` placeholders are interpolated.
 */
export function useTranslations(locale: Locale): Translator {
  return (key, vars) => {
    let text = DICTS[locale][key] ?? DICTS[DEFAULT_LOCALE][key] ?? key;
    if (vars) {
      for (const [name, value] of Object.entries(vars)) {
        text = text.replaceAll(`{${name}}`, String(value));
      }
    }
    return text;
  };
}

/** Prefixes a site-relative path with the locale: localizePath('fa', '/ideas/') → '/fa/ideas/' */
export function localizePath(locale: Locale, path = '/'): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return p === '/' ? `/${locale}/` : `/${locale}${p}`;
}

/** Formats a number with the locale's digits (e.g. ۱۲ for fa/ps). */
export function formatNumber(locale: Locale, n: number): string {
  return new Intl.NumberFormat(LOCALE_META[locale].intlLocale).format(n);
}

/** Formats a year with locale digits but no grouping separators (2020, not 2,020). */
export function formatYear(locale: Locale, year: number): string {
  return new Intl.NumberFormat(LOCALE_META[locale].intlLocale, { useGrouping: false }).format(year);
}

/** Key sets of all dictionaries — exported for the structural sync test. */
export const DICTIONARY_KEYS: Record<Locale, string[]> = {
  en: Object.keys(en),
  fa: Object.keys(fa),
  ps: Object.keys(ps),
};
