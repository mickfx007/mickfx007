import { NextRequest, NextResponse } from 'next/server';
import { extractStyleDescriptor } from '@/lib/style/extract';
import { generateWordImage } from '@/lib/nanobanana/generate';

export const runtime = 'nodejs'; // image ops and multipart

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const word = String(form.get('word') || '').toUpperCase().slice(0, 32);
    const strictness = Number(form.get('strictness') || 0.6);
    const clarity = Number(form.get('clarity') || 0.7);
    const seed = form.get('seed') ? Number(form.get('seed')) : undefined;
    const files = form.getAll('images').filter((f): f is File => f instanceof File);

    if (!word || files.length === 0) {
      return NextResponse.json({ error: 'Missing word or images' }, { status: 400 });
    }

    const buffers = await Promise.all(files.map((f) => f.arrayBuffer().then((b) => Buffer.from(b))));
    const styleDescriptor = await extractStyleDescriptor(buffers);

    const { imageUrl, finalStyle, usedSeed } = await generateWordImage({
      images: buffers,
      word,
      styleDescriptor,
      strictness,
      clarity,
      seed
    });

    const result = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      imageUrl,
      seed: usedSeed,
      style: finalStyle,
      word,
      createdAt: Date.now()
    };

    return NextResponse.json({ result, styleDescriptor: finalStyle });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

