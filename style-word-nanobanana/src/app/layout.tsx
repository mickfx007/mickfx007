import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Style Word Generator – Nano Banana',
  description: 'Render any word in the visual style of your reference images.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-neutral-50 text-neutral-900 antialiased">
        {children}
      </body>
    </html>
  );
}

