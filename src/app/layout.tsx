import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/Navigation/Navbar';
import { cn } from '@/lib/utils';
import Providers from '@/components/Misc/Providers';
import { GoogleAnalytics } from '@next/third-parties/google'
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Golden Sports App',
  description: 'Golden Sports App',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <Providers>
        <body
          className={cn(
            'min-h-screen font-sans antialiased grainy light',
            inter.className
          )}
        >
          <Toaster />
          {children}
        </body>
      </Providers>
      <GoogleAnalytics gaId="G-RXE0C2JZME" />
    </html>
  );
}
