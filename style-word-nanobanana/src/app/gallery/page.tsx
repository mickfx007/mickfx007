import Link from 'next/link';
import { Gallery } from '@/components/Gallery';

export default function GalleryPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Gallery</h1>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="text-neutral-600 hover:text-neutral-900">Home</Link>
        </nav>
      </header>
      <Gallery />
    </main>
  );
}

