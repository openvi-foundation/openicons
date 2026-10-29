/**
 * The icon set as the docs site sees it: one record per icon with its names, codepoint, keyword
 * tags and category.
 *
 * Every consumer goes through loadIcons(), so the checks below run on every docs build. They fail
 * on an SVG with no selection.json entry (or the reverse), on an icon with no category, and on a
 * category naming an icon that no longer exists.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { categories, categoryIndex } from './categories.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

export const SVG_DIR = join(root, 'raw-svg');
export const SELECTION = join(root, 'selection.json');
export const CATEGORIES = join(root, 'scripts', 'categories.mjs');

export const componentName = (name) => `Oi${name.split('-').map((part) => part[0].toUpperCase() + part.slice(1)).join('')}`;

export function loadIcons() {
    const selection = JSON.parse(readFileSync(SELECTION, 'utf8'));

    /** name -> { code, tags } from the IcoMoon project file. */
    const meta = new Map(
        selection.icons.map((entry) => [
            entry.properties.name,
            { code: entry.properties.code.toString(16).toUpperCase(), tags: entry.icon.tags ?? [] }
        ])
    );

    const byName = categoryIndex();
    const names = readdirSync(SVG_DIR)
        .filter((file) => file.endsWith('.svg'))
        .map((file) => file.slice(0, -4))
        .sort();

    const noEntry = names.filter((name) => !meta.has(name));
    const noSvg = [...meta.keys()].filter((name) => !names.includes(name));
    const uncategorised = names.filter((name) => !byName.has(name));
    const unknown = [...byName.keys()].filter((name) => !names.includes(name));

    if (noEntry.length) throw new Error(`No entry in selection.json for: ${noEntry.join(', ')}`);
    if (noSvg.length) throw new Error(`No SVG for: ${noSvg.join(', ')}`);
    if (uncategorised.length) throw new Error(`No category in scripts/categories.mjs for: ${uncategorised.join(', ')}`);
    if (unknown.length) throw new Error(`scripts/categories.mjs lists icons that no longer exist: ${unknown.join(', ')}`);

    // Tags in selection.json start with the icon's own name; repeating it adds nothing to search.
    return names.map((name) => ({
        name,
        component: componentName(name),
        code: meta.get(name).code,
        category: byName.get(name),
        tags: meta.get(name).tags.filter((tag) => tag !== name)
    }));
}

/** Category names in the order categories.mjs declares them. */
export const categoryOrder = Object.keys(categories);
