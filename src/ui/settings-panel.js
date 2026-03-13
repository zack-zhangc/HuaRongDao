export function createSettingsPanel({
  levelSelect,
  undoButton,
  restartButton,
  soundToggle,
  hapticsToggle,
  hintElement,
  onLevelChange,
  onUndo,
  onRestart,
  onSoundToggle,
  onHapticsToggle,
}) {
  levelSelect.addEventListener('change', (event) => {
    const target = /** @type {HTMLSelectElement} */ (event.currentTarget);
    onLevelChange(target.value);
  });
  undoButton.addEventListener('click', onUndo);
  restartButton.addEventListener('click', onRestart);
  soundToggle.addEventListener('change', (event) => {
    const target = /** @type {HTMLInputElement} */ (event.currentTarget);
    onSoundToggle(target.checked);
  });
  hapticsToggle.addEventListener('change', (event) => {
    const target = /** @type {HTMLInputElement} */ (event.currentTarget);
    onHapticsToggle(target.checked);
  });

  return {
    render(session, levels) {
      syncOptions(levelSelect, levels, session.levelId);
      levelSelect.disabled = levels.length === 0;
      undoButton.disabled = session.historyStack.length === 0;
      restartButton.disabled = ['loading', 'empty', 'error'].includes(session.status);
      soundToggle.disabled = !session.feedbackSettings.soundSupported;
      soundToggle.checked = session.feedbackSettings.soundEnabled;
      hapticsToggle.checked = session.feedbackSettings.hapticsEnabled;
      hapticsToggle.disabled = !session.feedbackSettings.hapticsSupported;
      hintElement.textContent = getHintText(session);
    },
  };
}

function syncOptions(levelSelect, levels, levelId) {
  const optionMarkup = levels
    .map(
      (level) =>
        `<option value="${level.id}">${level.name} · ${mapDifficultyLabel(level.difficulty)}</option>`
    )
    .join('');

  if (levelSelect.innerHTML !== optionMarkup) {
    levelSelect.innerHTML = optionMarkup;
  }

  if (levels.some((level) => level.id === levelId)) {
    levelSelect.value = levelId;
  }
}

function mapDifficultyLabel(difficulty) {
  switch (difficulty) {
    case 'easy':
      return '简单';
    case 'medium':
      return '中等';
    case 'hard':
      return '困难';
    default:
      return difficulty;
  }
}

function getHintText(session) {
  switch (session.status) {
    case 'empty':
      return '当前没有可玩的关卡，请重新加载。';
    case 'error':
      return '关卡加载失败，请稍后重试或刷新页面。';
    case 'won':
      return '已经通关，点击“再来一局”或切换关卡继续。';
    default:
      return session.historyStack.length === 0
        ? '按住棋子后沿一个方向滑动并释放即可尝试移动。'
        : '当前已记录操作历史，可使用“撤销”快速回退。';
  }
}
