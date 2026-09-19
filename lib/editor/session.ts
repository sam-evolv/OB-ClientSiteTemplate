import { redirect } from 'next/navigation';
import { createEditorClient } from './supabase-server';

export interface EditorOwner {
  id: string;
  email: string | null;
}

export interface EditorBusiness {
  id: string;
  slug: string;
  name: string;
  owner_id: string | null;
  logo_url: string | null;
  primary_colour: string | null;
  website_is_published: boolean | null;
  website_custom_domain: string | null;
}

/**
 * The signed-in owner, or null. Resolves through Supabase auth so RLS decides
 * what they can write.
 */
export async function getEditorOwner(): Promise<EditorOwner | null> {
  const sb = await createEditorClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return null;
  return { id: user.id, email: user.email ?? null };
}

/**
 * Resolve the business this editor session may edit.
 *
 * Deliberately anchored on `owner_id` — the same rule the main dashboard uses —
 * so a signed-in account can only ever reach its own tenant. `is_live` is
 * required because an unpublished tenant has no site to edit.
 */
export async function getEditableBusiness(): Promise<{
  business: EditorBusiness;
  sb: Awaited<ReturnType<typeof createEditorClient>>;
} | null> {
  const sb = await createEditorClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return null;

  const { data, error } = await sb
    .from('businesses')
    .select(
      'id, slug, name, owner_id, logo_url, primary_colour, website_is_published, website_custom_domain',
    )
    .eq('owner_id', user.id)
    .eq('is_live', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return { business: data as EditorBusiness, sb };
}

/** Redirect to the editor sign-in unless an owner session exists. */
export async function requireEditorSession() {
  const owner = await getEditorOwner();
  if (!owner) redirect('/dashboard/login');
  return owner;
}

/** Redirect to sign-in, then resolve the tenant this session may edit. */
export async function requireEditableBusiness() {
  await requireEditorSession();
  const result = await getEditableBusiness();
  if (!result) redirect('/dashboard/login?error=no_business');
  return result;
}
