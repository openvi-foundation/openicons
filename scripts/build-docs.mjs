/**
 * Generates docs/index.html: a self-contained, searchable catalog of the icon set.
 *
 * This replaces demo.html, which was IcoMoon's generated preview and offered no search — with
 * 313 icons, discovery by scrolling is the main thing stopping people finding what they need.
 *
 * Icons are inlined as SVG from raw-svg/ rather than rendered with the webfont, so the page
 * works with no network and no font loading, and so an icon that is missing from the font is
 * visibly missing here too.
 *
 * Search matches names and the keyword tags carried in selection.json (`folder-plus` also
 * answers to add, new, create and container), which is why the tags are worth keeping in sync.
 *
 * Icons are grouped into the sections declared in categories.mjs; the sidebar filters by section
 * and carries the preview options, so the header stays a title and a search field.
 *
 * Output is one file with no external requests, so it can be opened directly or published to
 * any static host.
 *
 * Usage: node scripts/build-docs.mjs
 */

import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { categories, categoryIndex } from './categories.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SVG_DIR = join(root, 'raw-svg');
const DOCS_DIR = join(root, 'docs');
const SELECTION = join(root, 'selection.json');

const selection = JSON.parse(readFileSync(SELECTION, 'utf8'));

/** name -> { code, tags } from the IcoMoon project file. */
const meta = new Map(
    selection.icons.map((entry) => [
        entry.properties.name,
        { code: entry.properties.code.toString(16), tags: entry.icon.tags ?? [] }
    ])
);

const componentName = (name) => `Oi${name.split('-').map((part) => part[0].toUpperCase() + part.slice(1)).join('')}`;

const icons = readdirSync(SVG_DIR)
    .filter((file) => file.endsWith('.svg'))
    .sort()
    .map((file) => {
        const name = file.slice(0, -4);
        const svg = readFileSync(join(SVG_DIR, file), 'utf8');
        const body = (svg.match(/<g[^>]*>([\s\S]*)<\/g>/) || [, svg.replace(/<\/?svg[^>]*>/g, '')])[1];
        const info = meta.get(name);

        if (!info) throw new Error(`${file} has no entry in selection.json`);

        return { name, body, code: info.code, tags: info.tags, component: componentName(name) };
    });

const missing = [...meta.keys()].filter((name) => !icons.some((icon) => icon.name === name));

if (missing.length) throw new Error(`No SVG for: ${missing.join(', ')}`);

const byName = categoryIndex();
const uncategorised = icons.filter((icon) => !byName.has(icon.name)).map((icon) => icon.name);
const unknown = [...byName.keys()].filter((name) => !icons.some((icon) => icon.name === name));

if (uncategorised.length) throw new Error(`No category in scripts/categories.mjs for: ${uncategorised.join(', ')}`);
if (unknown.length) throw new Error(`scripts/categories.mjs lists icons that no longer exist: ${unknown.join(', ')}`);

/**
 * The prose counts drift every time an icon is added, and a stale "313 icons" in the README is
 * the kind of error nobody notices for months. Every count in the docs is written as "<n> icons"
 * so one check can police them all.
 */
const stale = ['README.md', join('packages', 'vue', 'README.md')].flatMap((file) => {
    const text = readFileSync(join(root, file), 'utf8');

    return [...text.matchAll(/(\d[\d,]*) icons/g)]
        .map((match) => Number(match[1].replace(/,/g, '')))
        .filter((count) => count !== icons.length)
        .map((count) => `${file} says "${count} icons"`);
});

if (stale.length) throw new Error(`Stale icon counts (the set has ${icons.length}): ${stale.join(', ')}`);

const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

/** Sections in the order categories.mjs declares them, each holding its icons in name order. */
const sections = Object.keys(categories).map((title) => ({
    title,
    id: slug(title),
    items: icons.filter((icon) => byName.get(icon.name) === title)
}));

const escape = (value) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const card = (icon) => `<button class="icon" data-name="${escape(icon.name)}" data-code="${icon.code}" data-component="${icon.component}" data-terms="${escape([...new Set([icon.name, ...icon.tags])].join(' '))}" type="button">
<svg viewBox="0 0 24 24" aria-hidden="true">${icon.body}</svg>
<span>${escape(icon.name)}</span>
</button>`;

