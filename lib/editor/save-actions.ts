'use server';

import { revalidatePath } from 'next/cache';
import sharp from 'sharp';
import { requireEditableBusiness } from './session';
import {
  ABOUT_BODY_MAX,
  ABOUT_HEADLINE_MAX,
  ALT_MAX,
  CAPTION_MAX,
  GALLERY_MAX,
  HEADLINE_MAX,
  SUBHEAD_MAX,
} from './limits';

export interface SaveResult {
  ok: boolean;
  error?: string;
  message?: string;
}

const HERO_MAX_BYTES = 8 * 1024 * 1024;
const GALLERY_MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

function clean(value: FormDataEntryValue | null, max: number): string | null {
  const s = typeof value === 'string' ? value.trim() : '';
  return s ? s.slice(0, max) : null;
}

/**
 * Every action resolves the tenant from the session and scopes every write to
 * that business id. A posted business id is never trusted — that is what keeps
 * one owner from writing another tenant's row.
 */
async function editorContext() {
  const { business, sb } = await requireEditableBusiness();
  return { business, sb };
}

/** Auto-orient, crop to the slot's frame, and compress to a dependable JPEG. */
async function polish(input: Buffer, kind: 'hero' | 'gallery') {
  const base = sharp(input, { failOn: 'none' })
    .rotate()
    .normalise()
    .modulate({ brightness: 1.01, saturation: 1.04 })
    .sharpen({ sigma: 0.7, m1: 0.8, m2: 1.4, x1: 2, y2: 10, y3: 20 });

  return kind === 'hero'
    ? base.resize(1800, 1100, { fit: 'cover', position: 'attention' }).jpeg({ quality: 88, progressive: true, mozjpeg: true }).toBuffer()
    : base.resize(1200, 1200, { fit: 'cover', position: 'attention' }).jpeg({ quality: 88, progressive: true, mozjpeg: true }).toBuffer();
}

/* ------------------------------------------------------------------ text ---- */

export async function saveHeroAction(formData: FormData): Promise<SaveResult> {
  const { business, sb } = await editorContext();

  const { error } = await sb
    .from('businesses')
    .update({
      website_hero_headline_1: clean(formData.get('headline1'), HEADLINE_MAX),
      website_hero_headline_2: clean(formData.get('headline2'), HEADLINE_MAX),
      website_hero_subhead: clean(formData.get('subhead'), SUBHEAD_MAX),
    })
    .eq('id', business.id);

  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard');
  revalidatePath('/');
  return { ok: true, message: 'Hero saved.' };
}

export async function saveAboutAction(formData: FormData): Promise<SaveResult> {
  const { business, sb } = await editorContext();

  const { error } = await sb
    .from('businesses')
    .update({
      website_about_headline: clean(formData.get('headline'), ABOUT_HEADLINE_MAX),
      website_about_body: clean(formData.get('body'), ABOUT_BODY_MAX),
    })
    .eq('id', business.id);

  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard');
  revalidatePath('/');
  return { ok: true, message: 'About saved.' };
}

export async function saveContactAction(formData: FormData): Promise<SaveResult> {
  const { business, sb } = await editorContext();

  const { error } = await sb
    .from('businesses')
    .update({
      phone: clean(formData.get('phone'), 40),
      email: clean(formData.get('email'), 160),
      address: clean(formData.get('address'), 240),
    })
    .eq('id', business.id);

  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard');
  revalidatePath('/');
  return { ok: true, message: 'Contact details saved.' };
}

export async function setPublishedAction(published: boolean): Promise<SaveResult> {
  const { business, sb } = await editorContext();

  const { error } = await sb
    .from('businesses')
    .update({ website_is_published: published })
    .eq('id', business.id);

  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard');
  revalidatePath('/');
  return { ok: true, message: published ? 'Your website is live.' : 'Your website is hidden.' };
}

/* ----------------------------------------------------------------- media ---- */

/**
 * Replace the hero photo.
 *
 * The public template reads `business_media(kind='hero')` BEFORE the
 * compatibility columns, so the media row is replaced first — otherwise a
 * successful upload would leave the old hero live.
 */
export async function uploadHeroAction(formData: FormData): Promise<SaveResult> {
  const { business, sb } = await editorContext();

  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: 'Choose a photo first.' };
  if (file.size > HERO_MAX_BYTES) return { ok: false, error: 'That photo is over 8MB. Try a smaller one.' };
  if (!ALLOWED_TYPES.includes(file.type)) return { ok: false, error: 'Use a JPEG, PNG or WebP image.' };

  try {
    const processed = await polish(Buffer.from(await file.arrayBuffer()), 'hero');
    const path = `${business.id}/hero-${Date.now()}.jpg`;

    const { error: uploadError } = await sb.storage
      .from('hero-images')
      .upload(path, processed, { contentType: 'image/jpeg', upsert: true });
    if (uploadError) throw uploadError;

    const { data: urlData } = sb.storage.from('hero-images').getPublicUrl(path);
    const url = urlData.publicUrl;

    // Deterministic single hero row: clear any existing one, then insert.
    await sb.from('business_media').delete().eq('business_id', business.id).eq('kind', 'hero');
    const { error: mediaError } = await sb.from('business_media').insert({
      business_id: business.id,
      kind: 'hero',
      media_type: 'image',
      url,
      sort_order: 0,
      alt: business.name,
    });
    if (mediaError) throw mediaError;

    const { error: rowError } = await sb
      .from('businesses')
      .update({ website_hero_image_url: url, hero_image_url: url })
      .eq('id', business.id);
    if (rowError) throw rowError;

    revalidatePath('/dashboard');
    revalidatePath('/');
    return { ok: true, message: 'Hero photo updated.' };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload failed.';
    return { ok: false, error: message };
  }
}

