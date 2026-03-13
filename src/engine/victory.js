import { getPieceCells } from './board-state.js';

export function getTargetPiece(pieces) {
  return pieces.find((piece) => piece.role === 'target') ?? null;
}

export function isWinningState(pieces, exit) {
  const target = getTargetPiece(pieces);
  if (!target) {
    return false;
  }

  const targetCells = new Set(
    getPieceCells(target).map((cell) => `${cell.row}:${cell.col}`)
  );

  for (let rowOffset = 0; rowOffset < exit.heightCells; rowOffset += 1) {
    for (let colOffset = 0; colOffset < exit.widthCells; colOffset += 1) {
      const key = `${exit.row + rowOffset}:${exit.col + colOffset}`;
      if (!targetCells.has(key)) {
        return false;
      }
    }
  }

  return true;
}

export function getVictorySummary(levelName, moveCount, elapsedMs) {
  return `${levelName} 通关，用时 ${formatDuration(elapsedMs)}，共 ${moveCount} 步。`;
}

function formatDuration(elapsedMs) {
  const totalSeconds = Math.floor(elapsedMs / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}