const groups = sections
    .map(
        (section) => `<section class="group" id="g-${section.id}" data-category="${escape(section.title)}">
<h2>${escape(section.title)} <small>${section.items.length}</small></h2>
<div class="grid">
${section.items.map(card).join('\n')}
</div>
</section>`
    )
    .join('\n');

const filters = [
    '<button type="button" class="filter" data-category="" aria-pressed="true">All icons</button>',
    ...sections.map(
        (section) => `<button type="button" class="filter" data-category="${escape(section.title)}">${escape(section.title)}</button>`
    )
].join('\n');

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>OpenIcons — ${icons.length} icons</title>
<meta name="description" content="Searchable catalog of the OpenIcons set: ${icons.length} icons for OpenVue and other OpenVi Foundation projects.">
<style>
:root {
    --bg: #fff;
    --fg: #16181d;
    --muted: #6b7280;
    --line: #e5e7eb;
    --accent: #2563eb;
    --card: #fff;
    --hover: #f6f7f9;
}
/* Dark values live in one place and are applied either by preference or by an explicit choice;
   data-theme on <html> always wins so the sidebar toggle can override the OS in both directions. */
:root { color-scheme: light dark; }
:root[data-theme="light"] { color-scheme: light; }
:root[data-theme="dark"] { color-scheme: dark; }
@media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
        --bg: #0e1014;
        --fg: #e8eaed;
        --muted: #9aa1ad;
        --line: #262b33;
        --accent: #6a9bff;
        --card: #14171d;
        --hover: #1b1f27;
    }
}
:root[data-theme="dark"] {
    --bg: #0e1014;
    --fg: #e8eaed;
    --muted: #9aa1ad;
    --line: #262b33;
    --accent: #6a9bff;
    --card: #14171d;
    --hover: #1b1f27;
}
* { box-sizing: border-box; }
body {
    margin: 0;
    background: var(--bg);
    color: var(--fg);
    font: 15px/1.5 ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
header {
    position: sticky;
    top: 0;
    z-index: 2;
    background: color-mix(in srgb, var(--bg) 92%, transparent);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--line);
    padding: 1rem 0;
}
/* Gutters live inside the wrapper, exactly as in .layout — with border-box sizing, padding on
   <header> instead would push the bar 2 gutters wider than the grid and break the alignment. */
