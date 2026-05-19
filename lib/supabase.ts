import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Server-side Supabase client used by the marketing site loader.
 *
 * Uses the anon key. The marketing site reads only published business
 * rows; the RLS policy businesses_public_read_website permits anon
 * SELECT when website_is_published = true. The service role key is
 * never used in the marketing-site read path.
 */
export function createAnonClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      'Supabase env missing: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
    );
  }
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}
