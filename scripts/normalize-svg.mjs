/**
 * Normalizes raw-svg/ into one consistent, inline-safe form.
 *
 * The set arrived with two conventions mixed together. The original PrimeIcons artwork is bare
 * geometry on a 24x24 grid with no paint, so it inherits currentColor. The 55 icons added later
 * are Figma exports carrying fill="none" on the root and fill="black" on every shape, which
 * renders them permanently black and immune to CSS color. A handful also use <circle>/<rect>
 * instead of <path>, twitter.svg sits on a 14x14 viewBox, and android.svg ships a <style> block
 * whose generic .cls-1 selector leaks into the host document once the svg is inlined.
 *
 * None of that matters while the icons are only compiled into a font, because the font build
 * reads selection.json and paint is discarded anyway. It matters as soon as the artwork is
 * inlined as real SVG in a component, which is what packages/vue does.
 *
 * After this runs every icon is: a 0 0 24 24 viewBox, paint-free (so currentColor applies),
 * expressed purely as <path>, with no <style>, <defs> or <clipPath>.
 *
 * Geometry is preserved exactly, apart from twitter.svg which is uniformly scaled 14 -> 24.
 * The script verifies this by comparing each icon's bounding box before and after.
 *
 * Usage: node scripts/normalize-svg.mjs [--check]
 */

import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { optimize } from 'svgo';
import svgpath from 'svgpath';

import { unionBbox } from './lib/geometry.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SVG_DIR = join(root, 'raw-svg');
const GRID = 24;
const CHECK_ONLY = process.argv.includes('--check');

/** Paint values that mean "just use the inherited colour"; anything else would be real design intent. */
const DEFAULT_PAINT = new Set(['black', '#000', '#000000', 'white', '#fff', '#ffffff', 'currentcolor']);

const attr = (tag, name) => (tag.match(new RegExp(`\\s${name}="([^"]*)"`)) || [])[1];

/**
 * svgo resolves the <style> block into presentation attributes and rewrites circle/rect/ellipse
 * as paths, which is what lets the rest of this script assume a flat list of <path> elements.
 */
function toPaths(svg) {
    const { data } = optimize(svg, {
        multipass: true,
        plugins: [
            { name: 'inlineStyles', params: { onlyMatchedOnce: false } },
            'removeStyleElement',
            // convertArcs is required or <circle>/<ellipse> are left untouched, and this set
            // has 20 circles that would otherwise vanish from the extracted paths.
            { name: 'convertShapeToPath', params: { convertArcs: true } },
            'convertPathData',
            'collapseGroups',
            'removeUselessDefs',
            'removeComments',
            'removeMetadata'
        ]
    });

    return data;
}

/**
 * A single normalization pass. Returns either the canonical SVG text or a reason to refuse.
 *
 * One pass is not always a fixed point: svgo optimizes the source geometry, and the viewBox
 * rescale is applied afterwards, so a rescaled path has not itself been through convertPathData.
 * Running the pass again settles it. Callers iterate rather than assuming convergence.
 */
