import { describe, expect, test } from 'vitest';

import {
  BOARD_DIMENSIONS,
  buildOccupancyMap,
  getPieceCells,
  serializePieces,
} from '../../../src/engine/board-state.js';
import { LEVELS } from '../../../src/state/levels.js';

describe('board-state', () => {
  test('expands piece coordinates into occupied cells', () => {
    expect(getPieceCells(LEVELS[0].pieces[0])).toEqual([
      { row: 2, col: 1 },
      { row: 2, col: 2 },
      { row: 3, col: 1 },
      { row: 3, col: 2 },
    ]);
  });

  test('builds a valid occupancy map for legal layouts', () => {
    const { valid, occupied } = buildOccupancyMap(LEVELS[0].pieces, BOARD_DIMENSIONS);
    expect(valid).toBe(true);
    expect(occupied.get('2:1')).toBe('target');
    expect(occupied.get('4:0')).toBe('guard-left');
  });

  test('serializes pieces deterministically', () => {
    expect(serializePieces(LEVELS[0].pieces)).toContain('target:2,1,2x2');
  });
});
