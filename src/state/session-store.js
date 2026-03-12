import { clonePieces } from '../engine/board-state.js';
import { createHistoryStack, pushHistory } from './history-stack.js';

export const SESSION_STATUS = Object.freeze({
  loading: 'loading',
  empty: 'empty',
  ready: 'ready',
  active: 'active',
  won: 'won',
  error: 'error',
});

export function createFeedbackSettings(overrides = {}) {
  return {
    soundEnabled: true,
    hapticsEnabled: true,
    soundSupported: true,
    hapticsSupported: true,
    ...overrides,
  };
}

export function createSession(level, feedbackSettings = createFeedbackSettings()) {
  const now = Date.now();
  return {
    levelId: level.id,
    levelName: level.name,
    difficulty: level.difficulty,
    exit: { ...level.exit },
    status: SESSION_STATUS.ready,
    pieces: clonePieces(level.pieces),
    moveCount: 0,
    elapsedMs: 0,
    startedAt: now,
    lastUpdatedAt: now,
    activePieceId: null,
    feedbackSettings,
    errorMessage: '',
    historyStack: createHistoryStack(),
  };
}

export function createEmptySession(message = '暂无可用关卡') {
  return {
    levelId: 'empty',
    levelName: '暂无关卡',
    difficulty: '-',
    exit: null,
    status: SESSION_STATUS.empty,
    pieces: [],
    moveCount: 0,
    elapsedMs: 0,
    startedAt: Date.now(),
    lastUpdatedAt: Date.now(),
    activePieceId: null,
    feedbackSettings: createFeedbackSettings({
      soundEnabled: false,
      hapticsEnabled: false,
    }),
    errorMessage: message,
    historyStack: createHistoryStack(),
  };
}

export function createErrorSession(message = '关卡加载失败') {
  return {
    ...createEmptySession(message),
    status: SESSION_STATUS.error,
    levelName: '加载失败',
  };
}

export function setActivePiece(session, pieceId) {
  return {
    ...session,
    activePieceId: pieceId,
  };
}

export function applyMoveToSession(session, move) {
  const timestamp = Date.now();
  return {
    ...session,
    pieces: move.pieces,
    moveCount: session.moveCount + 1,
    status:
      session.status === SESSION_STATUS.ready ? SESSION_STATUS.active : session.status,
    lastUpdatedAt: timestamp,
    historyStack: pushHistory(session.historyStack, {
      pieces: clonePieces(session.pieces),
      moveCount: session.moveCount,
      elapsedMs: session.elapsedMs,
      status: session.status,
    }),
  };
}

export function updateElapsedTime(session, now = Date.now()) {
  if (![SESSION_STATUS.ready, SESSION_STATUS.active].includes(session.status)) {
    return session;
  }

  return {
    ...session,
    elapsedMs: now - session.startedAt,
  };
}

export function restartSession(level, feedbackSettings) {
  return createSession(level, feedbackSettings);
}
