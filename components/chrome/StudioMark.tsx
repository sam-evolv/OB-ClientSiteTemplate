import Image from 'next/image';

/**
 * Donworth Studio mark — the studio attribution in the footer's left slot.
 *
 * Links to the studio's own website. Deliberately NOT a sign-in: the mark is
 * attribution, and sending someone who clicked a studio logo to a login page is
 * a dead end. The owner's way into the editor is the separate "Admin" button.
 *
 * donworth-studio-mark.png is an APP asset (README §5): it ships with the
 * template and is identical for every customer, so it is referenced from
 * /media directly rather than via a business_media row. It is the studio's
 * own on-ink lockup (transparent PNG, cream wordmark + copper mark), which is
 * the variant drawn for dark surfaces — the footer ground is #080808, so it
 * sits flush without a plate behind it. Intrinsic size is 1233×281; CSS
 * renders it at height h with width auto to preserve the exact ratio.
 */
const STUDIO_URL = 'https://donworthstudio.ie';

export function StudioMark({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const h = size === 'sm' ? 40 : 56;
  return (
    <a
      href={STUDIO_URL}
      rel="noopener"
      className="studio-mark"
      aria-label="Donworth Studio — website"
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
