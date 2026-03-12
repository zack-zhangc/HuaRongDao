export const BOARD_DIMENSIONS = Object.freeze({
  columns: 4,
  rows: 5,
});

export function clonePieces(pieces) {
  return pieces.map((piece) => ({ ...piece }));
}

export function getPieceCells(piece) {
  const cells = [];
  for (let rowOffset = 0; rowOffset < piece.heightCells; rowOffset += 1) {
    for (let colOffset = 0; colOffset < piece.widthCells; colOffset += 1) {
      cells.push({
        row: piece.row + rowOffset,
        col: piece.col + colOffset,
      });
    }
  }
  return cells;
}

export function findPieceById(pieces, pieceId) {
  return pieces.find((piece) => piece.id === pieceId) ?? null;
}

export function buildOccupancyMap(
  pieces,
  board = BOARD_DIMENSIONS,
  ignorePieceId = null
) {
  const occupied = new Map();

  for (const piece of pieces) {
    if (piece.id === ignorePieceId) {
      continue;
    }

    for (const cell of getPieceCells(piece)) {
      if (
        cell.row < 0 ||
        cell.row >= board.rows ||
        cell.col < 0 ||
        cell.col >= board.columns
      ) {
        return {
          valid: false,
          occupied,
        };
      }

      occupied.set(`${cell.row}:${cell.col}`, piece.id);
    }
  }

  return {
    valid: true,
    occupied,
  };
}

export function isPieceWithinBoard(piece, board = BOARD_DIMENSIONS) {
  return (
    piece.row >= 0 &&
    piece.col >= 0 &&
    piece.row + piece.heightCells <= board.rows &&
    piece.col + piece.widthCells <= board.columns
  );
}

export function serializePieces(pieces) {
  return clonePieces(pieces)
    .sort((left, right) => left.id.localeCompare(right.id))
    .map(
      (piece) =>
        `${piece.id}:${piece.row},${piece.col},${piece.widthCells}x${piece.heightCells}`
    )
    .join('|');
}

export function updatePiecePosition(pieces, pieceId, row, col) {
  return pieces.map((piece) =>
    piece.id === pieceId ? { ...piece, row, col } : { ...piece }
  );
}
