import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, test } from 'vitest';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const indexPath = path.resolve(currentDir, '../../index.html');

describe('ui contract test hooks', () => {
  test('index.html declares required test ids and live region', async () => {
    const html = await readFile(indexPath, 'utf8');
    for (const token of [
      'data-testid="board"',
      'data-testid="level-select"',
      'data-testid="move-count"',
      'data-testid="timer"',
      'data-testid="undo-button"',
      'data-testid="restart-button"',
      'data-testid="sound-toggle"',
      'data-testid="haptics-toggle"',
      'data-testid="win-dialog"',
      'data-testid="empty-state"',
      'data-testid="error-state"',
      'aria-live="polite"',
    ]) {
      expect(html).toContain(token);
    }
  });
});