.bar {
    display: flex;
    flex-wrap: wrap;
    gap: clamp(1rem, 3vw, 2.5rem);
    align-items: center;
    max-width: 1320px;
    margin: 0 auto;
    padding: 0 clamp(1rem, 4vw, 2.5rem);
}
h1 { font-size: 1.05rem; margin: 0; font-weight: 650; letter-spacing: -0.01em; width: 232px; }
.search {
    flex: 1 1 260px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border: 1px solid var(--line);
    border-radius: 8px;
    background: var(--card);
    padding: 0 0.7rem;
}
.search:focus-within { border-color: var(--accent); }
.search input {
    flex: 1;
    border: 0;
    outline: 0;
    background: none;
    color: inherit;
    font: inherit;
    padding: 0.55rem 0;
    min-width: 0;
}
.search kbd {
    border: 1px solid var(--line);
    border-radius: 4px;
    padding: 0.1rem 0.35rem;
    font: 500 11px ui-monospace, SFMono-Regular, Menlo, monospace;
    color: var(--muted);
}
.menu {
    display: none;
    border: 1px solid var(--line);
    background: var(--card);
    color: var(--muted);
    border-radius: 8px;
    padding: 0.45rem 0.7rem;
    font: 500 12px inherit;
    cursor: pointer;
}
.layout {
    display: grid;
    grid-template-columns: 232px minmax(0, 1fr);
    gap: clamp(1rem, 3vw, 2.5rem);
    max-width: 1320px;
    margin: 0 auto;
    padding: 1.5rem clamp(1rem, 4vw, 2.5rem) 4rem;
}
.sidebar {
    position: sticky;
    top: 72px;
    align-self: start;
    max-height: calc(100vh - 88px);
    overflow-y: auto;
    padding-right: 0.25rem;
}
.sidebar h3 {
    font-size: 11px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--muted);
    margin: 0 0 0.5rem;
    font-weight: 600;
}
.sidebar section + section { margin-top: 1.75rem; }
.filters { display: flex; flex-direction: column; gap: 1px; }
.filter {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    border: 0;
    background: none;
    color: var(--muted);
    border-radius: 7px;
    padding: 0.4rem 0.55rem;
    font: 500 13px inherit;
    text-align: left;
    cursor: pointer;
}
.filter small { font-size: 11px; font-weight: 400; opacity: 0.75; }
.filter:hover { background: var(--hover); color: var(--fg); }
.filter[aria-pressed="true"] { background: var(--hover); color: var(--accent); }
.option { margin-bottom: 1rem; }
.option label { display: flex; justify-content: space-between; font-size: 12px; color: var(--muted); margin-bottom: 0.35rem; }
.option input[type="range"] { width: 100%; accent-color: var(--accent); }
.seg {
    display: inline-flex;
    flex: none;
    /* Stretch to the flex line so the control ends up exactly as tall as the search field. */
    align-self: stretch;
    gap: 2px;
    border: 1px solid var(--line);
    border-radius: 8px;
    padding: 2px;
    background: var(--card);
}
.seg button {
    border: 0;
    background: none;
    color: var(--muted);
    border-radius: 6px;
    padding: 0.3rem 0.6rem;
    font: 500 12px inherit;
    cursor: pointer;
}
.seg button:hover { color: var(--fg); }
.seg button[aria-pressed="true"] { background: var(--hover); color: var(--accent); }
.swatches { display: flex; flex-wrap: wrap; gap: 0.3rem; }
.swatch {
    width: 24px;
    height: 24px;
    padding: 0;
    border: 1px solid var(--line);
    border-radius: 6px;
    background: var(--fill, currentColor);
    cursor: pointer;
}
.swatch[aria-pressed="true"] { outline: 2px solid var(--accent); outline-offset: 1px; }
/* The native colour input paints its own swatch (and in some engines its hex label), so it is
   made invisible and the wrapper shows the chosen colour instead. */
