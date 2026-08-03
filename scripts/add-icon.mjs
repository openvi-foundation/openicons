/**
 * Registers an icon that already exists in raw-svg/ into selection.json.
 *
 * selection.json is the font's source of truth, and until now it could only be produced by
 * round-tripping the set through IcoMoon. That is the one manual step in adding an icon, and it
 * is pure arithmetic: IcoMoon stores paths on a 1024 em grid, y-down, uniformly scaled so the
 * artwork fills the em box and centred on the other axis. This reproduces that transform.
 *
 * Codepoints are assigned by incrementing the highest one in use. They are never reused or
 * renumbered: the font is published, and a shifted codepoint silently changes which glyph every
 * page already using the font renders.
 *
 * Run scripts/normalize-svg.mjs first — this reads raw-svg/ as-is and assumes the canonical form
 * (24x24 viewBox, <path> only, no paint).
 *
 * Usage: node scripts/add-icon.mjs <name> [--tags keyword,keyword,...]
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import svgpath from 'svgpath';

import { unionBbox } from './lib/geometry.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SVG_DIR = join(root, 'raw-svg');
const SELECTION = join(root, 'selection.json');
const EM = 1024;

const args = process.argv.slice(2);
const name = args.find((arg) => !arg.startsWith('--'));
const tagArg = args.indexOf('--tags');
const tags = tagArg === -1 ? [] : (args[tagArg + 1] || '').split(',').map((tag) => tag.trim()).filter(Boolean);

if (!name) {
    console.error('Usage: node scripts/add-icon.mjs <name> [--tags keyword,keyword,...]');
    process.exit(1);
}

if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) {
    console.error(`"${name}" is not a valid icon name: use lowercase words separated by single hyphens`);
    process.exit(1);
}

const svg = readFileSync(join(SVG_DIR, `${name}.svg`), 'utf8');
const paths = [...svg.matchAll(/<path\b[^>]*\sd="([^"]*)"/g)].map((match) => match[1]);

if (!paths.length) {
    console.error(`raw-svg/${name}.svg has no <path> geometry`);
    process.exit(1);
}

if (/fill-rule="evenodd"/.test(svg)) {
    console.error(`raw-svg/${name}.svg uses fill-rule="evenodd"; the font merges paths under the nonzero rule and would render it differently`);
    process.exit(1);
}

const selection = JSON.parse(readFileSync(SELECTION, 'utf8'));

if (selection.icons.some((entry) => entry.properties.name === name)) {
    console.error(`${name} is already in selection.json`);
    process.exit(1);
}

const [minX, minY, maxX, maxY] = unionBbox(paths);
const [width, height] = [maxX - minX, maxY - minY];
const scale = EM / Math.max(width, height);
// Fills the em on its longer axis and is centred on the shorter one, which is what IcoMoon did
// to the 313 icons already in the file.
const padX = (EM - width * scale) / 2;
const padY = (EM - height * scale) / 2;

const scaled = paths.map((d) =>
    svgpath(d).translate(-minX, -minY).scale(scale).translate(padX, padY).round(3).toString()
);

const next = (key) => Math.max(...selection.icons.map((entry) => entry.properties[key])) + 1;
const code = next('code');

selection.icons.push({
    icon: {
        paths: scaled,
        attrs: paths.map(() => ({})),
        grid: selection.icons[0].icon.grid,
        tags: [...new Set([name, ...tags])],
        isMulticolor: false,
        isMulticolor2: false
    },
    attrs: paths.map(() => ({})),
    properties: { order: next('order'), id: next('id'), name, prevSize: 24, code },
    setIdx: 0,
    setId: 1,
    iconIdx: Math.max(...selection.icons.map((entry) => entry.iconIdx)) + 1
});

writeFileSync(SELECTION, JSON.stringify(selection));

console.log(`Added ${name} as U+${code.toString(16).toUpperCase()} (${paths.length} path${paths.length === 1 ? '' : 's'}); run pnpm build`);
