import Link from 'next/link';
import { GenerationPanel } from '@/components/GenerationPanel';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Style Word Generator</h1>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/gallery" className="text-neutral-600 hover:text-neutral-900">Gallery</Link>
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noreferrer"
            className="rounded-md bg-black px-3 py-1.5 text-white"
          >
            Deploy
          </a>
        </nav>
      </header>

      <GenerationPanel />
    </main>
  );
}

