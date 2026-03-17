import { BOARD_DIMENSIONS } from '../engine/board-state.js';

const BOARD_GAP = 8;
const BOARD_GUTTER = 12;
const BOARD_MAX_WIDTH = 400;
const CELL_MIN = 52;
const CELL_MAX = 88;

export function createBoardRenderer(boardElement) {
  function ensureBoardLayers() {
    let slotLayer = boardElement.querySelector('.board__slots');
    if (!slotLayer) {
      slotLayer = document.createElement('div');
      slotLayer.className = 'board__slots';
      boardElement.append(slotLayer);
    }

    const expectedSlots = BOARD_DIMENSIONS.columns * BOARD_DIMENSIONS.rows;
    if (slotLayer.childElementCount !== expectedSlots) {
      slotLayer.innerHTML = '';

      for (let index = 0; index < expectedSlots; index += 1) {
        const slot = document.createElement('div');
        slot.className = 'board__slot';
        slot.setAttribute('aria-hidden', 'true');
        slotLayer.append(slot);
      }
    }

    let pieceLayer = boardElement.querySelector('.board__pieces');
    if (!pieceLayer) {
      pieceLayer = document.createElement('div');
      pieceLayer.className = 'board__pieces';
      boardElement.append(pieceLayer);
    }

    return { pieceLayer };
  }

  function updateBoardSize() {
    const boardStageElement = boardElement.closest('.board-stage');
    const availableWidth = Math.max(
      (boardStageElement?.clientWidth ?? window.innerWidth) - 56,
      256
    );
    const targetBoardWidth = Math.min(availableWidth, BOARD_MAX_WIDTH);
    const computedCellSize = Math.floor(
      (targetBoardWidth -
        BOARD_GUTTER * 2 -
        BOARD_GAP * (BOARD_DIMENSIONS.columns - 1)) /
        BOARD_DIMENSIONS.columns
    );
    const nextCellSize = Math.max(Math.min(computedCellSize, CELL_MAX), CELL_MIN);
    boardElement.style.setProperty('--cell-size', `${nextCellSize}px`);
  }

  function render(session) {
    updateBoardSize();

    const { pieceLayer } = ensureBoardLayers();
    pieceLayer.innerHTML = '';

    for (const piece of session.pieces) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `board__piece board__piece--${piece.role}`;

      if (piece.widthCells > piece.heightCells) {
        button.classList.add('board__piece--wide');
      }

      if (session.activePieceId === piece.id) {
        button.classList.add('board__piece--active');
      }

      button.setAttribute('data-piece-id', piece.id);
      button.setAttribute('data-piece-role', piece.role);
      button.setAttribute(
        'aria-label',
        `${getRoleLabel(piece.role)}，位于 ${piece.row + 1} 行 ${piece.col + 1} 列`
      );
      button.style.zIndex = String(piece.row + piece.heightCells + 1);
      button.style.width = getSpanSize(piece.widthCells);
      button.style.height = getSpanSize(piece.heightCells);
      button.style.left = getOffset(piece.col);
      button.style.top = getOffset(piece.row);

      const label = document.createElement('span');
      label.className = `board__piece-label${
        piece.role === 'soldier' ? ' board__piece-label--soldier' : ''
      }`;
      label.textContent = getRoleLabel(piece.role);

      button.append(label);
      pieceLayer.append(button);
    }
  }

  ensureBoardLayers();
  updateBoardSize();
  window.addEventListener('resize', updateBoardSize);

  return {
    render,
    updateBoardSize,
  };
}

function getSpanSize(spanCount) {
  return `calc(var(--cell-size) * ${spanCount} + var(--board-gap) * ${spanCount - 1})`;
}

function getOffset(index) {
  return `calc(var(--board-gutter) + (var(--cell-size) + var(--board-gap)) * ${index})`;
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
