import { getVictorySummary } from '../engine/victory.js';

export function createOverlays({
  loadingElement,
  emptyElement,
  errorElement,
  errorMessageElement,
  winElement,
  winSummaryElement,
  liveRegion,
}) {
  const overlayElements = [loadingElement, emptyElement, errorElement, winElement];

  function hideAll() {
    for (const element of overlayElements) {
      element.hidden = true;
    }
  }

  return {
    render(session) {
      hideAll();

      switch (session.status) {
        case 'loading':
          loadingElement.hidden = false;
          announce(liveRegion, '正在准备棋局');
          break;
        case 'empty':
          emptyElement.hidden = false;
          announce(liveRegion, '暂无可用关卡');
          break;
        case 'error':
          errorMessageElement.textContent = session.errorMessage || '请稍后重试。';
          errorElement.hidden = false;
          announce(liveRegion, '棋局加载失败');
          break;
        case 'won':
          winSummaryElement.textContent = getVictorySummary(
            session.levelName,
            session.moveCount,
            session.elapsedMs
          );
          winElement.hidden = false;
          announce(liveRegion, winSummaryElement.textContent);
          break;
        default:
          break;
      }
    },
    announce(message) {
      announce(liveRegion, message);
    },
  };
}

function announce(liveRegion, message) {
  liveRegion.textContent = '';
  liveRegion.textContent = message;
}
