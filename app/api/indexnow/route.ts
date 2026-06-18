import { NextResponse } from 'next/server';
import { resolveByHost } from '@/lib/business/resolve';
import { submitUrlsToIndexNow } from '@/lib/indexnow';

export const dynamic = 'force-dynamic';

/**
 * POST { url: string } or { urls: string[] } — submit tenant URLs to IndexNow.
 *
 * Guarded two ways so it cannot be used to submit arbitrary URLs:
 *   1. If INDEXNOW_SUBMIT_SECRET is set, the request must carry it in the
 *      x-indexnow-secret header.
 *   2. Every URL's host must resolve to a live, published tenant custom domain
 *      (resolveByHost), so only real tenant sites are ever submitted.
 *
 * Intended caller: the main OpenBook dashboard, on publish / content change.
 */
export async function POST(req: Request) {
  const secret = process.env.INDEXNOW_SUBMIT_SECRET;
  if (secret && req.headers.get('x-indexnow-secret') !== secret) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid JSON body' }, { status: 400 });
  }

  const raw = body as { url?: unknown; urls?: unknown };
  const urls = Array.isArray(raw.urls)
    ? raw.urls.filter((u): u is string => typeof u === 'string')
    : typeof raw.url === 'string'
      ? [raw.url]
      : [];
  if (!urls.length) {
    return NextResponse.json({ error: 'provide url or urls' }, { status: 400 });
  }

  // Only submit URLs whose host is a live, published tenant custom domain.
  const valid: string[] = [];
  for (const u of urls) {
    let host: string;
    try {
      host = new URL(u).host;
    } catch {
      continue;
    }
    const biz = await resolveByHost(host);
    if (biz) valid.push(u);
  }
  if (!valid.length) {
    return NextResponse.json(
      { error: 'no URL matched a live tenant custom domain' },
      { status: 422 }
    );
  }

  const result = await submitUrlsToIndexNow(valid);
  return NextResponse.json({ submitted: valid, result });
}
