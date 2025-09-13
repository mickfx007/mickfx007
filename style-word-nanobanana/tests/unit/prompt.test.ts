import { describe, it, expect } from 'vitest';
import { buildPrompt } from '@/lib/nanobanana/generate';

describe('buildPrompt', () => {
  it('includes clarity and strictness percentages', () => {
    const p = buildPrompt('bold, high-contrast', 0.5, 0.75);
    expect(p).toContain('Style adherence 50%');
    expect(p).toContain('Letter clarity 75%');
  });
});

