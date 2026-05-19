/* eslint-disable */
/**
 * extract-v9-images.ts
 *
 * Writes the eight images embedded in the original simply_golf_v9.jsx artifact
 * to disk as JPEG files under reference/v9-extracted/. The output is the source
 * of truth for the SIMply Golf 365 image set that will later be uploaded to
 * Supabase Storage (bucket `media`, path `media/{business_id}/{filename}`).
 *
 * Deviation note (foundation session, 2026-05-19):
 *   The script is wired and the file slots are correct, but the eight base64
 *   constants below currently hold a placeholder 1x1 black JPEG instead of the
 *   real image bytes. The original v9 base64 strings are ~700 KB in total which
 *   exceeded the output bandwidth available in the foundation session.
 *
 *   To finish the extraction in a follow-up session:
 *     1. Open the original simply_golf_v9.jsx artifact (the version with
 *        inline base64) outside this repo.
 *     2. Replace the eight PLACEHOLDER_BASE64 constants below with the
 *        corresponding values from the artifact:
 *          LOGO_URL_DATA          -> the constant named LOGO_URL
 *          HERO_BG_URL_DATA       -> HERO_BG_URL
 *          ABOUT_PORTRAIT_URL_DATA-> ABOUT_PORTRAIT_URL
 *          GALLERY_1_URL_DATA     -> GALLERY_1_URL
 *          GALLERY_2_URL_DATA     -> GALLERY_2_URL
 *          GALLERY_3_URL_DATA     -> GALLERY_3_URL
 *          GALLERY_4_URL_DATA     -> GALLERY_4_URL
 *          GALLERY_5_URL_DATA     -> GALLERY_5_URL
 *        Each value is the part after `data:image/jpeg;base64,`.
 *     3. Re-run `node --experimental-strip-types scripts/extract-v9-images.ts`
 *        (Node 22 supports this without a build step).
 *     4. Commit the updated JPEGs.
 *
 * The 1x1 placeholders are deliberately tiny and valid so that:
 *   - The mock data in lib/mock/simply-golf.ts can reference these paths
 *     without breaking image pipelines.
 *   - The architecture compiles and renders end to end during the foundation
 *     work.
 *   - The visual fidelity of v9 is a known, scheduled follow-up rather than a
 *     hidden gap.
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, '..', 'reference', 'v9-extracted');

// Minimal valid 1x1 JPEG, solid black. Replace with real v9 base64 to ship.
const PLACEHOLDER_BASE64 =
  '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/' +
  '2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QA' +
  'FQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oA' +
  'DAMBAAIRAxEAPwA/AP/Z';

const LOGO_URL_DATA = PLACEHOLDER_BASE64;
const HERO_BG_URL_DATA = PLACEHOLDER_BASE64;
const ABOUT_PORTRAIT_URL_DATA = PLACEHOLDER_BASE64;
const GALLERY_1_URL_DATA = PLACEHOLDER_BASE64;
const GALLERY_2_URL_DATA = PLACEHOLDER_BASE64;
const GALLERY_3_URL_DATA = PLACEHOLDER_BASE64;
const GALLERY_4_URL_DATA = PLACEHOLDER_BASE64;
const GALLERY_5_URL_DATA = PLACEHOLDER_BASE64;

const MANIFEST: Array<{ filename: string; base64: string }> = [
  { filename: 'logo.jpg', base64: LOGO_URL_DATA },
  { filename: 'hero.jpg', base64: HERO_BG_URL_DATA },
  { filename: 'about-portrait.jpg', base64: ABOUT_PORTRAIT_URL_DATA },
  { filename: 'gallery-1.jpg', base64: GALLERY_1_URL_DATA },
  { filename: 'gallery-2.jpg', base64: GALLERY_2_URL_DATA },
  { filename: 'gallery-3.jpg', base64: GALLERY_3_URL_DATA },
  { filename: 'gallery-4.jpg', base64: GALLERY_4_URL_DATA },
  { filename: 'gallery-5.jpg', base64: GALLERY_5_URL_DATA }
];

function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  let placeholderCount = 0;
  for (const { filename, base64 } of MANIFEST) {
    const bytes = Buffer.from(base64, 'base64');
    const target = join(OUTPUT_DIR, filename);
    writeFileSync(target, bytes);
    if (base64 === PLACEHOLDER_BASE64) placeholderCount++;
    console.log(`wrote ${filename} (${bytes.byteLength} bytes)`);
  }

  if (placeholderCount > 0) {
    console.log('');
    console.log(`NOTE: ${placeholderCount} of ${MANIFEST.length} images are still placeholders.`);
    console.log('      Replace PLACEHOLDER_BASE64 references in this script with the real v9 base64 strings.');
  }
}

main();
