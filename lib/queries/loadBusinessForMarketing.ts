import {
  BusinessForMarketingSchema,
  type BusinessForMarketing
} from '@/lib/schemas/business';
import { createAnonClient } from '@/lib/supabase';

/**
 * Loads everything the marketing site needs for one business, by slug.
 *
 * Returns null when the slug does not match, the business is not
 * website_is_published, or the schema parse fails. The page-level
 * orchestrator turns null into a 404.
 *
 * Three child queries run in parallel via Promise.all to minimise
 * server-side latency on the LCP path. A single .from('businesses')
 * .select('*, services(*), business_hours(*), business_media(*)')
 * would also work, but separate filtered queries let us scope
 * services to is_active = true and order each child predictably.
 */
export async function loadBusinessForMarketing(
  slug: string
): Promise<BusinessForMarketing | null> {
  const supabase = createAnonClient();

  const { data: business, error: businessError } = await supabase
    .from('businesses')
    .select('*')
    .eq('slug', slug)
    .eq('website_is_published', true)
    .maybeSingle();

  if (businessError) {
    console.error('[loadBusinessForMarketing] business query failed', businessError);
    return null;
  }
  if (!business) return null;

  const [servicesResult, hoursResult, mediaResult] = await Promise.all([
    supabase
      .from('services')
      .select('*')
      .eq('business_id', business.id)
      .eq('is_active', true)
      .order('sort_order', { ascending: true, nullsFirst: false }),
    supabase
      .from('business_hours')
      .select('*')
      .eq('business_id', business.id)
      .order('day_of_week', { ascending: true }),
    supabase
      .from('business_media')
      .select('*')
      .eq('business_id', business.id)
      .order('sort_order', { ascending: true, nullsFirst: false })
  ]);

  if (servicesResult.error) {
    console.error('[loadBusinessForMarketing] services query failed', servicesResult.error);
  }
  if (hoursResult.error) {
    console.error('[loadBusinessForMarketing] hours query failed', hoursResult.error);
  }
  if (mediaResult.error) {
    console.error('[loadBusinessForMarketing] media query failed', mediaResult.error);
  }

  const parsed = BusinessForMarketingSchema.safeParse({
    business,
    services: servicesResult.data ?? [],
    hours: hoursResult.data ?? [],
    media: mediaResult.data ?? []
  });

  if (!parsed.success) {
    console.error(
      '[loadBusinessForMarketing] schema validation failed for slug',
      slug,
      parsed.error.issues
    );
    return null;
  }

  return parsed.data;
}
