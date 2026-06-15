/**
 * IndexNow submission.
 *
 * IndexNow pushes URLs to participating search indexes for near-immediate
 * inclusion — notably Bing, which is the index ChatGPT search reads. One key
 * serves every tenant domain: public/<key>.txt is served on every host, so each
 * domain can prove key ownership at https://<host>/<key>.txt.
 *
 * Integration point: call submitUrlsToIndexNow (or POST /api/indexnow) when a
 * tenant is published or its content changes. That trigger lives in the main
 * OpenBook dashboard; this client-site service just exposes the capability.
 */

// Public, non-secret key. Must match the filename of public/<key>.txt.
export const INDEXNOW_KEY = '04e11ac4035c4250e321fb620bc6d51a';

const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

export type IndexNowResult = {
  host: string;
  submitted: number;
  status: number;
  ok: boolean;
};

/**
 * Submit URLs to IndexNow, grouped by host (IndexNow requires every URL in a
 * request to share one host). Never throws — failures are reported per host.
 */
export async function submitUrlsToIndexNow(urls: string[]): Promise<IndexNowResult[]> {
  const byHost = new Map<string, string[]>();
  for (const u of urls) {
    let host: string;
    try {
      host = new URL(u).host;
    } catch {
      continue;
    }
    byHost.set(host, [...(byHost.get(host) ?? []), u]);
  }

  const results: IndexNowResult[] = [];
  for (const [host, urlList] of byHost) {
    try {
      const res = await fetch(INDEXNOW_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          host,
          key: INDEXNOW_KEY,
          keyLocation: `https://${host}/${INDEXNOW_KEY}.txt`,
          urlList
        })
      });
      results.push({ host, submitted: urlList.length, status: res.status, ok: res.ok });
    } catch {
      results.push({ host, submitted: urlList.length, status: 0, ok: false });
    }
  }
  return results;
}
