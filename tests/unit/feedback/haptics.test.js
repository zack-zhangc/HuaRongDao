import { describe, expect, test } from 'vitest';

import { createHaptics } from '../../../src/feedback/haptics.js';

describe('haptics', () => {
  test('returns false when the platform is unsupported', () => {
    const haptics = createHaptics({ enabled: true, supported: false });
    expect(haptics.trigger()).toBe(false);
  });
});
