import { getAnthropic } from '../providers/anthropic';

export async function describeWithAnthropic(images: Buffer[]): Promise<string> {
  try {
    const anthropic = getAnthropic();
    const content: any[] = [
      {
        type: 'text',
        text: 'Describe the shared visual style across these images as it would apply to lettering. Focus on: palette, texture, line quality, ornamentation, serif/sans/decorative characteristics, geometry vs. organic, contrast, illumination, material cues, and any distinctive motifs. Return a compact comma-separated descriptor list.'
      },
      ...images.slice(0, 6).map((buf) => ({
        type: 'input_image',
        source: { type: 'base64', media_type: 'image/png', data: Buffer.from(buf).toString('base64') }
      }))
    ];

    const res = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 400,
      messages: [{ role: 'user', content }]
    } as any);

    // @ts-expect-error minimal extraction
    const text = res.content?.[0]?.text || '';
    return text.trim();
  } catch (e) {
    return '';
  }
}

export async function healthAnthropic() {
  try {
    const anthropic = getAnthropic();
    await anthropic.models.list();
    return { healthy: true, message: 'OK' };
  } catch (e: any) {
    return { healthy: false, message: e?.message || 'Error' };
  }
}

