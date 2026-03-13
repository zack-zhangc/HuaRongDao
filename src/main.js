import { createAudioFeedback } from './feedback/audio-feedback.js';
import { createHaptics } from './feedback/haptics.js';
import { getLegalMove } from './engine/movement-rules.js';
import { isWinningState } from './engine/victory.js';
import { createGestureController } from './input/gesture-controller.js';
import { getDefaultLevel, getLevelById, getLevels } from './state/levels.js';
import {
  applyMoveToSession,
  createEmptySession,
  createErrorSession,
  createFeedbackSettings,
  createSession,
  restartSession,
  SESSION_STATUS,
  setActivePiece,
  updateElapsedTime,
} from './state/session-store.js';
import { canUndo, popHistory } from './state/history-stack.js';
import { createBoardRenderer } from './ui/board-renderer.js';
import { createHud } from './ui/hud.js';
import { createOverlays } from './ui/overlays.js';
import { createSettingsPanel } from './ui/settings-panel.js';
import { createThemeController } from './ui/theme-controller.js';

const metrics = {
  loadStartedAt: performance.now(),
  readyAt: 0,
  lastGestureFeedbackAt: 0,
  lastMoveCompletedAt: 0,
  lastResizeHandledAt: 0,
};

const boardElement = document.querySelector('[data-testid="board"]');
const levelNameElement = document.querySelector('#level-name');
const difficultyElement = document.querySelector('#level-difficulty');
const moveCountElement = document.querySelector('#move-count');
const timerElement = document.querySelector('#timer');
const statusElement = document.querySelector('#session-status');
const levelSelect = document.querySelector('[data-testid="level-select"]');
const undoButton = document.querySelector('[data-testid="undo-button"]');
const restartButton = document.querySelector('[data-testid="restart-button"]');
const soundToggle = document.querySelector('[data-testid="sound-toggle"]');
const hapticsToggle = document.querySelector('[data-testid="haptics-toggle"]');
const themeButtons = Array.from(document.querySelectorAll('[data-theme-option]'));
const hintElement = document.querySelector('#control-hint');
const liveRegion = document.querySelector('#live-region');
const loadingElement = document.querySelector('[data-testid="loading-state"]');
const emptyElement = document.querySelector('[data-testid="empty-state"]');
const errorElement = document.querySelector('[data-testid="error-state"]');
const errorMessageElement = document.querySelector('#error-message');
const winElement = document.querySelector('[data-testid="win-dialog"]');
const winSummaryElement = document.querySelector('#win-summary');
const reloadEmptyButton = document.querySelector('#reload-empty-button');
const reloadErrorButton = document.querySelector('#reload-error-button');
const playAgainButton = document.querySelector('#play-again-button');

const feedbackSettings = createFeedbackSettings();
const audioFeedback = createAudioFeedback({
  enabled: feedbackSettings.soundEnabled,
});
const haptics = createHaptics({
  enabled: feedbackSettings.hapticsEnabled,
});

let levels = resolveLevelsFromFixture();
/** @type {any} */
let session =
  levels.length > 0
    ? createSession(getDefaultLevel(), {
        ...feedbackSettings,
        soundSupported: audioFeedback.isSupported(),
        hapticsSupported: haptics.isSupported(),
      })
    : createEmptySession();

const hud = createHud({
  levelNameElement,
  levelDifficultyElement: difficultyElement,
  moveCountElement,
  timerElement,
  statusElement,
});
const boardRenderer = createBoardRenderer(boardElement);
const overlays = createOverlays({
  loadingElement,
  emptyElement,
  errorElement,
  errorMessageElement,
  winElement,
  winSummaryElement,
  liveRegion,
});
const settingsPanel = createSettingsPanel({
  levelSelect,
  undoButton,
  restartButton,
  soundToggle,
  hapticsToggle,
  hintElement,
  onLevelChange: handleLevelChange,
  onUndo: handleUndo,
  onRestart: handleRestart,
  onSoundToggle: handleSoundToggle,
  onHapticsToggle: handleHapticsToggle,
});
const themeController = createThemeController({
  themeButtons,
});

