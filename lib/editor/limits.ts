/**
 * Field limits for the site editor — one source of truth, mirroring the rules
 * the main dashboard enforces so the two editors cannot drift.
 *
 * SUBHEAD_MAX clears the longest accepted live hero supporting line (178
 * characters on Empire Gym). Clamping below it would silently cut a published
 * sentence the first time the owner saved an unrelated field.
 */
export const HEADLINE_MAX = 80;
export const SUBHEAD_MAX = 200;
export const ABOUT_HEADLINE_MAX = 80;
export const ABOUT_BODY_MAX = 4000;
export const CAPTION_MAX = 200;
export const ALT_MAX = 200;

/** Matches the number of gallery images the public template renders. */
export const GALLERY_MAX = 8;
