"use client";
import { useEffect, useState } from 'react';
import type { Result } from './ResultCard';

const STORAGE_KEY = 'nb_gallery_v1';

export function Gallery() {
  const [items, setItems] = useState<Result[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore read errors (e.g., unavailable storage)
    }
  }, []);

  const remove = (id: string) => {
    const next = items.filter((i) => i.id !== id);
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  if (items.length === 0) {
    return <div className="text-neutral-600">No saved items yet.</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {items.map((r) => (
        <div key={r.id} className="overflow-hidden rounded-lg border bg-white">
          <img src={r.imageUrl} alt={r.word} className="h-64 w-full object-contain bg-neutral-50" />
          <div className="p-3 text-sm">
            <div className="mb-2 flex items-center justify-between">
              <div className="font-medium">{r.word}</div>
              <div className="text-neutral-500">Seed {r.seed}</div>
            </div>
            <div className="line-clamp-2 text-neutral-600">{r.style}</div>
            <div className="mt-3 flex gap-2">
              <button className="rounded-md border px-3 py-1.5" onClick={() => remove(r.id)}>Remove</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

