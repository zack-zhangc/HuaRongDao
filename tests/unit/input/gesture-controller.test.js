import { describe, expect, test } from 'vitest';

import {
  DEFAULT_GESTURE_THRESHOLD,
  getGestureDirection,
} from '../../../src/input/gesture-controller.js';

describe('gesture-controller', () => {
  test('detects dominant horizontal gestures', () => {
    expect(getGestureDirection(48, 6)).toBe('right');
    expect(getGestureDirection(-48, 6)).toBe('left');
  });

  test('detects dominant vertical gestures', () => {
    expect(getGestureDirection(6, 48)).toBe('down');
    expect(getGestureDirection(6, -48)).toBe('up');
  });

  test('ignores short gestures', () => {
    expect(getGestureDirection(6, 8, DEFAULT_GESTURE_THRESHOLD)).toBeNull();
  });
});
