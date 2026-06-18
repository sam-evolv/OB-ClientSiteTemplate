import Image from 'next/image';

/**
 * OpenBook badge — gold-accent footer mark. The only place the OpenBook gold
 * appears. Ported from handoff/reference/chrome.jsx.
 *
 * powered-by-openbook.png is an APP asset (README §5): it ships with the
 * template and is identical for every customer, so it is referenced from
 * /media directly rather than via a business_media row. Intrinsic size is
 * 1134×306; CSS renders it at height h with width auto to keep the exact ratio.
 */
export function OpenBookBadge({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const h = size === 'sm' ? 44 : 60;
  return (
    <a
      href="https://openbook.ie"
      target="_blank"
      rel="noopener"
      className="ob-badge"
      aria-label="Powered by OpenBook"
      style={{ display: 'inline-block', textDecoration: 'none', lineHeight: 0, borderRadius: 999 }}
    >
      <Image
        src="/media/powered-by-openbook.png"
        alt="Powered by OpenBook"
        width={1134}
        height={306}
        style={{ display: 'block', height: h, width: 'auto' }}
      />
    </a>
  );
}