createGestureController({
  boardElement,
  onPieceActive: (pieceId) => {
    session = setActivePiece(session, pieceId);
    metrics.lastGestureFeedbackAt = performance.now();
    render();
  },
  onMoveAttempt: async ({ pieceId, direction }) => {
    const move = getLegalMove(session.pieces, pieceId, direction);
    if (!move) {
      overlays.announce('该方向无法移动');
      render();
      return;
    }

    session = applyMoveToSession(
      {
        ...session,
        activePieceId: null,
      },
      move
    );

    if (isWinningState(session.pieces, session.exit)) {
      session = {
        ...session,
        status: SESSION_STATUS.won,
      };
    }

    metrics.lastMoveCompletedAt = performance.now();
    await audioFeedback.playMove();
    haptics.trigger(18);
    render();
  },
});

reloadEmptyButton?.addEventListener('click', () => {
  location.href = location.pathname;
});
reloadErrorButton?.addEventListener('click', () => {
  location.href = location.pathname;
});
playAgainButton?.addEventListener('click', () => {
  handleRestart();
});

window.addEventListener('resize', () => {
  metrics.lastResizeHandledAt = performance.now();
  boardRenderer.updateBoardSize();
  render();
});

setInterval(() => {
  const nextSession = updateElapsedTime(session);
  if (nextSession !== session) {
    session = nextSession;
    render();
  }
}, 250);

function handleLevelChange(levelId) {
  const nextLevel = getLevelById(levelId);
  if (!nextLevel) {
    session = createErrorSession('未找到所选关卡');
  } else {
    session = createSession(nextLevel, {
      ...session.feedbackSettings,
      soundSupported: audioFeedback.isSupported(),
      hapticsSupported: haptics.isSupported(),
    });
  }
  render();
}

function handleUndo() {
  if (!canUndo(session.historyStack)) {
    overlays.announce('当前没有可撤销的步骤');
    render();
    return;
  }

  const { snapshot, historyStack } = popHistory(session.historyStack);
  if (!snapshot) {
    return;
  }

  session = {
    ...session,
    pieces: snapshot.pieces,
    moveCount: snapshot.moveCount,
    elapsedMs: snapshot.elapsedMs,
    status: snapshot.status,
    historyStack,
  };
  overlays.announce('已撤销一步');
  render();
}

function handleRestart() {
  const currentLevel = getLevelById(session.levelId) ?? getDefaultLevel();
  if (!currentLevel) {
    session = createEmptySession();
  } else {
    session = restartSession(currentLevel, {
      ...session.feedbackSettings,
      soundSupported: audioFeedback.isSupported(),
      hapticsSupported: haptics.isSupported(),
    });
  }
  render();
}

function handleSoundToggle(enabled) {
  audioFeedback.setEnabled(enabled);
  session = {
    ...session,
    feedbackSettings: {
      ...session.feedbackSettings,
      soundEnabled: enabled,
    },
  };
  render();
}

function handleHapticsToggle(enabled) {
  haptics.setEnabled(enabled);
  session = {
    ...session,
    feedbackSettings: {
      ...session.feedbackSettings,
      hapticsEnabled: enabled,
    },
  };
  if (!haptics.isSupported()) {
    overlays.announce('当前设备不支持震动反馈');
  }
  render();
}

function resolveLevelsFromFixture() {
  const fixture = new URLSearchParams(window.location.search).get('fixture');
  if (fixture === 'empty') {
    return [];
  }
  if (fixture === 'error') {
    return [];
  }
  return getLevels();
}

function boot() {
  if (new URLSearchParams(window.location.search).get('fixture') === 'error') {
    session = createErrorSession('模拟的关卡加载失败');
  } else if (levels.length === 0) {
    session = createEmptySession();
  }

  metrics.readyAt = performance.now();
  globalThis['__app'] = {
    getSession: () => structuredClone(session),
    getTheme: () => themeController.getTheme(),
  };
  globalThis['__appMetrics'] = metrics;
  render();
}

function render() {
  boardRenderer.render(session);
  hud.render(session);
  settingsPanel.render(session, levels);
  overlays.render(session);
}

boot();
