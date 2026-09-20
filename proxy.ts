import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * Refresh the editor session cookie on every /dashboard request.
 *
 * @supabase/ssr chunks the auth token across several cookies and can call the
 * setter more than once per request. We build the response once and apply every
 * cookie in a single pass — creating a fresh NextResponse per call drops all but
 * the last cookie and silently corrupts the session.
 *
 * Scope is deliberately narrow: only /dashboard is touched, so public marketing
 * pages never pay for a session lookup.
 */
export async function proxy(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return NextResponse.next();

  let response = NextResponse.next({ request: { headers: req.headers } });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return req.cookies.getAll().map(({ name, value }) => ({ name, value }));
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
        response = NextResponse.next({ request: { headers: req.headers } });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // Touching getUser() is what triggers the refresh when the token has rotated.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*'],
};