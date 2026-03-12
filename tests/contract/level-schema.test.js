import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import Ajv from 'ajv';
import { describe, expect, test } from 'vitest';

import { LEVELS } from '../../src/state/levels.js';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.resolve(
  currentDir,
  '../../specs/001-minimal-klotski-web/contracts/level.schema.json'
);

describe('level.schema contract', () => {
  test('all bundled levels satisfy the published schema', async () => {
    const schema = JSON.parse(await readFile(schemaPath, 'utf8'));
    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(schema);

    for (const level of LEVELS) {
      const valid = validate(level);
      expect(valid, JSON.stringify(validate.errors)).toBe(true);
    }
  });
});
