import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { EmailOtpType } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

/**
 * Auth callback for the site editor.
 *
 * Supabase sends email links (password recovery, magic link) here as a
 * `token_hash` + `type`. Exchanging it establishes the session cookie, then we
 * hand the owner to the editor.
 *
 * The Supabase client is wired to the redirect response we actually return, not
 * to `cookies()`. A cookie written through `cookies()` is not merged into a
 * `NextResponse` we construct and return ourselves, so the session would be
 * silently dropped and the owner would bounce straight back to the sign-in page.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // Derive the origin from the real request host. Next normalises req.url's
  // origin to `localhost`, and a redirect to a different host than the one that
  // set the cookies silently drops the session — the owner bounces back to the
  // sign-in page with no error to explain why.
  const forwardedHost = req.headers.get('x-forwarded-host');
  const host = forwardedHost ?? req.headers.get('host') ?? '';
  const proto =
    req.headers.get('x-forwarded-proto') ??
    (/^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host) ? 'http' : 'https');
  const origin = host ? `${proto}://${host}` : new URL(req.url).origin;

  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const rawNext = searchParams.get('next');
  const next = rawNext && rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/dashboard';

  if (!token_hash || !type) {
    return NextResponse.redirect(`${origin}/dashboard/login?error=link_invalid`);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return NextResponse.redirect(`${origin}/dashboard/login?error=not_configured`);
  }

  let response = NextResponse.redirect(`${origin}${next}`);

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return req.cookies.getAll().map(({ name, value }) => ({ name, value }));
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { error } = await supabase.auth.verifyOtp({ token_hash, type });
  if (error) {
    return NextResponse.redirect(
      `${origin}/dashboard/login?error=${encodeURIComponent(error.message)}`,
    );
  }

  return response;
}