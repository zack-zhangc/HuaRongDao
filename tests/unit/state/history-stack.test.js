import { describe, expect, test } from 'vitest';

import {
  canUndo,
  createHistoryStack,
  popHistory,
  pushHistory,
} from '../../../src/state/history-stack.js';

describe('history-stack', () => {
  test('pushes and pops move snapshots', () => {
    const initial = createHistoryStack();
    const withEntry = pushHistory(initial, { moveCount: 1 });
    expect(canUndo(withEntry)).toBe(true);
    expect(popHistory(withEntry).snapshot).toEqual({ moveCount: 1 });
  });
});