.swatch.custom { position: relative; overflow: hidden; }
.swatch.custom input {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    border: 0;
    opacity: 0;
    cursor: pointer;
}
.toggle { display: flex; align-items: center; gap: 0.5rem; font-size: 13px; color: var(--muted); cursor: pointer; }
.toggle input { accent-color: var(--accent); }
.group { scroll-margin-top: 84px; }
.group + .group { margin-top: 2.25rem; }
.group[hidden] { display: none; }
.group h2 {
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    margin: 0 0 0.6rem;
}
.group h2 small { color: var(--muted); font-weight: 400; margin-left: 0.35rem; }
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(var(--cell, 112px), 1fr));
    gap: 0.5rem;
}
.icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.6rem;
    padding: 1rem 0.5rem 0.7rem;
    border: 1px solid transparent;
    border-radius: 10px;
    background: none;
    color: inherit;
    font: inherit;
    cursor: pointer;
    text-align: center;
}
.icon:hover, .icon:focus-visible { background: var(--hover); border-color: var(--line); outline: none; }
.icon svg { width: var(--size, 24px); height: var(--size, 24px); fill: var(--icon, currentColor); }
.icon span {
    font-size: 11px;
    color: var(--muted);
    word-break: break-word;
    line-height: 1.3;
}
.icon[hidden] { display: none; }
body.no-labels .icon span { display: none; }
body.no-labels .icon { padding: 0.85rem 0.5rem; }
.empty { color: var(--muted); padding: 3rem 0; text-align: center; }
@media (max-width: 860px) {
    .menu { display: block; }
    .bar { gap: 1rem; }
    h1 { width: auto; }
    .layout { grid-template-columns: minmax(0, 1fr); }
    .sidebar {
        position: static;
        max-height: none;
        border: 1px solid var(--line);
        border-radius: 10px;
        padding: 1rem;
    }
    .sidebar[hidden] { display: none; }
}
dialog {
    border: 1px solid var(--line);
    border-radius: 14px;
    background: var(--card);
    color: var(--fg);
    padding: 0;
    width: min(560px, calc(100vw - 2rem));
    max-height: min(680px, calc(100vh - 3rem));
    overflow: hidden;
    box-shadow: 0 24px 48px -12px rgb(0 0 0 / 0.35);
}
dialog::backdrop { background: rgb(8 10 14 / 0.55); backdrop-filter: blur(2px); }
.sheet { display: flex; flex-direction: column; max-height: inherit; }
.sheet-head {
    display: flex;
    align-items: center;
    gap: 0.9rem;
    padding: 1.1rem 1.25rem;
    border-bottom: 1px solid var(--line);
}
/* Fixed tile so the header keeps its height whatever preview size is selected. */
.glyph {
    flex: none;
    display: grid;
    place-items: center;
    width: 64px;
    height: 64px;
    border: 1px solid var(--line);
    border-radius: 10px;
    background: var(--bg);
}
.glyph svg { fill: var(--icon, currentColor); }
.sheet-title { flex: 1; min-width: 0; }
.sheet-title h2 { margin: 0; font-size: 1.05rem; font-weight: 650; letter-spacing: -0.01em; }
.close {
    flex: none;
    align-self: flex-start;
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    border: 1px solid transparent;
    border-radius: 7px;
    background: none;
    color: var(--muted);
    font: 16px/1 inherit;
    cursor: pointer;
}
.close:hover { background: var(--hover); border-color: var(--line); color: var(--fg); }
.meta { display: flex; flex-wrap: wrap; gap: 0.4rem; padding: 0.9rem 1.25rem 0; }
.chip {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    border: 1px solid var(--line);
    border-radius: 999px;
    padding: 0.2rem 0.6rem;
    font: 500 11px inherit;
    color: var(--muted);
    background: none;
}
button.chip { cursor: pointer; }
button.chip:hover { color: var(--accent); border-color: var(--accent); }
.tabs { display: flex; gap: 0.25rem; padding: 0.9rem 1.25rem 0; border-bottom: 1px solid var(--line); }
.tabs button {
    border: 0;
    border-bottom: 2px solid transparent;
    background: none;
    color: var(--muted);
    padding: 0.35rem 0.15rem 0.55rem;
    margin-right: 0.9rem;
    font: 500 13px inherit;
    cursor: pointer;
}
.tabs button:hover { color: var(--fg); }
.tabs button[aria-selected="true"] { color: var(--fg); border-bottom-color: var(--accent); }
.panels { padding: 1.1rem 1.25rem 1.25rem; overflow-y: auto; }
.panel[hidden] { display: none; }
.field + .field { margin-top: 0.9rem; }
.field-label {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-size: 11px;
    color: var(--muted);
    margin-bottom: 0.35rem;
}
.snippet {
    display: flex;
    gap: 0.5rem;
    align-items: flex-start;
    border: 1px solid var(--line);
    border-radius: 9px;
    padding: 0.6rem 0.7rem;
    background: var(--bg);
}
.snippet code {
    flex: 1;
    font: 12px/1.6 ui-monospace, SFMono-Regular, Menlo, monospace;
    white-space: pre-wrap;
    word-break: break-word;
    /* Inlined SVG runs long; cap it rather than let one snippet stretch the dialog. */
    max-height: 7.5em;
    overflow: auto;
}
.snippet button {
    flex: none;
    border: 1px solid var(--line);
    background: var(--card);
    color: var(--muted);
    border-radius: 6px;
    padding: 0.25rem 0.55rem;
    font: 500 11px inherit;
    cursor: pointer;
}
.snippet button:hover { color: var(--accent); border-color: var(--accent); }
.hint { color: var(--muted); font-size: 11px; margin: 1rem 0 0; }
</style>
<script>
// Applied before first paint so a saved choice never flashes the other theme.
try {
    const saved = localStorage.getItem('openicons-theme');

    if (saved === 'light' || saved === 'dark') document.documentElement.dataset.theme = saved;
} catch (error) { /* private mode: fall back to the OS preference */ }
</script>
</head>
<body>
<header>
<div class="bar">
<h1>OpenIcons</h1>
<label class="search">
<input id="q" type="search" placeholder="Search by name or keyword…" autocomplete="off" aria-label="Search icons">
<kbd>/</kbd>
</label>
<div class="seg" id="theme" role="group" aria-label="Theme">
<button type="button" data-theme="system" aria-pressed="true">System</button>
<button type="button" data-theme="light">Light</button>
<button type="button" data-theme="dark">Dark</button>
</div>
<button class="menu" type="button" id="menu" aria-expanded="false" aria-controls="sidebar">Filters</button>
</div>
</header>
<main class="layout">
<aside class="sidebar" id="sidebar">
<section>
<h3>Categories</h3>
<div class="filters" id="filters">
${filters}
</div>
</section>
<section>
<h3>Options</h3>
<div class="option">
<label for="size">Size <span id="size-value">24px</span></label>
<input id="size" type="range" min="16" max="48" step="4" value="24">
</div>
<div class="option">
<label for="cell">Density <span id="cell-value">Comfortable</span></label>
<input id="cell" type="range" min="80" max="160" step="16" value="112">
</div>
<div class="option">
<label id="color-label">Color <span id="color-value">currentColor</span></label>
<div class="swatches" id="colors" role="group" aria-labelledby="color-label">
<button type="button" class="swatch" data-color="" aria-pressed="true" title="currentColor — inherits the surrounding text color"></button>
<button type="button" class="swatch" data-color="#2563eb" style="--fill: #2563eb" title="#2563eb"></button>
<button type="button" class="swatch" data-color="#16a34a" style="--fill: #16a34a" title="#16a34a"></button>
<button type="button" class="swatch" data-color="#e11d48" style="--fill: #e11d48" title="#e11d48"></button>
<button type="button" class="swatch" data-color="#f59e0b" style="--fill: #f59e0b" title="#f59e0b"></button>
<span class="swatch custom" id="custom-swatch" style="--fill: #7c3aed" title="Custom color"><input id="custom" type="color" value="#7c3aed" aria-label="Custom color"></span>
</div>
</div>
<label class="toggle"><input id="labels" type="checkbox" checked> Show names</label>
</section>
</aside>
<div id="results">
${groups}
<p class="empty" id="empty" hidden>No icons match that search.</p>
</div>
</main>

