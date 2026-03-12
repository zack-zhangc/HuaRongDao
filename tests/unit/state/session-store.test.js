import { describe, expect, test } from 'vitest';

import { getDefaultLevel } from '../../../src/state/levels.js';
import {
  applyMoveToSession,
  createSession,
  SESSION_STATUS,
  updateElapsedTime,
} from '../../../src/state/session-store.js';
import { getLegalMove } from '../../../src/engine/movement-rules.js';

describe('session-store', () => {
  test('creates a ready session for a level', () => {
    const session = createSession(getDefaultLevel());
    expect(session.status).toBe(SESSION_STATUS.ready);
    expect(session.moveCount).toBe(0);
  });

  test('applies moves and starts the active timer', () => {
    const session = createSession(getDefaultLevel());
    const move = getLegalMove(session.pieces, 'target', 'down');
    const nextSession = applyMoveToSession(session, move);
    expect(nextSession.moveCount).toBe(1);
    expect(nextSession.status).toBe(SESSION_STATUS.active);
  });

  test('updates elapsed time for active sessions', () => {
    const session = createSession(getDefaultLevel());
    const nextSession = updateElapsedTime(session, session.startedAt + 2000);
    expect(nextSession.elapsedMs).toBe(2000);
  });
});
