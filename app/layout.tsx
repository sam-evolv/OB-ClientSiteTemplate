import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { fontClassName } from '@/lib/fonts';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://openbook.ie'),
  title: 'OpenBook Client Site Template',
  description: 'Premium data-driven websites for bookable local service businesses.',
  icons: {
    icon: '/empiregym-favicon.ico',
    apple: '/empiregym-apple-touch-icon.png'
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={fontClassName}>
      <body>{children}</body>
    </html>
  );
}
