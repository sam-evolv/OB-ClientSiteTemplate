import { createClient } from '@supabase/supabase-js';
import { demoBusiness } from './demo-business';
import type { Business } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function hasSupabaseConfig() {
  return Boolean(supabaseUrl && supabaseKey);
}

export async function getBusinessBySlug(slug: string): Promise<Business | null> {
  if (!hasSupabaseConfig()) {
    return slug === demoBusiness.slug ? demoBusiness : { ...demoBusiness, slug, name: titleFromSlug(slug) };
  }

  const supabase = createClient(supabaseUrl!, supabaseKey!, {
    auth: { persistSession: false }
  });

  const { data, error } = await supabase
    .from('businesses')
    .select(`
      name,
      slug,
      category,
      primary_colour,
      tagline,
      website_headline,
      about_long,
      hero_image_url,
      cover_image_url,
      logo_url,
      gallery_urls,
      address_line,
      city,
      eircode,
      phone,
      email,
      socials,
      testimonials,
      founder_name,
      founder_photo_url,
      year_founded,
      amenities,
      parking_info,
      nearest_landmark,
      public_transport_info,
      instagram_handle,
      services(id, name, duration, price, description, category),
      business_hours(day, opens_at, closes_at, is_closed)
    `)
    .eq('slug', slug)
    .single();

  if (error || !data) return null;

  return {
    ...data,
    services: data.services ?? [],
    business_hours: data.business_hours ?? []
  } as Business;
}

export async function getAllBusinessSlugs() {
  if (!hasSupabaseConfig()) return [demoBusiness.slug];

  const supabase = createClient(supabaseUrl!, supabaseKey!, {
    auth: { persistSession: false }
  });

  const { data } = await supabase.from('businesses').select('slug');
  return data?.map((row) => row.slug).filter(Boolean) ?? [];
}

function titleFromSlug(slug: string) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
