import { BOARD_DIMENSIONS } from '../engine/board-state.js';

export function createBoardRenderer(boardElement) {
  function updateBoardSize() {
    const maxWidth = Math.min(window.innerWidth * 0.78, 520);
    const maxHeight = Math.min(window.innerHeight * 0.66, 680);
    const cellSize = Math.floor(
      Math.min(maxWidth / BOARD_DIMENSIONS.columns, maxHeight / BOARD_DIMENSIONS.rows)
    );
    boardElement.style.setProperty('--cell-size', `${Math.max(cellSize, 56)}px`);
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
      button.setAttribute(
        'aria-label',
        `${getRoleLabel(piece.role)}，位于 ${piece.row + 1} 行 ${piece.col + 1} 列`
      );
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
