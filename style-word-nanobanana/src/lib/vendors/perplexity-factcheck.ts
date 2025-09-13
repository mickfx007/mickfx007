import { getPerplexity } from '../providers/perplexity';

export async function disambiguateTerms(descriptor: string): Promise<string> {
  try {
    const perplexity = getPerplexity();
    const q = `Given this style descriptor list for lettering: "${descriptor}"\n- Expand unclear terms into precise, widely-used typography or visual art terminology.\n- Replace brand-specific or ambiguous words with general descriptors.\n- Keep it under 30 words, comma-separated.`;
    const res = await perplexity.responses.create({
      model: 'llama-3.1-sonar-small-128k-online',
      input: [{ role: 'user', content: [{ type: 'text', text: q }] }]
    } as any);
    // @ts-expect-error minimal extraction
    const text = res.output_text || res.output?.[0]?.content?.[0]?.text || '';
    return text.trim() || descriptor;
  } catch {
    return descriptor;
  }
}

export async function healthPerplexity() {
  try {
    const perplexity = getPerplexity();
    // Dead-simple call to ensure auth works
    await perplexity.models.list();
    return { healthy: true, message: 'OK' };
  } catch (e: any) {
    return { healthy: false, message: e?.message || 'Error' };
  }
}

