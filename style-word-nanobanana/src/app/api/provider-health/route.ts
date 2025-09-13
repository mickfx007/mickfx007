import { NextResponse } from 'next/server';
import { healthOpenAI } from '@/lib/providers/openai';
import { healthAnthropic } from '@/lib/providers/anthropic';
import { healthPerplexity } from '@/lib/providers/perplexity';
import { healthNano } from '@/lib/nanobanana/generate';

export const runtime = 'edge';

export async function GET() {
  const results = await Promise.allSettled([
    healthOpenAI(),
    healthAnthropic(),
    healthPerplexity(),
    healthNano()
  ]);

  const providers = [
    { name: 'OpenAI', result: results[0] },
    { name: 'Anthropic', result: results[1] },
    { name: 'Perplexity', result: results[2] },
    { name: 'Nano Banana', result: results[3] }
  ].map((p) => ({
    name: p.name,
    healthy: p.result.status === 'fulfilled' && p.result.value.healthy,
    message: p.result.status === 'fulfilled' ? p.result.value.message : 'Error'
  }));

  return NextResponse.json({ providers });
}

