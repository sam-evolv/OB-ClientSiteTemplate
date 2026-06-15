import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';

/**
 * Retrieval crawlers used by AI search and answer engines, plus the classic
 * search bots. They are explicitly allowed so every tenant site is crawlable
 * and citable. What actually gets INDEXED is controlled per-page by the meta
 * robots tag (see buildMetadata), not here — robots.txt allows crawling so the
 * crawlers can read each page and honour its noindex/canonical. Training-only
 * crawlers are intentionally NOT disallowed.
 */
const AI_AND_SEARCH_BOTS = [
  'OAI-SearchBot',
  'ChatGPT-User',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Googlebot',
  'Bingbot'
];

// Host-aware so each tenant domain points at its own sitemap.
export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get('host')?.split(':')[0];
  const base = host ? `https://${host}` : process.env.NEXT_PUBLIC_SITE_URL || 'https://openbook.ie';

  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: AI_AND_SEARCH_BOTS, allow: '/' }
    ],
    sitemap: `${base}/sitemap.xml`
  };
}