<dialog id="sheet" aria-labelledby="d-name">
<div class="sheet">
<div class="sheet-head">
<span class="glyph"><svg id="d-svg" viewBox="0 0 24 24" width="32" height="32" aria-hidden="true"></svg></span>
<div class="sheet-title">
<h2 id="d-name"></h2>
</div>
<button class="close" type="button" id="d-close" aria-label="Close">&#215;</button>
</div>
<div class="meta">
<span class="chip" id="d-category"></span>
<button type="button" class="chip" data-copy="d-code" title="Copy codepoint"><span id="d-code"></span></button>
<span class="chip" id="d-preview"></span>
</div>
<div class="tabs" role="tablist">
<button type="button" role="tab" id="tab-css" aria-controls="panel-css" aria-selected="true" data-tab="css">CSS class</button>
<button type="button" role="tab" id="tab-vue" aria-controls="panel-vue" aria-selected="false" data-tab="vue">Vue</button>
<button type="button" role="tab" id="tab-svg" aria-controls="panel-svg" aria-selected="false" data-tab="svg">SVG</button>
</div>
<div class="panels">
<div class="panel" id="panel-css" role="tabpanel" aria-labelledby="tab-css" data-panel="css">
<div class="field">
<div class="field-label"><span>Markup</span><span>needs openicons.css</span></div>
<div class="snippet"><code id="d-class"></code><button type="button" data-copy="d-class">Copy</button></div>
</div>
</div>
<div class="panel" id="panel-vue" role="tabpanel" aria-labelledby="tab-vue" data-panel="vue" hidden>
<div class="field">
<div class="field-label"><span>Import</span><span>@openvue/openicons-vue</span></div>
<div class="snippet"><code id="d-import"></code><button type="button" data-copy="d-import">Copy</button></div>
</div>
<div class="field">
<div class="field-label"><span>Template</span></div>
<div class="snippet"><code id="d-usage"></code><button type="button" data-copy="d-usage">Copy</button></div>
</div>
</div>
<div class="panel" id="panel-svg" role="tabpanel" aria-labelledby="tab-svg" data-panel="svg" hidden>
<div class="field">
<div class="field-label"><span>Inline SVG</span><span>no dependencies</span></div>
<div class="snippet"><code id="d-svg-code"></code><button type="button" data-copy="d-svg-code">Copy</button></div>
</div>
</div>
<p class="hint">Snippets follow the size and color set in Options.</p>
</div>
</div>
</dialog>

