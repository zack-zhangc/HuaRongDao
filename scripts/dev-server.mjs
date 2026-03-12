import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
};

const cwd = process.cwd();
const rootArg = process.argv[2] ?? '.';
const port = Number(process.argv[3] ?? process.env.PORT ?? 4173);
const rootDir = path.resolve(cwd, rootArg);
const fallbackFile = path.join(rootDir, 'index.html');

function contentTypeFor(filePath) {
  return MIME_TYPES[path.extname(filePath)] ?? 'application/octet-stream';
}

async function resolvePath(requestPath) {
  const decoded = decodeURIComponent(requestPath.split('?')[0]);
  const sanitized = decoded === '/' ? '/index.html' : decoded;
  const absolutePath = path.resolve(rootDir, `.${sanitized}`);

  if (!absolutePath.startsWith(rootDir)) {
    return null;
  }

  try {
    const fileStat = await stat(absolutePath);
    if (fileStat.isDirectory()) {
      return path.join(absolutePath, 'index.html');
    }
    return absolutePath;
  } catch {
    return fallbackFile;
  }
}

const server = http.createServer(async (request, response) => {
  if (!request.url) {
    response.writeHead(400);
    response.end('Bad Request');
    return;
  }

  const filePath = await resolvePath(request.url);
  if (!filePath) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  try {
    const contents = await readFile(filePath);
    response.writeHead(200, {
      'Content-Type': contentTypeFor(filePath),
      'Cache-Control': 'no-cache',
    });
    response.end(contents);
  } catch {
    response.writeHead(404, {
      'Content-Type': 'text/plain; charset=utf-8',
    });
    response.end('Not Found');
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Serving ${rootDir} on http://127.0.0.1:${port}`);
});
