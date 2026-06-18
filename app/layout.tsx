import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { fontClassName } from '@/lib/fonts';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://openbook.ie'),
  title: 'OpenBook Client Site Template',
  description: 'Premium data-driven websites for bookable local service businesses.'
  // Favicons are intentionally NOT set here. This root layout is shared by every
  // tenant, so a brand icon set at this layer would leak across all tenants (the
  // bug this replaces forced one tenant's favicon onto every site). Each tenant's
  // favicon is resolved per-business from its own logo in buildMetadata
  // (lib/business/resolve.ts), so there is never any crossover between tenants.
};

// Matches the design reference: <meta name="theme-color" content="#080808">.
export const viewport: Viewport = {
  themeColor: '#080808'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={fontClassName}>
      <body>{children}</body>
    </html>
  );
}
