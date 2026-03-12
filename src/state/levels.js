import { assertValidLevels } from './validate-levels.js';

const EXIT = Object.freeze({
  row: 4,
  col: 1,
  widthCells: 2,
  heightCells: 1,
});

function createPiece(id, role, widthCells, heightCells, row, col, themeToken) {
  return { id, role, widthCells, heightCells, row, col, themeToken };
}

export const LEVELS = [
  {
    id: 'one-step-away',
    name: '一步之遥',
    difficulty: 'easy',
    optimalMoves: 1,
    boardWidth: 4,
    boardHeight: 5,
    exit: EXIT,
    pieces: [
      createPiece('target', 'target', 2, 2, 2, 1, '--target-color'),
      createPiece('tower-left-top', 'general', 1, 2, 0, 0, '--general-color'),
      createPiece('tower-right-top', 'general', 1, 2, 0, 3, '--general-color'),
      createPiece('bridge', 'general', 2, 1, 0, 1, '--general-color'),
      createPiece('tower-left-mid', 'general', 1, 2, 2, 0, '--general-color'),
      createPiece('tower-right-mid', 'general', 1, 2, 2, 3, '--general-color'),
      createPiece('guard-left', 'soldier', 1, 1, 4, 0, '--soldier-color'),
      createPiece('guard-right', 'soldier', 1, 1, 4, 3, '--soldier-color'),
    ],
  },
  {
    id: 'opening-breath',
    name: '开门见山',
    difficulty: 'easy',
    optimalMoves: 4,
    boardWidth: 4,
    boardHeight: 5,
    exit: EXIT,
    pieces: [
      createPiece('target', 'target', 2, 2, 1, 1, '--target-color'),
      createPiece('tower-left-top', 'general', 1, 2, 0, 0, '--general-color'),
      createPiece('tower-right-top', 'general', 1, 2, 0, 3, '--general-color'),
      createPiece('tower-left-bottom', 'general', 1, 2, 2, 0, '--general-color'),
      createPiece('tower-right-bottom', 'general', 1, 2, 2, 3, '--general-color'),
      createPiece('bar-top', 'general', 2, 1, 0, 1, '--general-color'),
      createPiece('soldier-left', 'soldier', 1, 1, 3, 1, '--soldier-color'),
      createPiece('soldier-right', 'soldier', 1, 1, 3, 2, '--soldier-color'),
      createPiece('guard-left', 'soldier', 1, 1, 4, 0, '--soldier-color'),
      createPiece('guard-right', 'soldier', 1, 1, 4, 3, '--soldier-color'),
    ],
  },
  {
    id: 'crossing-wind',
    name: '横扫千军',
    difficulty: 'medium',
    optimalMoves: 6,
    boardWidth: 4,
    boardHeight: 5,
    exit: EXIT,
    pieces: [
      createPiece('target', 'target', 2, 2, 0, 1, '--target-color'),
      createPiece('tower-left', 'general', 1, 2, 0, 0, '--general-color'),
      createPiece('tower-right', 'general', 1, 2, 0, 3, '--general-color'),
      createPiece('general-center-left', 'general', 1, 2, 2, 1, '--general-color'),
      createPiece('general-center-right', 'general', 1, 2, 2, 2, '--general-color'),
      createPiece('soldier-left-top', 'soldier', 1, 1, 2, 0, '--soldier-color'),
      createPiece('soldier-right-top', 'soldier', 1, 1, 2, 3, '--soldier-color'),
      createPiece('soldier-left-bottom', 'soldier', 1, 1, 4, 0, '--soldier-color'),
      createPiece('soldier-right-bottom', 'soldier', 1, 1, 4, 3, '--soldier-color'),
    ],
  },
  {
    id: 'cloud-pass',
    name: '插翅难飞',
    difficulty: 'medium',
    optimalMoves: 8,
    boardWidth: 4,
    boardHeight: 5,
    exit: EXIT,
    pieces: [
      createPiece('target', 'target', 2, 2, 0, 1, '--target-color'),
      createPiece('tower-left', 'general', 1, 2, 0, 0, '--general-color'),
      createPiece('tower-right', 'general', 1, 2, 0, 3, '--general-color'),
      createPiece('bridge', 'general', 2, 1, 2, 1, '--general-color'),
      createPiece('general-left-bottom', 'general', 1, 2, 2, 0, '--general-color'),
      createPiece('general-right-bottom', 'general', 1, 2, 2, 3, '--general-color'),
      createPiece('soldier-left', 'soldier', 1, 1, 3, 1, '--soldier-color'),
      createPiece('soldier-right', 'soldier', 1, 1, 3, 2, '--soldier-color'),
      createPiece('guard-left', 'soldier', 1, 1, 4, 0, '--soldier-color'),
      createPiece('guard-right', 'soldier', 1, 1, 4, 3, '--soldier-color'),
    ],
  },
  {
    id: 'long-river',
    name: '长河落日',
    difficulty: 'hard',
    optimalMoves: 12,
    boardWidth: 4,
    boardHeight: 5,
    exit: EXIT,
    pieces: [
      createPiece('target', 'target', 2, 2, 1, 1, '--target-color'),
      createPiece('tower-left-top', 'general', 1, 2, 0, 0, '--general-color'),
      createPiece('tower-right-top', 'general', 1, 2, 0, 3, '--general-color'),
      createPiece('general-left-bottom', 'general', 1, 2, 2, 0, '--general-color'),
      createPiece('general-right-bottom', 'general', 1, 2, 2, 3, '--general-color'),
      createPiece('bar-top', 'general', 2, 1, 0, 1, '--general-color'),
      createPiece('soldier-upper-left', 'soldier', 1, 1, 3, 1, '--soldier-color'),
      createPiece('soldier-upper-right', 'soldier', 1, 1, 3, 2, '--soldier-color'),
      createPiece('soldier-lower-left', 'soldier', 1, 1, 4, 1, '--soldier-color'),
      createPiece('soldier-lower-right', 'soldier', 1, 1, 4, 2, '--soldier-color'),
    ],
  },
];

assertValidLevels(LEVELS);

export function getLevels() {
  return LEVELS.map((level) => ({
    ...level,
    pieces: level.pieces.map((piece) => ({ ...piece })),
  }));
}

export function getLevelById(levelId) {
  return getLevels().find((level) => level.id === levelId) ?? null;
}

export function getDefaultLevel() {
  return getLevels()[0] ?? null;
}
