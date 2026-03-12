import { describe, expect, test } from 'vitest';

import { canMove, getLegalMove } from '../../../src/engine/movement-rules.js';
import { LEVELS } from '../../../src/state/levels.js';

describe('movement-rules', () => {
  test('allows the target to move down in the default level', () => {
    const move = getLegalMove(LEVELS[0].pieces, 'target', 'down');
    expect(move?.to).toEqual({ row: 3, col: 1 });
  });

  test('blocks target movement into occupied cells', () => {
    expect(canMove(LEVELS[0].pieces, 'target', 'left')).toBe(false);
    expect(canMove(LEVELS[0].pieces, 'target', 'right')).toBe(false);
  });
});
