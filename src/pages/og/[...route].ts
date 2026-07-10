import { getCollection } from 'astro:content';
import { OGImageRoute } from 'astro-og-canvas';
import { LOCALES, LOCALE_META, useTranslations } from '../../i18n';
import { parseContentId } from '../../lib/content-utils';

interface OgPage {
  title: string;
  description: string;
  dir: 'ltr' | 'rtl';
}

const pages: Record<string, OgPage> = {};

// One branded card per language for section pages (home, ideas, timeline…).
for (const locale of LOCALES) {
  const t = useTranslations(locale);
  pages[`site-${locale}`] = {
    title: locale === 'en' ? 'Qadamha — قدم‌ها' : `قدم‌ها — ${t('site.name')}`,
    description: t('site.tagline'),
    dir: LOCALE_META[locale].dir,
  };
}

// One card per idea per language.
const ideas = await getCollection('ideas', (entry) => !entry.data.draft);
for (const idea of ideas) {
  const { locale, slug } = parseContentId(idea.id);
  pages[`ideas/${locale}/${slug}`] = {
    title: idea.data.name,
    description: idea.data.tagline,
    dir: LOCALE_META[locale].dir,
  };
}

// One card per post per language.
const posts = await getCollection('posts', (entry) => !entry.data.draft);
for (const post of posts) {
  const { locale, slug } = parseContentId(post.id);
  pages[`posts/${locale}/${slug}`] = {
    title: post.data.title,
    description: useTranslations(locale)(`post.type.${post.data.type}`),
    dir: LOCALE_META[locale].dir,
  };
}

export const { getStaticPaths, GET } = await OGImageRoute({
  pages,
  getImageOptions: (_path, page: OgPage) => ({
    title: page.title,
    description: page.description,
    dir: page.dir,
    bgGradient: [
      [13, 19, 33],
      [26, 35, 64],
    ],
    border: { color: [232, 163, 61], width: 12, side: 'block-end' },
    padding: 70,
    font: {
      title: {
        color: [242, 183, 85],
        size: 64,
        weight: 'Bold',
        lineHeight: 1.25,
        families: ['Vazirmatn'],
      },
      description: {
        color: [236, 233, 226],
        size: 34,
        lineHeight: 1.5,
        families: ['Vazirmatn'],
      },
    },
    fonts: ['./src/assets/fonts/Vazirmatn-Bold.ttf', './src/assets/fonts/Vazirmatn-Regular.ttf'],
  }),
});
