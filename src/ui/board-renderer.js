import { BOARD_DIMENSIONS } from '../engine/board-state.js';

export function createBoardRenderer(boardElement) {
  function updateBoardSize() {
    const boardStageElement = boardElement.closest('.board-stage');
    const boardSceneElement = boardElement.closest('.board-scene');
    const availableWidth = Math.max(
      (boardStageElement?.clientWidth ?? window.innerWidth) - 56,
      208
    );
    const maxWidth = Math.min(availableWidth, 560);
    const maxHeight = Math.min(window.innerHeight * 0.58, 720);
    const cellSize = Math.floor(
      Math.min(maxWidth / BOARD_DIMENSIONS.columns, maxHeight / BOARD_DIMENSIONS.rows)
    );
    const nextCellSize = `${Math.max(Math.min(cellSize, 96), 52)}px`;
    (boardSceneElement ?? boardElement).style.setProperty('--cell-size', nextCellSize);
  }

  function render(session) {
    updateBoardSize();
    boardElement.innerHTML = '';

    for (const piece of session.pieces) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `board__piece board__piece--${piece.role}`;
      if (session.activePieceId === piece.id) {
        button.classList.add('board__piece--active');
      }
      button.setAttribute('data-piece-id', piece.id);
      button.setAttribute('data-piece-role', piece.role);
      button.setAttribute(
        'aria-label',
        `${getRoleLabel(piece.role)}，位于 ${piece.row + 1} 行 ${piece.col + 1} 列`
      );
      button.style.zIndex = String(piece.row + piece.heightCells);
      button.style.width = `calc(var(--cell-size) * ${piece.widthCells} - 8px)`;
      button.style.height = `calc(var(--cell-size) * ${piece.heightCells} - 8px)`;
      button.style.left = `calc(var(--cell-size) * ${piece.col} + 4px)`;
      button.style.top = `calc(var(--cell-size) * ${piece.row} + 4px)`;

      const label = document.createElement('span');
      label.className = 'board__piece-label';
      label.textContent = getRoleLabel(piece.role);
      button.append(label);
      boardElement.append(button);
    }
  }

  updateBoardSize();
  window.addEventListener('resize', updateBoardSize);

  return {
    render,
    updateBoardSize,
  };
}

function getRoleLabel(role) {
  switch (role) {
    case 'target':
      return '曹操';
    case 'general':
      return '武将';
    default:
      return '小兵';
  }
}
