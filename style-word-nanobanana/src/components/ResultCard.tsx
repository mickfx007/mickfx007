"use client";
import { useState } from 'react';

export type Result = {
  id: string;
  imageUrl: string;
  seed: number;
  style: string;
  word: string;
  createdAt: number;
};

type Props = {
  result: Result;
  onRegenerate: (seed: number) => void;
  onVariation: () => void;
  onSave: (result: Result) => void;
};

export function ResultCard({ result, onRegenerate, onVariation, onSave }: Props) {
  const [downloading, setDownloading] = useState(false);

  async function download() {
    try {
      setDownloading(true);
      const res = await fetch(result.imageUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${result.word}-${result.seed}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <img src={result.imageUrl} alt={result.word} className="h-64 w-full object-contain bg-neutral-50" />
      <div className="p-3 text-sm">
        <div className="mb-2 flex items-center justify-between">
          <div className="font-medium">{result.word}</div>
          <div className="text-neutral-500">Seed {result.seed}</div>
        </div>
        <div className="line-clamp-2 text-neutral-600">{result.style}</div>
        <div className="mt-3 flex gap-2">
          <button className="rounded-md bg-black px-3 py-1.5 text-white" onClick={download} disabled={downloading}>
            {downloading ? 'Downloading…' : 'Download PNG'}
          </button>
          <button className="rounded-md border px-3 py-1.5" onClick={() => onRegenerate(result.seed)}>Regenerate</button>
          <button className="rounded-md border px-3 py-1.5" onClick={onVariation}>Variations</button>
          <button className="rounded-md border px-3 py-1.5" onClick={() => onSave(result)}>Save to Gallery</button>
        </div>
      </div>
    </div>
  );
}

