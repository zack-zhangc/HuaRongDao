import {
  BOARD_DIMENSIONS,
  buildOccupancyMap,
  getPieceCells,
} from '../engine/board-state.js';

export function validateLevelShape(level) {
  const errors = [];

  if (!level || typeof level !== 'object') {
    return ['Level must be an object'];
  }
  if (typeof level.id !== 'string' || !level.id) {
    errors.push('Level id is required');
  }
  if (typeof level.name !== 'string' || !level.name) {
    errors.push('Level name is required');
  }
  if (!['easy', 'medium', 'hard'].includes(level.difficulty)) {
    errors.push('Level difficulty must be easy, medium or hard');
  }
  if (level.boardWidth !== BOARD_DIMENSIONS.columns) {
    errors.push('Level boardWidth must equal 4');
  }
  if (level.boardHeight !== BOARD_DIMENSIONS.rows) {
    errors.push('Level boardHeight must equal 5');
  }
  if (!Array.isArray(level.pieces) || level.pieces.length === 0) {
    errors.push('Level must provide at least one piece');
  }

  return errors;
}

export function validateLevelInvariants(level) {
  const errors = [...validateLevelShape(level)];
  if (errors.length > 0) {
    return errors;
  }

  const ids = new Set();
  const targetPieces = [];
  const occupancy = new Map();

  for (const piece of level.pieces) {
    if (ids.has(piece.id)) {
      errors.push(`Duplicate piece id: ${piece.id}`);
    }
    ids.add(piece.id);

    if (!['target', 'general', 'soldier'].includes(piece.role)) {
      errors.push(`Unsupported piece role: ${piece.role}`);
    }

    if (
      piece.row < 0 ||
      piece.col < 0 ||
      piece.row + piece.heightCells > BOARD_DIMENSIONS.rows ||
      piece.col + piece.widthCells > BOARD_DIMENSIONS.columns
    ) {
      errors.push(`Piece ${piece.id} is out of bounds`);
    }

    if (piece.role === 'target') {
      targetPieces.push(piece);
    }

    for (const cell of getPieceCells(piece)) {
      const key = `${cell.row}:${cell.col}`;
      if (occupancy.has(key)) {
        errors.push(`Pieces overlap at ${key}`);
      }
      occupancy.set(key, piece.id);
    }
  }

  if (targetPieces.length !== 1) {
    errors.push('Level must contain exactly one target piece');
  }

  const exit = level.exit;
  if (!exit || typeof exit !== 'object') {
    errors.push('Level exit is required');
  } else {
    for (let rowOffset = 0; rowOffset < exit.heightCells; rowOffset += 1) {
      for (let colOffset = 0; colOffset < exit.widthCells; colOffset += 1) {
        const row = exit.row + rowOffset;
        const col = exit.col + colOffset;
        if (
          row < 0 ||
          row >= BOARD_DIMENSIONS.rows ||
          col < 0 ||
          col >= BOARD_DIMENSIONS.columns
        ) {
          errors.push('Exit is out of bounds');
        }
      }
    }
  }

  return errors;
}

export function assertValidLevels(levels) {
  const levelIds = new Set();
  for (const level of levels) {
    if (levelIds.has(level.id)) {
      throw new Error(`Duplicate level id: ${level.id}`);
    }
    levelIds.add(level.id);

    const errors = validateLevelInvariants(level);
    if (errors.length > 0) {
      throw new Error(`Invalid level ${level.id}: ${errors.join('; ')}`);
    }

    const { valid } = buildOccupancyMap(level.pieces);
    if (!valid) {
      throw new Error(`Invalid level ${level.id}: occupancy map failed`);
    }
  }
}