<script>
const results = document.getElementById('results');
const groups = [...document.querySelectorAll('.group')];
const cards = [...document.querySelectorAll('.icon')];
const input = document.getElementById('q');
const empty = document.getElementById('empty');
let category = '';

function filter() {
    const query = input.value.trim().toLowerCase();
    let shown = 0;

    for (const group of groups) {
        const inCategory = !category || group.dataset.category === category;
        let visible = 0;

        for (const card of group.querySelectorAll('.icon')) {
            const hit = inCategory && (!query || card.dataset.terms.includes(query));

            card.hidden = !hit;
            if (hit) visible++;
        }

        group.hidden = visible === 0;
        shown += visible;
    }

    empty.hidden = shown > 0;
}

input.addEventListener('input', filter);

document.getElementById('filters').addEventListener('click', (event) => {
    const button = event.target.closest('.filter');

    if (!button) return;

    for (const other of document.querySelectorAll('.filter')) other.setAttribute('aria-pressed', 'false');

    button.setAttribute('aria-pressed', 'true');
    category = button.dataset.category;
    filter();

    // Scroll back up to the results when the user picked a category from further down the page,
    // but never nudge downwards: from the top of the page, picking a filter should not move at all.
    const top = results.getBoundingClientRect().top + window.scrollY - 88;

    window.scrollTo({ top: Math.max(0, Math.min(top, window.scrollY)), behavior: 'smooth' });
});

// "/" focuses search the way it does in most docs sites, but never while the user is already
// typing somewhere or the dialog has focus.
document.addEventListener('keydown', (event) => {
    if (event.key === '/' && document.activeElement !== input && !document.querySelector('dialog[open]')) {
        event.preventDefault();
        input.focus();
    }
});

const theme = document.getElementById('theme');

function setTheme(choice) {
    for (const button of theme.querySelectorAll('button')) {
        button.setAttribute('aria-pressed', String(button.dataset.theme === choice));
    }

    if (choice === 'system') delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = choice;

    try {
        if (choice === 'system') localStorage.removeItem('openicons-theme');
        else localStorage.setItem('openicons-theme', choice);
    } catch (error) { /* private mode: the choice just does not persist */ }
}

setTheme(document.documentElement.dataset.theme || 'system');

theme.addEventListener('click', (event) => {
    const button = event.target.closest('button');

    if (button) setTheme(button.dataset.theme);
});

const size = document.getElementById('size');
const sizeValue = document.getElementById('size-value');

size.addEventListener('input', () => {
    document.documentElement.style.setProperty('--size', size.value + 'px');
    sizeValue.textContent = size.value + 'px';
    renderSnippets();
});

const colors = document.getElementById('colors');
const colorValue = document.getElementById('color-value');
const custom = document.getElementById('custom');
let color = '';

function setColor(value, pressed) {
    color = value;

    for (const swatch of colors.querySelectorAll('.swatch')) swatch.setAttribute('aria-pressed', 'false');

    if (pressed) pressed.setAttribute('aria-pressed', 'true');

    // Empty means currentColor: drop the override so the icons inherit the page text colour again.
    if (value) document.documentElement.style.setProperty('--icon', value);
    else document.documentElement.style.removeProperty('--icon');

    colorValue.textContent = value || 'currentColor';
    renderSnippets();
}

colors.addEventListener('click', (event) => {
    const swatch = event.target.closest('.swatch:not(.custom)');

    if (swatch) setColor(swatch.dataset.color, swatch);
});

custom.addEventListener('input', () => {
    const swatch = document.getElementById('custom-swatch');

    swatch.style.setProperty('--fill', custom.value);
    setColor(custom.value, swatch);
});

const cell = document.getElementById('cell');
const cellValue = document.getElementById('cell-value');
const density = (value) => (value <= 96 ? 'Compact' : value >= 144 ? 'Roomy' : 'Comfortable');

