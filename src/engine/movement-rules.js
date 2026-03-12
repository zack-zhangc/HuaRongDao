import {
  BOARD_DIMENSIONS,
  buildOccupancyMap,
  findPieceById,
  getPieceCells,
  updatePiecePosition,
} from './board-state.js';

export const DIRECTIONS = Object.freeze({
  up: { row: -1, col: 0 },
  down: { row: 1, col: 0 },
  left: { row: 0, col: -1 },
  right: { row: 0, col: 1 },
});

function leadingEdgeCells(piece, direction) {
  const cells = getPieceCells(piece);

  switch (direction) {
    case 'up':
      return cells.filter((cell) => cell.row === piece.row);
    case 'down':
      return cells.filter((cell) => cell.row === piece.row + piece.heightCells - 1);
    case 'left':
      return cells.filter((cell) => cell.col === piece.col);
    case 'right':
      return cells.filter((cell) => cell.col === piece.col + piece.widthCells - 1);
    default:
      return [];
  }
}

export function getLegalMove(pieces, pieceId, direction, board = BOARD_DIMENSIONS) {
  const piece = findPieceById(pieces, pieceId);
  const vector = DIRECTIONS[direction];
  if (!piece || !vector) {
    return null;
  }

  const { valid, occupied } = buildOccupancyMap(pieces, board, pieceId);
  if (!valid) {
    return null;
  }

  const edgeCells = leadingEdgeCells(piece, direction);
  for (const cell of edgeCells) {
    const nextRow = cell.row + vector.row;
    const nextCol = cell.col + vector.col;
    if (
      nextRow < 0 ||
      nextRow >= board.rows ||
      nextCol < 0 ||
      nextCol >= board.columns
    ) {
      return null;
    }
    if (occupied.has(`${nextRow}:${nextCol}`)) {
      return null;
    }
  }

  const nextRow = piece.row + vector.row;
  const nextCol = piece.col + vector.col;

  return {
    pieceId,
    direction,
    from: { row: piece.row, col: piece.col },
    to: { row: nextRow, col: nextCol },
    pieces: updatePiecePosition(pieces, pieceId, nextRow, nextCol),
  };
}

export function canMove(pieces, pieceId, direction, board = BOARD_DIMENSIONS) {
  return getLegalMove(pieces, pieceId, direction, board) !== null;
}
