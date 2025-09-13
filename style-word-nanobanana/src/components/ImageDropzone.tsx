"use client";
import { useCallback, useState } from 'react';
import type React from 'react';

export type SelectedImage = {
  id: string;
  file: File;
  previewUrl: string;
};

type Props = {
  onChange: (images: File[]) => void;
  max?: number;
};

export function ImageDropzone({ onChange, max = 6 }: Props) {
  const [images, setImages] = useState<SelectedImage[]>([]);

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files).filter((f) => f.type.startsWith("image/"));
      const next = fileArray.slice(0, Math.max(0, max - images.length)).map((file) => ({
        id: `${file.name}-${file.size}-${file.lastModified}`,
        file,
        previewUrl: URL.createObjectURL(file)
      }));
      const merged = [...images, ...next].slice(0, max);
      setImages(merged);
      onChange(merged.map((i) => i.file));
    },
    [images, max, onChange]
  );

  const onDrop = useCallback(
    (ev: React.DragEvent<HTMLDivElement>) => {
      ev.preventDefault();
      if (ev.dataTransfer.files?.length) handleFiles(ev.dataTransfer.files);
    },
    [handleFiles]
  );

  const onSelect = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
    if (ev.target.files?.length) handleFiles(ev.target.files);
  }, [handleFiles]);

  const remove = useCallback((id: string) => {
    setImages((prev) => {
      const next = prev.filter((i) => i.id !== id);
      onChange(next.map((i) => i.file));
      return next;
    });
  }, [onChange]);

  return (
    <div>
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        className="flex h-40 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-50"
      >
        <label className="flex h-full w-full cursor-pointer items-center justify-center" htmlFor="file-input">
          <div className="text-center">
            <div className="text-sm">Drag & drop images (PNG/JPG/WebP) or click to upload</div>
            <div className="text-xs text-neutral-500">Up to {max} images</div>
          </div>
        </label>
        <input id="file-input" type="file" accept="image/*" multiple className="hidden" onChange={onSelect} />
      </div>
      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3 md:grid-cols-6">
          {images.map((img) => (
            <div key={img.id} className="group relative overflow-hidden rounded-md border">
              <img src={img.previewUrl} alt="upload" className="h-24 w-full object-cover" />
              <button
                type="button"
                className="absolute right-1 top-1 hidden rounded bg-black/70 px-2 py-0.5 text-xs text-white group-hover:block"
                onClick={() => remove(img.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

