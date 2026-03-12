export function createHistoryStack() {
  return [];
}

export function pushHistory(historyStack, snapshot) {
  return [...historyStack, snapshot];
}

export function canUndo(historyStack) {
  return historyStack.length > 0;
}

export function popHistory(historyStack) {
  if (!canUndo(historyStack)) {
    return {
      snapshot: null,
      historyStack,
    };
  }

  return {
    snapshot: historyStack[historyStack.length - 1],
    historyStack: historyStack.slice(0, -1),
  };
}
