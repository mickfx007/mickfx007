import { describeWithOpenAI } from './openai-style';
import { describeWithAnthropic } from './anthropic-style';

export async function ensembleDescribeStyle(images: Buffer[]): Promise<string> {
  const results = await Promise.allSettled([
    describeWithOpenAI(images),
    describeWithAnthropic(images)
  ]);

  const candidates = results
    .filter((r): r is PromiseFulfilledResult<string> => r.status === 'fulfilled' && !!r.value)
    .map((r) => r.value);

  if (candidates.length === 0) {
    return 'A generic, legible typographic rendering with high letter clarity and balanced contrast.';
  }

  // Simple merge: join unique phrases, prioritize overlapping terminology
  const merged = Array.from(new Set(candidates.join(' ').split(/[,.;]+\s*/g)))
    .filter(Boolean)
    .slice(0, 12)
    .join(', ');

  return merged;
}

