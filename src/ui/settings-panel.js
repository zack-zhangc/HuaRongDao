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
      undoButton.disabled = session.historyStack.length === 0;
      restartButton.disabled = ['loading', 'empty', 'error'].includes(session.status);
      soundToggle.checked = session.feedbackSettings.soundEnabled;
      hapticsToggle.checked = session.feedbackSettings.hapticsEnabled;
      hapticsToggle.disabled = !session.feedbackSettings.hapticsSupported;
      hintElement.textContent =
        session.status === 'empty'
          ? '当前没有可玩的关卡，请重新加载。'
          : '按住棋子后沿一个方向滑动并释放即可尝试移动。';
    },
  };
}

function syncOptions(levelSelect, levels, levelId) {
  const optionMarkup = levels
    .map(
      (level) =>
        `<option value="${level.id}">${level.name} · ${level.difficulty}</option>`
    )
    .join('');

  if (levelSelect.innerHTML !== optionMarkup) {
    levelSelect.innerHTML = optionMarkup;
  }

  if (levels.some((level) => level.id === levelId)) {
    levelSelect.value = levelId;
  }
}
