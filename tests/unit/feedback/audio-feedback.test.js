import { describe, expect, test } from 'vitest';

import { createAudioFeedback } from '../../../src/feedback/audio-feedback.js';

describe('audio-feedback', () => {
  test('can be toggled off without throwing', async () => {
    const feedback = createAudioFeedback({ enabled: false, supported: false });
    expect(feedback.isEnabled()).toBe(false);
    await expect(feedback.playMove()).resolves.toBe(false);
  });
});
