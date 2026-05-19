import type { MetadataRoute } from 'next';

/**
 * Sitemap stub. Will be wired to Supabase once the schema lands in a later commit.
 * Returns the root entry only so the route stays valid and indexable.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://openbook.ie';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0
    }
  ];
}
