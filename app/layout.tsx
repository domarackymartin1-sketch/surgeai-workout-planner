import type { Metadata, Viewport } from 'next';
import { Barlow_Condensed, DM_Sans } from 'next/font/google';
import './globals.css';
import BottomNav from '@/components/layout/BottomNav';

const barlow = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-barlow',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
});

export const metadata: Metadata = {
  title: 'SurgeAI – Workout Planner',
  description: 'Your intelligent workout companion',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SurgeAI',
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sk" className={`${barlow.variable} ${dmSans.variable}`}>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="font-body antialiased overflow-x-hidden">
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
