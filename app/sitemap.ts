import type { MetadataRoute } from 'next';
import { getAllBusinessSlugs } from '../lib/business';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://openbook.ie';
  const slugs = await getAllBusinessSlugs();

  return slugs.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9
  }));
}
