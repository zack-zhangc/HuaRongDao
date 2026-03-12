import { describe, expect, test } from 'vitest';

import { getDefaultLevel, getLevelById, getLevels } from '../../../src/state/levels.js';

describe('levels', () => {
  test('returns independent level copies', () => {
    const first = getLevels();
    const second = getLevels();
    first[0].pieces[0].row = 99;
    expect(second[0].pieces[0].row).not.toBe(99);
  });

  test('resolves the default level and named levels', () => {
    expect(getDefaultLevel()?.id).toBe('one-step-away');
    expect(getLevelById('cloud-pass')?.name).toBe('插翅难飞');
  });
});
