import type { MetadataRoute } from 'next';

const baseUrl = 'https://www.shwan-orthodontics.com';
const locales = ['en', 'ar'];

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified: '2026-05-11',
    changeFrequency: 'monthly',
    priority: 1,
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `${baseUrl}/${l}`])),
    },
  }));
}
