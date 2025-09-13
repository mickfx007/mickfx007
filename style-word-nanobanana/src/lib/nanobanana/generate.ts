type GenerateArgs = {
  images: Buffer[];
  word: string;
  styleDescriptor: string;
  strictness: number;
  clarity: number;
  seed?: number;
};

export async function generateWordImage(args: GenerateArgs): Promise<{ imageUrl: string; finalStyle: string; usedSeed: number }> {
  const apiKey = process.env.NANOBANANA_API_KEY;
  if (!apiKey) throw new Error('NANOBANANA_API_KEY missing');
  const base = process.env.NANOBANANA_API_BASE || 'https://api.nanobanana.ai';

  const usedSeed = typeof args.seed === 'number' ? args.seed : Math.floor(Math.random() * 1_000_000);
  const prompt = buildPrompt(args.styleDescriptor, args.strictness, args.clarity);

  const form = new FormData();
  form.append('prompt', prompt);
  form.append('word', args.word);
  form.append('seed', String(usedSeed));
  args.images.slice(0, 6).forEach((buf, idx) => {
    const file = new File([buf], `ref-${idx}.png`, { type: 'image/png' });
    form.append('images', file);
  });

  const res = await fetch(`${base}/v1/word-style/generate`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form as any
  });
  if (!res.ok) throw new Error(`Nano Banana error: ${res.status}`);
  const data = await res.json();
  const imageUrl = data.image_url || data.url || '';
  if (!imageUrl) throw new Error('No image url from Nano Banana');
  return { imageUrl, finalStyle: prompt, usedSeed };
}

export function buildPrompt(styleDescriptor: string, strictness: number, clarity: number): string {
  const base = `Render the target word in the style: ${styleDescriptor}. Emphasize legible letterforms, consistent spacing, and coherent typographic construction. Letter clarity ${Math.round(clarity * 100)}%. Style adherence ${Math.round(strictness * 100)}%.`;
  return base;
}

export async function healthNano() {
  try {
    const base = process.env.NANOBANANA_API_BASE || 'https://api.nanobanana.ai';
    const apiKey = process.env.NANOBANANA_API_KEY;
    if (!apiKey) throw new Error('NANOBANANA_API_KEY missing');
    const res = await fetch(`${base}/v1/health`, { headers: { Authorization: `Bearer ${apiKey}` } });
    if (res.ok) return { healthy: true, message: 'OK' };
    return { healthy: false, message: `HTTP ${res.status}` };
  } catch (e: any) {
    return { healthy: false, message: e?.message || 'Error' };
  }
}

