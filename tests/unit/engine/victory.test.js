import { describe, expect, test } from 'vitest';

import { isWinningState } from '../../../src/engine/victory.js';
import { getLegalMove } from '../../../src/engine/movement-rules.js';
import { LEVELS } from '../../../src/state/levels.js';

describe('victory', () => {
  test('recognizes the winning exit state', () => {
    const move = getLegalMove(LEVELS[0].pieces, 'target', 'down');
    expect(move).not.toBeNull();
    expect(isWinningState(move.pieces, LEVELS[0].exit)).toBe(true);
  });
});
