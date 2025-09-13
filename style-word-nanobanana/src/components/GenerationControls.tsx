"use client";
import { useState } from 'react';

type Props = {
  onChange: (data: { word: string; strictness: number; clarity: number }) => void;
};

export function GenerationControls({ onChange }: Props) {
  const [word, setWord] = useState("");
  const [strictness, setStrictness] = useState(0.6);
  const [clarity, setClarity] = useState(0.7);

  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-1">
          <label className="mb-1 block text-sm font-medium">Target Word</label>
          <input
            value={word}
            onChange={(e) => {
              const v = e.target.value.toUpperCase();
              setWord(v);
              onChange({ word: v, strictness, clarity });
            }}
            placeholder="UBUNTU"
            className="w-full rounded-md border px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Style Strictness</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={strictness}
            onChange={(e) => {
              const v = Number(e.target.value);
              setStrictness(v);
              onChange({ word, strictness: v, clarity });
            }}
            className="w-full"
          />
          <div className="text-xs text-neutral-600">{strictness.toFixed(2)}</div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Letter Clarity</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={clarity}
            onChange={(e) => {
              const v = Number(e.target.value);
              setClarity(v);
              onChange({ word, strictness, clarity: v });
            }}
            className="w-full"
          />
          <div className="text-xs text-neutral-600">{clarity.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}

