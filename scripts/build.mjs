import { cp, mkdir, readFile, rm, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const distDir = path.join(root, 'dist');
const copyTargets = ['index.html', 'styles', 'src', 'assets'];

async function ensureRuntimeInputs() {
  const required = ['index.html', 'styles/tokens.css', 'styles/app.css', 'src/main.js'];
  for (const relativePath of required) {
    await stat(path.join(root, relativePath));
  }

  const indexHtml = await readFile(path.join(root, 'index.html'), 'utf8');
  for (const reference of ['styles/tokens.css', 'styles/app.css', 'src/main.js']) {
    if (!indexHtml.includes(reference)) {
      throw new Error(`index.html is missing required reference: ${reference}`);
    }
  }
}

async function build() {
  await ensureRuntimeInputs();
  await rm(distDir, { force: true, recursive: true });
  await mkdir(distDir, { recursive: true });

  for (const target of copyTargets) {
    const sourcePath = path.join(root, target);
    try {
      await stat(sourcePath);
      await cp(sourcePath, path.join(distDir, target), { recursive: true });
    } catch {
      if (target !== 'assets') {
        throw new Error(`Missing build input: ${target}`);
      }
    }
  }

  console.log(`Build complete: ${distDir}`);
}

build().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