cell.addEventListener('input', () => {
    document.documentElement.style.setProperty('--cell', cell.value + 'px');
    cellValue.textContent = density(Number(cell.value));
});

const labels = document.getElementById('labels');

labels.addEventListener('change', () => {
    document.body.classList.toggle('no-labels', !labels.checked);
});

// On phones the sidebar is a disclosure above the grid rather than a column beside it.
const sidebar = document.getElementById('sidebar');
const menu = document.getElementById('menu');
const narrow = window.matchMedia('(max-width: 860px)');
const collapse = () => {
    sidebar.hidden = narrow.matches;
    menu.setAttribute('aria-expanded', String(!narrow.matches));
};

collapse();
narrow.addEventListener('change', collapse);
menu.addEventListener('click', () => {
    sidebar.hidden = !sidebar.hidden;
    menu.setAttribute('aria-expanded', String(!sidebar.hidden));
});

const sheet = document.getElementById('sheet');
const fields = {
    svg: document.getElementById('d-svg'),
    name: document.getElementById('d-name'),
    cls: document.getElementById('d-class'),
    imp: document.getElementById('d-import'),
    usage: document.getElementById('d-usage'),
    markup: document.getElementById('d-svg-code'),
    code: document.getElementById('d-code'),
    category: document.getElementById('d-category'),
    preview: document.getElementById('d-preview')
};
let selected = null;

/**
 * Snippets mirror the Options panel, so what gets copied renders the way the grid looks.
 *
 * Colour is only ever emitted as a style: the components paint with fill="currentColor" and have
 * no colour prop on purpose, so an icon inherits from its surroundings unless told otherwise.
 */
function renderSnippets() {
    if (!selected) return;

    const { name, component, paths } = selected;
    const px = size.value + 'px';
    const tint = color ? '; color: ' + color : '';

    fields.cls.textContent = '<i class="oi oi-' + name + '" style="font-size: ' + px + tint + '"></i>';
    fields.imp.textContent = "import " + component + " from '@openvue/openicons-vue/icons/" + component + "';";
    fields.usage.textContent = '<' + component + ' :size="' + size.value + '"' + (color ? ' style="color: ' + color + '"' : '') + ' />';
    fields.markup.textContent = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="' + size.value +
        '" height="' + size.value + '" fill="' + (color || 'currentColor') + '">' + paths + '</svg>';
    fields.preview.textContent = size.value + 'px \u00b7 ' + (color || 'currentColor');
}

const tabs = document.querySelectorAll('.tabs button');

for (const tab of tabs) {
    tab.addEventListener('click', () => {
        for (const other of tabs) other.setAttribute('aria-selected', String(other === tab));

        for (const panel of document.querySelectorAll('.panel')) {
            panel.hidden = panel.dataset.panel !== tab.dataset.tab;
        }
    });
}

results.addEventListener('click', (event) => {
    const card = event.target.closest('.icon');

    if (!card) return;

    const { name, code, component } = card.dataset;

    selected = { name, component, paths: card.querySelector('svg').innerHTML };
    fields.svg.innerHTML = selected.paths;
    fields.name.textContent = name;
    fields.code.textContent = 'U+' + code.toUpperCase();
    fields.category.textContent = card.closest('.group').dataset.category;
    renderSnippets();
    sheet.showModal();
});

document.getElementById('d-close').addEventListener('click', () => sheet.close());

// Clicking the backdrop closes: the click lands on <dialog> itself, never on the panel inside it.
sheet.addEventListener('click', (event) => {
    if (event.target === sheet) sheet.close();
});

for (const button of document.querySelectorAll('[data-copy]')) {
    button.addEventListener('click', async () => {
        await navigator.clipboard.writeText(document.getElementById(button.dataset.copy).textContent);
        const label = button.textContent;

        button.textContent = 'Copied';
        setTimeout(() => { button.textContent = label; }, 1200);
    });
}
</script>
</body>
</html>
`;

mkdirSync(DOCS_DIR, { recursive: true });
writeFileSync(join(DOCS_DIR, 'index.html'), page);

console.log(`Built docs/index.html with ${icons.length} icons`);