function normalizeOnce(original, name, file) {
    const viewBox = (original.match(/viewBox="([^"]+)"/) || [])[1];
    const [minX, minY, vbWidth, vbHeight] = (viewBox || `0 0 ${GRID} ${GRID}`).split(/[\s,]+/).map(Number);

    const optimized = toPaths(original);

    // Anything inside <defs> is a resource (clip paths, gradients), never drawn geometry.
    const drawable = optimized.replace(/<defs[\s\S]*?<\/defs>/g, '');

    const paths = [...drawable.matchAll(/<path\b([^>]*)\/?>/g)]
        .map((match) => match[1])
        .filter((tag) => {
            const fill = (attr(tag, 'fill') || '').toLowerCase();

            // fill="none" on a drawable shape means it renders nothing; drop it rather than
            // inherit currentColor and turn an invisible helper into a solid blob.
            return fill !== 'none';
        })
        .map((tag) => ({
            d: attr(tag, 'd'),
            fillRule: attr(tag, 'fill-rule'),
            clipRule: attr(tag, 'clip-rule'),
            fill: attr(tag, 'fill')
        }))
        .filter((path) => path.d);

    if (!paths.length) return { problem: `${file}: no drawable geometry after normalization` };

    const keptPaint = paths.map((p) => p.fill).filter((f) => f && !DEFAULT_PAINT.has(f.toLowerCase()));

    if (keptPaint.length) {
        return { problem: `${file}: non-default paint would be lost (${[...new Set(keptPaint)].join(', ')})` };
    }

    // Uniform scale onto the 24 grid. Every icon but twitter.svg is already there, so this is
    // the identity transform in 312 of 313 cases.
    const scale = GRID / Math.max(vbWidth, vbHeight);
    // Rounded to 3 decimals to match convertPathData's default precision. Rounding finer would
    // leave digits that svgo strips on the next run, so the script would never reach a fixed
    // point and --check would always report changes.
    const transform = (d) => svgpath(d).translate(-minX, -minY).scale(scale).round(3).toString();

    const rendered = paths.map((path) => ({ ...path, d: transform(path.d) }));
    const after = unionBbox(rendered.map((p) => p.d));

    // Measure against the untouched source rather than svgo's output, so that a shape actually
    // changed by optimization is caught rather than compared against itself. Icons whose source
    // used <circle>/<rect> have no path data to measure until svgo rewrites them, so for those
    // the comparison falls back to svgo's paths.
    const sourcePaths = [...original.replace(/<defs[\s\S]*?<\/defs>/g, '').matchAll(/<path\b([^>]*)\/?>/g)]
        .map((match) => attr(match[1], 'd'))
        .filter(Boolean);
    const measurable = sourcePaths.length === paths.length ? sourcePaths : paths.map((p) => p.d);

    const before = unionBbox(measurable);
    const expected = before.map((v, i) => (v - (i % 2 === 0 ? minX : minY)) * scale);
    const drift = Math.max(...after.map((v, i) => Math.abs(v - expected[i])));

    // 0.05 of a 24-unit grid is ~0.2% of the icon, below the precision convertPathData rounds to
    // and far below anything visible at the sizes these render at.
    if (drift > 0.05) return { problem: `${file}: geometry drifted by ${drift.toFixed(3)} units` };

    const body = rendered
        .map(({ d, fillRule, clipRule }) => {
            const rule = fillRule ? ` fill-rule="${fillRule}"` : '';
            const clip = clipRule ? ` clip-rule="${clipRule}"` : '';

            return `<path${rule}${clip} d="${d}"/>`;
        })
        .join('');

    return { output: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${GRID} ${GRID}"><g id="${name}">${body}</g></svg>` };
}

const files = readdirSync(SVG_DIR).filter((file) => file.endsWith('.svg')).sort();
const problems = [];
const pending = [];

// Three passes is comfortably above the two any icon in the set currently needs; exceeding it
// means the pass is oscillating rather than converging, which is a bug worth surfacing.
const MAX_PASSES = 3;

for (const file of files) {
    const original = readFileSync(join(SVG_DIR, file), 'utf8');
    const name = file.slice(0, -4);

    let current = original;
    let settled = false;

    for (let pass = 0; pass < MAX_PASSES; pass++) {
        const { output, problem } = normalizeOnce(current, name, file);

        if (problem) {
            problems.push(problem);
            settled = true;
            break;
        }

        if (output === current) {
            settled = true;
            break;
        }

        current = output;
    }

    if (!settled) {
        problems.push(`${file}: normalization did not converge in ${MAX_PASSES} passes`);
        continue;
    }

    if (current !== original) pending.push({ file, output: current });
}

// Nothing is written until every icon has passed, so a failure never leaves raw-svg/ half
// converted with some icons normalized and others not.
if (problems.length) {
    console.error(`Refused to normalize ${problems.length} icon(s); no files written:`);
    for (const problem of problems) console.error(`  ${problem}`);
    process.exit(1);
}

if (!CHECK_ONLY) {
    for (const { file, output } of pending) writeFileSync(join(SVG_DIR, file), output);
}

if (CHECK_ONLY && pending.length) {
    console.error(`${pending.length} of ${files.length} icons are not normalized:`);
    for (const { file } of pending) console.error(`  ${file}`);
    process.exit(1);
}

console.log(
    CHECK_ONLY
        ? `All ${files.length} icons are normalized`
        : `Normalized ${files.length} icons (${pending.length} rewritten)`
);
