/**
 * Builds fonts/openicons.{svg,ttf,woff,woff2,eot} and the glyph rules of openicons.css.
 *
 * Source of truth is selection.json, not raw-svg/. That is deliberate: IcoMoon normalized
 * every icon individually when it produced the shipped font — measured scale factors across
 * the set range from 52x to 682x, and not one icon sits at the naive 1024/24 = 42.667. Building
 * from raw-svg/ would re-normalize with different factors and silently resize all 313 icons
 * relative to what is already published. selection.json holds the exact post-normalization
 * geometry IcoMoon used, so it is the only source that reproduces the current font.
 *
 * raw-svg/ remains the design source for the SVG component packages, where the clean 24x24
 * grid is what you actually want.
 *
 * Coordinate systems: selection.json stores paths y-down on a 1024 em grid. The SVG font
 * format is y-up from the baseline, so glyphs satisfy y_font = ascent - y_selection = 960 - y.
 * svgicons2svgfont performs exactly that flip given fontHeight 1024 and descent 64, which is
 * why normalize and centerHorizontally must both stay off — any extra fitting would break the
 * correspondence with the published font.
 *
 * Usage: node scripts/build-font.mjs
 */

import { createWriteStream, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { Readable } from 'node:stream';
import { fileURLToPath } from 'node:url';

import { SVGIcons2SVGFontStream } from 'svgicons2svgfont';
import svg2ttf from 'svg2ttf';
import ttf2eot from 'ttf2eot';
import ttf2woff from 'ttf2woff';
import ttf2woff2 from 'ttf2woff2';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SELECTION = join(root, 'selection.json');
const FONT_DIR = join(root, 'fonts');
const CSS = join(root, 'openicons.css');

const FONT_NAME = 'openicons';
const UNITS_PER_EM = 1024;
const DESCENT = 64; // ascent becomes UNITS_PER_EM - DESCENT = 960, matching the shipped font

const selection = JSON.parse(readFileSync(SELECTION, 'utf8'));
const { metadata, preferences } = selection;

/** name, codepoint and merged path data for every glyph, in selection.json order. */
const glyphs = selection.icons.map((entry) => ({
    name: entry.properties.name,
    code: entry.properties.code,
    path: entry.icon.paths.join(' ')
}));

const duplicates = glyphs
    .map((g) => g.code)
    .filter((code, i, all) => all.indexOf(code) !== i);

if (duplicates.length) {
    throw new Error(`Duplicate codepoints in selection.json: ${duplicates.map((c) => c.toString(16)).join(', ')}`);
}

/**
 * svgicons2svgfont reads icons from streams and takes the glyph name and codepoint from
 * properties set on each stream, so the paths never touch disk.
 */
function iconStream({ name, code, path }) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${UNITS_PER_EM} ${UNITS_PER_EM}"><path d="${path}"/></svg>`;
    const stream = Readable.from([svg]);

    stream.metadata = { name, unicode: [String.fromCodePoint(code)] };

    return stream;
}

function buildSvgFont() {
    return new Promise((resolve, reject) => {
        const chunks = [];
        const font = new SVGIcons2SVGFontStream({
            fontName: FONT_NAME,
            fontHeight: UNITS_PER_EM,
            descent: DESCENT,
            normalize: false,
            centerHorizontally: false,
            log: () => {}
        });

        font.on('data', (chunk) => chunks.push(chunk.toString('utf8')));
        font.on('end', () => resolve(chunks.join('')));
        font.on('error', reject);

        for (const glyph of glyphs) font.write(iconStream(glyph));

        font.end();
    });
}

/**
 * Rewrites only the glyph rules of openicons.css, preserving everything above the first one
 * (@font-face, .oi, .oi-fw, .oi-spin, the reduced-motion block and the keyframes) so hand
 * maintained rules survive a rebuild.
 */
function writeCss() {
    const current = readFileSync(CSS, 'utf8');
    const firstGlyph = current.search(/^\.oi-[a-z0-9-]+:before\s*\{/m);

    if (firstGlyph === -1) throw new Error('Could not locate the glyph rules in openicons.css');

    const preamble = current.slice(0, firstGlyph);
    const rules = glyphs
        .map(({ name, code }) => `.oi-${name}:before {\n    content: "\\${code.toString(16)}";\n}`)
        .join('\n\n');

    writeFileSync(CSS, `${preamble}${rules}\n`);
}

/**
 * IcoMoon emits an empty space glyph that svgicons2svgfont does not. No CSS rule references
 * it, but it is kept so the font's character map stays identical to what is already published.
 */
function withSpaceGlyph(svgFont) {
    const space = `<glyph unicode="&#x20;" glyph-name="space" horiz-adv-x="${UNITS_PER_EM / 2}" d="" />\n`;

    return svgFont.replace('</font>', `${space}</font>`);
}

/**
 * svg2ttf stamps the current time into the TTF head table, which makes every rebuild produce a
 * different binary and turns `fonts/` into permanent git noise. Pinning the timestamp makes the
 * build reproducible: identical input yields byte-identical output. Override with
 * SOURCE_DATE_EPOCH when a release should carry a real date.
 */
const TIMESTAMP = Number(process.env.SOURCE_DATE_EPOCH ?? 0);

const svgFont = withSpaceGlyph(await buildSvgFont());
const ttf = Buffer.from(
    svg2ttf(svgFont, {
        description: metadata.description ?? preferences?.fontPref?.metadata?.description,
        url: metadata.url,
        copyright: preferences?.fontPref?.metadata?.copyright,
        version: `${preferences?.fontPref?.metadata?.majorVersion ?? 1}.${preferences?.fontPref?.metadata?.minorVersion ?? 0}`,
        ts: TIMESTAMP
    }).buffer
);

writeFileSync(join(FONT_DIR, `${FONT_NAME}.svg`), svgFont);
writeFileSync(join(FONT_DIR, `${FONT_NAME}.ttf`), ttf);
writeFileSync(join(FONT_DIR, `${FONT_NAME}.woff`), Buffer.from(ttf2woff(ttf).buffer));
writeFileSync(join(FONT_DIR, `${FONT_NAME}.woff2`), ttf2woff2(ttf));
writeFileSync(join(FONT_DIR, `${FONT_NAME}.eot`), Buffer.from(ttf2eot(ttf).buffer));

writeCss();

console.log(`Built ${glyphs.length} glyphs into fonts/${FONT_NAME}.{svg,ttf,woff,woff2,eot} and openicons.css`);
