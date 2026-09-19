import Image from 'next/image';

/**
 * Donworth Studio mark — the studio attribution in the footer's left slot.
 *
 * It is also the business owner's entry point into the dashboard: clicking the
 * mark opens the studio-wide owner sign-in, which resolves the signed-in
 * owner's own business. That is an entry point, not access control — the
 * password is the control.
 *
 * donworth-studio-mark.png is an APP asset (README §5): it ships with the
 * template and is identical for every customer, so it is referenced from
 * /media directly rather than via a business_media row. It is the studio's
 * own on-ink lockup (transparent PNG, cream wordmark + copper mark), which is
 * the variant drawn for dark surfaces — the footer ground is #080808, so it
 * sits flush without a plate behind it. Intrinsic size is 1233×281; CSS
 * renders it at height h with width auto to preserve the exact ratio.
 */

const APP_URL =
  process.env.NEXT_PUBLIC_STUDIO_APP_URL?.replace(/\/$/, '') || 'https://app.donworthstudio.ie';

/** Sign in, then land on the owner's dashboard. */
const OWNER_SIGN_IN_URL = `${APP_URL}/login?next=${encodeURIComponent('/dashboard')}`;

export function StudioMark({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const h = size === 'sm' ? 40 : 56;
  return (
    <a
      href={OWNER_SIGN_IN_URL}
      rel="noopener"
      className="studio-mark"
      aria-label="Donworth Studio — business owner sign in"
      style={{ display: 'inline-block', textDecoration: 'none', lineHeight: 0 }}
    >
      <Image
        src="/media/donworth-studio-mark.png"
        alt="Donworth Studio"
        width={1233}
        height={281}
        style={{ display: 'block', height: h, width: 'auto' }}
      />
    </a>
  );
}
