import OpenAI from 'openai';

let cached: OpenAI | null = null;
export function getOpenAI(): OpenAI {
  if (!cached) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('OPENAI_API_KEY missing');
    cached = new OpenAI({ apiKey });
  }
  return cached;
}

export const healthOpenAI = async () => {
  try {
    const client = getOpenAI();
    await client.models.list();
    return { healthy: true, message: 'OK' };
  } catch (e: any) {
    return { healthy: false, message: e?.message || 'Error' };
  }
};

