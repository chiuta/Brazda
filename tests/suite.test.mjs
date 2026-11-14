// Rulează suita BRAZDA (unitare + e2e + i18n-e2e) și iese cu cod ≠ 0 la primul eșec. Folosește playwright (npm i playwright).
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const shots = fs.mkdtempSync(path.join(os.tmpdir(), 'brazda-shots-'));
const steps = [['tests/unit.js'], ['tests/pwa.js'], ['tests/e2e.js', 'index.html', shots], ['tests/i18n-e2e.js', 'index.html']];
let ok = 0;
for (const s of steps) {
  const r = spawnSync('node', s, {cwd: dir, encoding: 'utf8', timeout: 580000});
  const tail = (r.stdout || '').trim().split('\n').slice(-1)[0];
  console.log(`${r.status === 0 ? 'ok' : 'FAIL'} ${s[0]} — ${tail}`);
  if (r.status !== 0) { console.log((r.stderr || '').slice(-400)); process.exit(1); }
  ok++;
}
fs.rmSync(shots, {recursive: true, force: true});
console.log(`${ok} ok`);
