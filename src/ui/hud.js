export function createHud({
  levelNameElement,
  levelDifficultyElement,
  moveCountElement,
  timerElement,
  statusElement,
}) {
  return {
    render(session) {
      levelNameElement.textContent = session.levelName;
      levelDifficultyElement.textContent = session.difficulty;
      moveCountElement.textContent = String(session.moveCount);
      timerElement.textContent = formatDuration(session.elapsedMs);
      statusElement.textContent = mapStatusLabel(session.status);
    },
  };
}

export function formatDuration(elapsedMs) {
  const totalSeconds = Math.floor(elapsedMs / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function mapStatusLabel(status) {
  switch (status) {
    case 'ready':
      return '待开始';
    case 'active':
      return '进行中';
    case 'won':
      return '已通关';
    case 'empty':
      return '无关卡';
    case 'error':
      return '加载失败';
    default:
      return '载入中';
  }
}
