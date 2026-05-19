/* eslint-disable */
/**
 * extract-v9-images.ts
 *
 * Reads the eight images embedded as base64 data URIs in
 * reference/simply_golf_v9_original.jsx and writes them as real JPEG or PNG
 * files under reference/v9-extracted/. Output filename extension is chosen
 * from the mime type captured in each data URI, not hardcoded.
 *
 * Run:
 *   node --experimental-strip-types scripts/extract-v9-images.ts
 *
 * Each expected variable name in VARIABLE_TO_FILENAME must be present in the
 * artifact. If any is missing the script exits non-zero so the gap is loud.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const ARTIFACT = join(REPO_ROOT, 'reference', 'simply_golf_v9_original.jsx');
const OUTPUT_DIR = join(REPO_ROOT, 'reference', 'v9-extracted');

const VARIABLE_TO_FILENAME: Record<string, string> = {
  LOGO_URL: 'logo',
  HERO_BG_URL: 'hero',
  ABOUT_PORTRAIT_URL: 'about-portrait',
  GALLERY_1_URL: 'gallery-1',
  GALLERY_2_URL: 'gallery-2',
  GALLERY_3_URL: 'gallery-3',
  GALLERY_4_URL: 'gallery-4',
  GALLERY_5_URL: 'gallery-5'
};

const EXTENSION_BY_MIME: Record<string, string> = {
  jpeg: 'jpg',
  jpg: 'jpg',
  png: 'png'
};

function main() {
  const source = readFileSync(ARTIFACT, 'utf8');
  const pattern =
    /const\s+([A-Z_0-9]+)\s*=\s*['"`]data:image\/(jpeg|jpg|png);base64,([A-Za-z0-9+/=]+)['"`]/g;

  const found = new Map<string, { mime: string; base64: string }>();
  for (const match of source.matchAll(pattern)) {
    const [, name, mime, base64] = match;
    found.set(name, { mime, base64 });
  }

  const missing = Object.keys(VARIABLE_TO_FILENAME).filter((name) => !found.has(name));
  if (missing.length > 0) {
    console.error(`[extract-v9-images] missing variables in artifact: ${missing.join(', ')}`);
    process.exit(1);
  }

  mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const [variable, basename] of Object.entries(VARIABLE_TO_FILENAME)) {
    const { mime, base64 } = found.get(variable)!;
    const ext = EXTENSION_BY_MIME[mime];
    const filename = `${basename}.${ext}`;
    const bytes = Buffer.from(base64, 'base64');
    writeFileSync(join(OUTPUT_DIR, filename), bytes);
    console.log(`wrote ${filename} (${bytes.byteLength} bytes)`);
  }
}

main();
