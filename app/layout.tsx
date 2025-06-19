import type { Metadata } from 'next';
import { Sora, IBM_Plex_Sans } from 'next/font/google';
import './globals.css';

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
});

const ibm = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'komoot-gpx-downloader',
  description: 'Download komoot tours as GPX files',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${ibm.variable} antialiased dark`}>
        {children}
      </body>
    </html>
  );
}
