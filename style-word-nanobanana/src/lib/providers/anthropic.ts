import Anthropic from '@anthropic-ai/sdk';

let cached: Anthropic | null = null;
export function getAnthropic(): Anthropic {
  if (!cached) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error('ANTHROPIC_API_KEY missing');
    cached = new Anthropic({ apiKey });
  }
  return cached;
}

export const healthAnthropic = async () => {
  try {
    const client = getAnthropic();
    await client.models.list();
    return { healthy: true, message: 'OK' };
  } catch (e: any) {
    return { healthy: false, message: e?.message || 'Error' };
  }
};

