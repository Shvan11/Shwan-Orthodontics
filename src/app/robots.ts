import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin-supabase', '/api/'],
      },
    ],
    sitemap: 'https://shwanorthodontics.com/sitemap.xml',
  };
}
