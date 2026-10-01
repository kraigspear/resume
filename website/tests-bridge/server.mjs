import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../dist-pages/', import.meta.url)).replace(/\/$/, '');
const types = { '.html': 'text/html', '.pdf': 'application/pdf', '.jpg': 'image/jpeg', '.png': 'image/png' };
createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (!url.pathname.startsWith('/resume/')) throw new Error('Outside project');
    let path = resolve(root, decodeURIComponent(url.pathname.slice('/resume/'.length)) || '.');
    if (path !== root && !path.startsWith(root + sep)) throw new Error('Outside output');
    if ((await stat(path)).isDirectory()) path = resolve(path, 'index.html');
    const body = await readFile(path);
    res.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(await readFile(resolve(root, '404.html')));
  }
}).listen(4322, '127.0.0.1');
