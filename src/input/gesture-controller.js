export const DEFAULT_GESTURE_THRESHOLD = 24;

export function getGestureDirection(
  deltaX,
  deltaY,
  threshold = DEFAULT_GESTURE_THRESHOLD
) {
  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);

  if (Math.max(absX, absY) < threshold) {
    return null;
  }

  if (absX > absY) {
    return deltaX > 0 ? 'right' : 'left';
  }

  return deltaY > 0 ? 'down' : 'up';
}

export function createGestureController({
  boardElement,
  onPieceActive,
  onMoveAttempt,
  threshold = DEFAULT_GESTURE_THRESHOLD,
}) {
  let activeGesture = null;

  function getPieceIdFromTarget(target) {
    return target instanceof Element
      ? (target.closest('[data-piece-id]')?.getAttribute('data-piece-id') ?? null)
      : null;
  }

  function handlePointerDown(event) {
    const pieceId = getPieceIdFromTarget(event.target);
    if (!pieceId) {
      activeGesture = null;
      onPieceActive(null);
      return;
    }

    activeGesture = {
      pieceId,
      startX: event.clientX,
      startY: event.clientY,
    };
    onPieceActive(pieceId);
  }

  function handlePointerEnd(event) {
    if (!activeGesture) {
      onPieceActive(null);
      return;
    }

    const direction = getGestureDirection(
      event.clientX - activeGesture.startX,
      event.clientY - activeGesture.startY,
      threshold
    );
    const pieceId = activeGesture.pieceId;
    activeGesture = null;
    onPieceActive(null);

    if (direction) {
      onMoveAttempt({ pieceId, direction });
    }
  }

  boardElement.addEventListener('pointerdown', handlePointerDown);
  boardElement.addEventListener('pointerup', handlePointerEnd);
  boardElement.addEventListener('pointercancel', () => {
    activeGesture = null;
    onPieceActive(null);
  });

  return {
    destroy() {
      boardElement.removeEventListener('pointerdown', handlePointerDown);
      boardElement.removeEventListener('pointerup', handlePointerEnd);
    },
  };
}
