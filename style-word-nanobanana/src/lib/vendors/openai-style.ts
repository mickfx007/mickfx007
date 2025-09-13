import { getOpenAI } from '../providers/openai';

export async function describeWithOpenAI(images: Buffer[]): Promise<string> {
  try {
    const openai = getOpenAI();
    const inputImages = images.slice(0, 6).map((buf) => ({
      type: 'input_image' as const,
      image_data: Buffer.from(buf).toString('base64')
    }));

    // Using a generic vision-capable model name; replace with your account's model
    const res = await openai.responses.create({
      model: 'gpt-4o-mini',
      input: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Describe the shared visual style across these images as it would apply to lettering. Focus on: palette, texture, line quality, ornamentation, serif/sans/decorative characteristics, geometry vs. organic, contrast, illumination, material cues, and any distinctive motifs. Return a compact comma-separated descriptor list.' },
            ...inputImages
          ]
        }
      ]
    } as any);

    // @ts-expect-error minimal extraction
    const text = res.output_text || res.output?.[0]?.content?.[0]?.text || '';
    return text.trim();
  } catch (e) {
    return '';
  }
}

export async function healthOpenAI() {
  try {
    const openai = getOpenAI();
    await openai.models.list();
    return { healthy: true, message: 'OK' };
  } catch (e: any) {
    return { healthy: false, message: e?.message || 'Error' };
  }
}

