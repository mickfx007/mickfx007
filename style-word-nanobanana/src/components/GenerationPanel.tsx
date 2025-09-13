"use client";
import { useCallback, useMemo, useState } from 'react';
import { ImageDropzone } from './ImageDropzone';
import { GenerationControls } from './GenerationControls';
import { ResultCard, type Result } from './ResultCard';
import { StyleDebugPanel } from './StyleDebugPanel';

const STORAGE_KEY = 'nb_gallery_v1';

export function GenerationPanel() {
  const [files, setFiles] = useState<File[]>([]);
  const [word, setWord] = useState('');
  const [strictness, setStrictness] = useState(0.6);
  const [clarity, setClarity] = useState(0.7);
  const [descriptor, setDescriptor] = useState<string | undefined>();
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);

  const canGenerate = useMemo(() => files.length > 0 && word.trim().length > 0, [files.length, word]);

  const onControlsChange = useCallback((data: { word: string; strictness: number; clarity: number }) => {
    setWord(data.word);
    setStrictness(data.strictness);
    setClarity(data.clarity);
  }, []);

  const callGenerate = useCallback(async (opts: { seed?: number }) => {
    setLoading(true);
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append('images', f));
      formData.append('word', word);
      formData.append('strictness', String(strictness));
      formData.append('clarity', String(clarity));
      if (opts.seed !== undefined) formData.append('seed', String(opts.seed));

      const res = await fetch('/actions/generate', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Generation failed');
      const payload = await res.json();
      setDescriptor(payload.styleDescriptor);
      setResults((prev) => [payload.result as Result, ...prev]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [files, word, strictness, clarity]);

  const regenerate = useCallback((seed: number) => callGenerate({ seed }), [callGenerate]);
  const variation = useCallback(() => callGenerate({}), [callGenerate]);

  const saveToGallery = useCallback((r: Result) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const existing: Result[] = raw ? JSON.parse(raw) : [];
      const next = [r, ...existing].slice(0, 100);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore write errors
    }
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div className="md:col-span-2 space-y-4">
        <ImageDropzone onChange={setFiles} />
        <GenerationControls onChange={onControlsChange} />
        <div className="flex items-center gap-3">
          <button
            className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
            disabled={!canGenerate || loading}
            onClick={() => callGenerate({})}
          >
            {loading ? 'Generating…' : 'Generate'}
          </button>
        </div>

        {results.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {results.map((r) => (
              <ResultCard
                key={r.id}
                result={r}
                onRegenerate={regenerate}
                onVariation={variation}
                onSave={saveToGallery}
              />)
            )}
          </div>
        )}
      </div>
      <div className="space-y-4">
        <StyleDebugPanel descriptor={descriptor} />
      </div>
    </div>
  );
}

