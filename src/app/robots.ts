import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/auth/', '/mypage/', '/register/'] }],
    sitemap: 'https://trimming.michi-biki.jp/sitemap.xml',
  };
}
