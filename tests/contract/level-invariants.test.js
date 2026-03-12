import { describe, expect, test } from 'vitest';

import { LEVELS } from '../../src/state/levels.js';
import { validateLevelInvariants } from '../../src/state/validate-levels.js';

describe('level invariant contract', () => {
  test('bundled levels do not overlap and include exactly one target', () => {
    for (const level of LEVELS) {
      expect(validateLevelInvariants(level)).toEqual([]);
    }
  });

  test('duplicate piece ids are rejected', () => {
    const invalidLevel = {
      ...LEVELS[0],
      pieces: [...LEVELS[0].pieces, { ...LEVELS[0].pieces[0], row: 0, col: 1 }],
    };

    expect(validateLevelInvariants(invalidLevel)).toContain(
      `Duplicate piece id: ${LEVELS[0].pieces[0].id}`
    );
  });
});
