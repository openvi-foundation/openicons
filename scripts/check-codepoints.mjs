import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const baseRef = process.argv[2] || 'origin/master';

const hex = (code) => `\\${code.toString(16)}`;
const codepoints = (selection) => selection.icons.map(({ properties }) => [properties.name, properties.code]);

const current = codepoints(JSON.parse(readFileSync(join(root, 'selection.json'), 'utf8')));
const base = new Map(codepoints(JSON.parse(execFileSync('git', ['show', `${baseRef}:selection.json`], { cwd: root, encoding: 'utf8' }))));

const errors = [];
const byName = new Map();
const byCode = new Map();

for (const [name, code] of current) {
    if (byName.has(name)) errors.push(`"${name}" appears more than once`);
    if (byCode.has(code)) errors.push(`${hex(code)} is used by both "${byCode.get(code)}" and "${name}"`);
    byName.set(name, code);
    byCode.set(code, name);
}

for (const [name, code] of base) {
    if (!byName.has(name)) {
        errors.push(`"${name}" (${hex(code)}) was removed or renamed`);
    } else if (byName.get(name) !== code) {
        errors.push(`"${name}" moved from ${hex(code)} to ${hex(byName.get(name))}`);
    }
}

if (errors.length) {
    console.error(`Codepoint check against ${baseRef} failed:\n${errors.map((error) => `  - ${error}`).join('\n')}`);
    console.error('\nExisting codepoints are published and must never change. Add new icons with `pnpm add-icon` instead.');
    process.exit(1);
}

console.log(`All ${base.size} existing codepoints unchanged against ${baseRef}, ${current.length - base.size} new`);
