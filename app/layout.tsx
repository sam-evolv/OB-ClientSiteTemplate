import type { Metadata, Viewport } from 'next';
import { fontClassName } from '@/lib/fonts';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://openbook.ie'),
  title: 'OpenBook Client Site Template',
  description: 'Premium data-driven websites for bookable local service businesses.'
};

// Matches the design reference: <meta name="theme-color" content="#080808">.
export const viewport: Viewport = {
  themeColor: '#080808'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontClassName}>
      <body>{children}</body>
    </html>
  );
}
