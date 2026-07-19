/**
 * Generates openicons-compat.css from openicons.css.
 *
 * OpenIcons renamed the PrimeIcons `.pi` / `.pi-*` classes to `.oi` / `.oi-*`. The compat
 * stylesheet re-declares every rule under the old prefix so existing markup keeps working.
 * It is generated rather than hand-maintained because 313 glyph rules kept in sync across
 * two prefixes by hand will drift.
 *
 * The @font-face and @keyframes blocks are dropped — they are not prefix-dependent and come
 * from the `@import` of the canonical stylesheet at the top of the output.
 *
 * Usage: node scripts/build-compat.mjs
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = join(root, 'openicons.css');
const OUTPUT = join(root, 'openicons-compat.css');

const HEADER = `/**
 * OpenIcons compatibility layer — DO NOT EDIT.
 * Generated from openicons.css by scripts/build-compat.mjs.
 *
 * Aliases the legacy PrimeIcons \`.pi\` / \`.pi-*\` class names onto the OpenIcons font so
 * markup written against PrimeIcons renders unchanged. New code should use \`.oi\` / \`.oi-*\`.
 */

@import './openicons.css';
`;

/**
 * Splits CSS into top-level blocks by brace depth, so nested at-rules (@media, @keyframes)
 * stay intact as a single unit.
 */
function topLevelBlocks(css) {
    const blocks = [];
    let depth = 0;
    let start = 0;

    for (let i = 0; i < css.length; i++) {
        if (css[i] === '{') depth++;
        else if (css[i] === '}') {
            depth--;
            if (depth === 0) {
                blocks.push(css.slice(start, i + 1).trim());
                start = i + 1;
            }
        }
    }

    return blocks.filter(Boolean);
}

const isDropped = (block) => /^@(font-face|(-\w+-)?keyframes)\b/.test(block);

/** Rewrites `.oi` and `.oi-*` selectors to the legacy `.pi` prefix. Only touches selectors. */
const toLegacyPrefix = (block) => block.replace(/\.oi\b/g, '.pi');

const source = readFileSync(SOURCE, 'utf8');
const blocks = topLevelBlocks(source).filter((block) => !isDropped(block)).map(toLegacyPrefix);

writeFileSync(OUTPUT, `${HEADER}\n${blocks.join('\n\n')}\n`);

console.log(`Wrote ${OUTPUT} (${blocks.length} rules)`);
