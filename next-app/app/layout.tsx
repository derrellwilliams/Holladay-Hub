import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Holladay Hub – Meeting Minutes',
  description: 'Browse Holladay City meeting minutes and AI-generated summaries',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <header className="bg-brand-800 text-white px-6 py-4 shadow-md">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <div>
              <h1 className="text-xl font-bold leading-tight">Holladay Hub</h1>
              <p className="text-brand-100 text-sm">City Meeting Minutes</p>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto">{children}</main>
      </body>
    </html>
  );
}
