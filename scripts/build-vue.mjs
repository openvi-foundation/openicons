/**
 * Generates the @openvue/openicons-vue package from raw-svg/.
 *
 * Unlike the font, these components come from raw-svg/ rather than selection.json: the 24x24
 * source grid is the clean, consistently sized artwork, whereas selection.json holds IcoMoon's
 * per-icon normalized geometry where each glyph was stretched to fill the em box. That
 * normalization is right for a font (where the em box is the layout unit) and wrong for inline
 * SVG (where icons should share an optical size).
 *
 * Output is plain ESM with one module per icon, so bundlers drop what an app does not import.
 * No build step and no bundler: the published files are the source files.
 *
 * Usage: node scripts/build-vue.mjs
 */

import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SVG_DIR = join(root, 'raw-svg');
const PKG_DIR = join(root, 'packages', 'vue');
const ICON_DIR = join(PKG_DIR, 'icons');

/** `sort-alpha-down-alt` -> `OiSortAlphaDownAlt` */
const componentName = (name) => `Oi${name.split('-').map((part) => part[0].toUpperCase() + part.slice(1)).join('')}`;

const attr = (tag, name) => (tag.match(new RegExp(`\\s${name}="([^"]*)"`)) || [])[1];

/**
 * Pulls every <path> out of a normalized icon, keeping fill-rule and clip-rule.
 *
 * 47 icons rely on fill-rule="evenodd" for their cutouts, so dropping the attribute would fill
 * in the holes and quietly corrupt those icons. Run scripts/normalize-svg.mjs first: this
 * assumes the flat, paint-free, path-only shape it produces.
 */
function paths(file) {
    const svg = readFileSync(join(SVG_DIR, file), 'utf8');
    const found = [...svg.matchAll(/<path\b([^>]*)\/?>/g)]
        .map((match) => ({
            d: attr(match[1], 'd'),
            fillRule: attr(match[1], 'fill-rule'),
            clipRule: attr(match[1], 'clip-rule')
        }))
        .filter((path) => path.d);

    if (!found.length) throw new Error(`No path data in ${file}`);

    return found;
}

const icons = readdirSync(SVG_DIR)
    .filter((file) => file.endsWith('.svg'))
    .sort()
    .map((file) => {
        const name = file.slice(0, -4);

        return { name, component: componentName(name), paths: paths(file) };
    });

rmSync(ICON_DIR, { recursive: true, force: true });
mkdirSync(ICON_DIR, { recursive: true });

/**
 * Shared render factory. Every icon module calls this, so a bundle that imports fifty icons
 * still carries one copy of the rendering logic.
 *
 * The svg is aria-hidden by default because the overwhelming majority of icons sit next to a
 * text label and would only add noise for a screen reader. Passing a `title` opts into an
 * accessible name and flips the element to role="img".
 */
const RUNTIME = `import { h } from 'vue';

export function createIcon(name, paths) {
    return {
        name,
        props: {
            size: { type: [Number, String], default: '1em' },
            title: { type: String, default: null }
        },
        setup(props, { attrs }) {
            return () =>
                h(
                    'svg',
                    {
                        xmlns: 'http://www.w3.org/2000/svg',
                        viewBox: '0 0 24 24',
                        width: props.size,
                        height: props.size,
                        fill: 'currentColor',
                        'aria-hidden': props.title ? undefined : 'true',
                        role: props.title ? 'img' : undefined,
                        ...attrs
                    },
                    [
                        // Built conditionally rather than with a null placeholder, which Vue
                        // would render as a stray <!----> comment in SSR output.
                        ...(props.title ? [h('title', props.title)] : []),
                        ...paths.map(([d, fillRule, clipRule]) =>
                            h('path', { d, 'fill-rule': fillRule, 'clip-rule': clipRule })
                        )
                    ]
                );
        }
    };
}
`;

const RUNTIME_TYPES = `import type { DefineComponent } from 'vue';

export type IconComponent = DefineComponent<{
    /** Width and height of the rendered svg. Defaults to '1em', so it follows font-size. */
    size?: number | string;
    /** Accessible name. When omitted the icon is aria-hidden. */
    title?: string;
}>;

/** Each path is [d, fillRule?, clipRule?]. */
export declare function createIcon(name: string, paths: [string, string?, string?][]): IconComponent;
`;

writeFileSync(join(PKG_DIR, 'runtime.js'), RUNTIME);
writeFileSync(join(PKG_DIR, 'runtime.d.ts'), RUNTIME_TYPES);

for (const icon of icons) {
    // Tuples rather than objects: 313 modules times up to a dozen paths, so the shorter form
    // measurably shrinks the published package. undefined entries drop out of the rendered svg.
    const data = icon.paths
        .map(({ d, fillRule, clipRule }) => {
            const tail = clipRule ? `, '${fillRule ?? ''}', '${clipRule}'` : fillRule ? `, '${fillRule}'` : '';

            return `['${d}'${tail}]`;
        })
        .join(', ');

    writeFileSync(
        join(ICON_DIR, `${icon.component}.js`),
        `import { createIcon } from '../runtime.js';\n\nexport default createIcon('${icon.component}', [${data}]);\n`
    );
    writeFileSync(
        join(ICON_DIR, `${icon.component}.d.ts`),
        `import type { IconComponent } from '../runtime.js';\n\ndeclare const ${icon.component}: IconComponent;\nexport default ${icon.component};\n`
    );
}

writeFileSync(
    join(PKG_DIR, 'index.js'),
    `${icons.map((i) => `export { default as ${i.component} } from './icons/${i.component}.js';`).join('\n')}\n`
);
writeFileSync(
    join(PKG_DIR, 'index.d.ts'),
    `export type { IconComponent } from './runtime.js';\n\n${icons
        .map((i) => `export { default as ${i.component} } from './icons/${i.component}.js';`)
        .join('\n')}\n`
);

console.log(`Generated ${icons.length} Vue components into packages/vue/`);
