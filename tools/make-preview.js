/**
 * make-preview.js
 * ---------------------------------------------------------------------------
 * Copies _site/ to preview/ and rewrites every absolute path ("/assets/...")
 * into a relative one ("../assets/...") so you can double-click
 * preview/index.html and browse the whole site straight from your Mac,
 * with no server running.
 *
 * Run it with:  npm run preview
 *
 * IMPORTANT: preview/ is for looking at only. Deploy _site/ — the real host
 * needs the absolute paths, and pretty URLs like /about/ only work on a server.
 */

import fs from 'node:fs';
import path from 'node:path';

const SRC = '_site';
const OUT = 'preview';

if (!fs.existsSync(SRC)) {
  console.error('No _site folder yet. Run `npm run build` first.');
  process.exit(1);
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.cpSync(SRC, OUT, { recursive: true });

// Depth of a file inside preview/, e.g. about/index.html -> 1
const depthOf = (file) => file.split(path.sep).length - 1;
const prefixFor = (depth) => (depth === 0 ? './' : '../'.repeat(depth));

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    entry.isDirectory() ? walk(full, files) : files.push(full);
  }
  return files;
}

let pages = 0;

for (const full of walk(OUT)) {
  const rel = path.relative(OUT, full);
  const ext = path.extname(full);

  if (ext === '.html') {
    const prefix = prefixFor(depthOf(rel));
    let html = fs.readFileSync(full, 'utf8');

    // srcset holds a comma-separated list ("/a.jpg 800w, /b.jpg 1600w"),
    // so it needs its own pass before the single-URL attributes below.
    html = html.replace(/srcset="([^"]+)"/g, (_m, list) => {
      const rewritten = list
        .split(',')
        .map((part) => {
          const [url, ...rest] = part.trim().split(/\s+/);
          const out = url.startsWith('/') ? prefix + url.slice(1) : url;
          return [out, ...rest].join(' ');
        })
        .join(', ');
      return `srcset="${rewritten}"`;
    });

    html = html.replace(/(href|src)="\/([^"]*)"/g, (_m, attr, target) => {
      // Keep any #anchor on the end: "/services/#local-seo"
      const hashAt = target.indexOf('#');
      let t = hashAt === -1 ? target : target.slice(0, hashAt);
      const hash = hashAt === -1 ? '' : target.slice(hashAt);

      // "/" -> index.html, "/about/" -> about/index.html
      if (t === '') t = 'index.html';
      else if (t.endsWith('/')) t += 'index.html';

      return `${attr}="${prefix}${t}${hash}"`;
    });

    fs.writeFileSync(full, html);
    pages++;
  }

  if (ext === '.css') {
    // The stylesheet sits in assets/css/, so /assets/fonts/x -> ../fonts/x
    let css = fs.readFileSync(full, 'utf8');
    css = css.replace(/url\('\/assets\/([^']+)'\)/g, (_m, target) => {
      const fromCss = path.relative(path.dirname(rel), path.join('assets', target));
      return `url('${fromCss.split(path.sep).join('/')}')`;
    });
    fs.writeFileSync(full, css);
  }
}

console.log(`\nPreview ready — ${pages} pages.`);
console.log(`Double-click:  ${path.resolve(OUT, 'index.html')}\n`);
