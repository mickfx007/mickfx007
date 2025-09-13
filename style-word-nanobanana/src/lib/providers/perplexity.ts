import OpenAI from 'openai';

let cached: OpenAI | null = null;
export function getPerplexity(): OpenAI {
  if (!cached) {
    const apiKey = process.env.PERPLEXITY_API_KEY;
    if (!apiKey) throw new Error('PERPLEXITY_API_KEY missing');
    cached = new OpenAI({
      apiKey,
      baseURL: 'https://api.perplexity.ai'
    } as any);
  }
  return cached;
}

export const healthPerplexity = async () => {
  try {
    const client = getPerplexity();
    await client.models.list();
    return { healthy: true, message: 'OK' };
  } catch (e: any) {
    return { healthy: false, message: e?.message || 'Error' };
  }
};