export async function removeHeroAction(): Promise<SaveResult> {
  const { business, sb } = await editorContext();

  await sb.from('business_media').delete().eq('business_id', business.id).eq('kind', 'hero');
  const { error } = await sb
    .from('businesses')
    .update({ website_hero_image_url: null, hero_image_url: null })
    .eq('id', business.id);

  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard');
  revalidatePath('/');
  return { ok: true, message: 'Hero photo removed.' };
}

/** Append a gallery photo. The limit is enforced against the media rows. */
export async function addGalleryImageAction(formData: FormData): Promise<SaveResult> {
  const { business, sb } = await editorContext();

  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: 'Choose a photo first.' };
  if (file.size > GALLERY_MAX_BYTES) return { ok: false, error: 'That photo is over 5MB. Try a smaller one.' };
  if (!ALLOWED_TYPES.includes(file.type)) return { ok: false, error: 'Use a JPEG, PNG or WebP image.' };

  const { data: existing } = await sb
    .from('business_media')
    .select('id, sort_order')
    .eq('business_id', business.id)
    .eq('kind', 'gallery');

  const current = existing ?? [];
  if (current.length >= GALLERY_MAX) {
    return { ok: false, error: `You can have up to ${GALLERY_MAX} photos. Remove one first.` };
  }

  const nextOrder = current.reduce((max, r) => Math.max(max, (r.sort_order ?? 0) + 1), 0);

  try {
    const processed = await polish(Buffer.from(await file.arrayBuffer()), 'gallery');
    const path = `${business.id}/gallery-${Date.now()}.jpg`;

    const { error: uploadError } = await sb.storage
      .from('gallery-images')
      .upload(path, processed, { contentType: 'image/jpeg', upsert: true });
    if (uploadError) throw uploadError;

    const { data: urlData } = sb.storage.from('gallery-images').getPublicUrl(path);
    const url = urlData.publicUrl;

    const { error: mediaError } = await sb.from('business_media').insert({
      business_id: business.id,
      kind: 'gallery',
      media_type: 'image',
      url,
      sort_order: nextOrder,
      alt: business.name,
    });
    if (mediaError) throw mediaError;

    // Compatibility mirror for the legacy array reader.
    const { data: row } = await sb.from('businesses').select('gallery_urls').eq('id', business.id).maybeSingle();
    const mirror = ((row?.gallery_urls as string[] | null) ?? []).concat(url);
    await sb.from('businesses').update({ gallery_urls: mirror }).eq('id', business.id);

    revalidatePath('/dashboard');
    revalidatePath('/');
    return { ok: true, message: 'Photo added.' };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload failed.';
    return { ok: false, error: message };
  }
}

export async function removeGalleryImageAction(mediaId: string): Promise<SaveResult> {
  const { business, sb } = await editorContext();

  const { data: media } = await sb
    .from('business_media')
    .select('id, url, business_id')
    .eq('id', mediaId)
    .eq('business_id', business.id)
    .maybeSingle();

  if (!media) return { ok: false, error: 'That photo was not found.' };

  const { error } = await sb.from('business_media').delete().eq('id', media.id).eq('business_id', business.id);
  if (error) return { ok: false, error: error.message };

  const pathMatch = (media.url as string).match(/gallery-images\/(.+)$/);
  if (pathMatch) await sb.storage.from('gallery-images').remove([pathMatch[1]]);

  const { data: row } = await sb.from('businesses').select('gallery_urls').eq('id', business.id).maybeSingle();
  const mirror = ((row?.gallery_urls as string[] | null) ?? []).filter((u) => u !== media.url);
  await sb.from('businesses').update({ gallery_urls: mirror }).eq('id', business.id);

  revalidatePath('/dashboard');
  revalidatePath('/');
  return { ok: true, message: 'Photo removed.' };
}

export async function updateGalleryMetaAction(
  mediaId: string,
  patch: { alt?: string; caption?: string },
): Promise<SaveResult> {
  const { business, sb } = await editorContext();

  const update: Record<string, string | null> = {};
  if (patch.alt !== undefined) update.alt = patch.alt.trim().slice(0, ALT_MAX) || null;
  if (patch.caption !== undefined) update.caption = patch.caption.trim().slice(0, CAPTION_MAX) || null;
  if (Object.keys(update).length === 0) return { ok: true };

  const { error } = await sb
    .from('business_media')
    .update(update)
    .eq('id', mediaId)
    .eq('business_id', business.id);

  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard');
  revalidatePath('/');
  return { ok: true, message: 'Saved.' };
}

/* -------------------------------------------------------------- services ---- */

export async function saveServiceAction(formData: FormData): Promise<SaveResult> {
  const { business, sb } = await editorContext();

  const id = String(formData.get('id') ?? '');
  if (!id) return { ok: false, error: 'Missing service.' };

  const priceRaw = String(formData.get('price') ?? '').replace(/[^0-9.]/g, '');
  const price = priceRaw ? Math.round(parseFloat(priceRaw) * 100) : null;

  const { error } = await sb
    .from('services')
    .update({
      name: clean(formData.get('name'), 120),
      description: clean(formData.get('description'), 600),
      price_cents: Number.isFinite(price as number) ? price : null,
      is_active: formData.get('is_active') === 'on',
    })
    .eq('id', id)
    .eq('business_id', business.id);

  if (error) return { ok: false, error: error.message };
  revalidatePath('/dashboard');
  revalidatePath('/');
  return { ok: true, message: 'Service saved.' };
}
