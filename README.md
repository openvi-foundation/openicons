<div align="center">

# OpenIcons

**The icon library for OpenVue, continued.**

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/%40openvue%2Fopenicons/alpha.svg)](https://www.npmjs.com/package/@openvue/openicons)

</div>

## About

OpenIcons is a community-maintained continuation of PrimeIcons, the icon font used by PrimeVue and the wider Prime ecosystem, following its archival by the original maintainers. The project is stewarded by [openvi-foundation](https://github.com/openvi-foundation), an independent organization of experienced developers who use these libraries in production and are committed to keeping them maintained, stable, and open.

OpenIcons is not affiliated with PrimeTek or PrimeUI. It ships 323 icons as a webfont, with no dependencies and no build step required.

## Installation

> [!NOTE]
> OpenIcons is currently in **alpha**. Install with the `alpha` tag.

```bash
npm install @openvue/openicons@alpha
```

```js
import '@openvue/openicons/openicons.css';
```

Then reference an icon by class:

```html
<i class="oi oi-check"></i>
<i class="oi oi-spin oi-spinner"></i>
```

Icons inherit `font-size` and `color` from their parent, so they scale with surrounding text:

```html
<i class="oi oi-search" style="font-size: 1.5rem; color: var(--primary)"></i>
```

`oi-fw` gives an icon a fixed width, useful for aligning lists of menu items.

### Vue components

The webfont loads all 323 glyphs to show one, cannot be multicolored, and puts icons in the text layer where screen readers meet them. For Vue 3 apps, `@openvue/openicons-vue` ships each icon as a tree-shakeable SVG component instead — importing two icons costs under 1 KB.

```bash
npm install @openvue/openicons-vue@alpha
```

```vue
<script setup>
import OiCheck from '@openvue/openicons-vue/icons/OiCheck';
</script>

<template>
  <OiCheck />
  <OiCheck :size="32" title="Saved" />
</template>
```

Icons default to `1em` and `currentColor`, so they follow surrounding text exactly as the font does. They are `aria-hidden` unless given a `title`, which promotes them to `role="img"` with an accessible name.

### Browsing the set

Open [`docs/index.html`](docs/index.html) to browse all 323 icons, grouped into 15 categories and searchable by name or keyword — `create` finds `folder-plus`, `chart` also finds `table`. Pick any icon to copy its CSS class, component import, inline SVG or codepoint; the snippets follow the size and colour chosen in the sidebar. The page is self-contained, needs no server, and is not part of the published package.

The source SVGs are in [`raw-svg/`](raw-svg/) if you need them individually. Every one is a 24×24 viewBox with no hardcoded fill, so it inherits `currentColor` when inlined.

## Migrating from PrimeIcons

The class prefix changed from `pi` to `oi` in this release. Existing markup keeps working through a compatibility stylesheet, so the migration is a one-line dependency swap:

```diff
- import 'primeicons/primeicons.css';
+ import '@openvue/openicons/primeicons.css';
```

That entry point loads `openicons-compat.css`, which aliases every `.pi-*` class onto the new font. Nothing in your templates has to change.

To move to the new prefix, import `@openvue/openicons/openicons.css` instead and rename `pi pi-check` to `oi oi-check` throughout. Both stylesheets can be loaded at once during a gradual migration.

One icon was removed rather than renamed: `pi-prime` was the PrimeTek logo mark, which the MIT license does not cover.

## Ecosystem

The fork spans the full toolchain, each piece maintained under the [openvi-foundation](https://github.com/orgs/openvi-foundation/repositories) organization.

| Repository                                                                | Description                                    |
| ------------------------------------------------------------------------- | ---------------------------------------------- |
| [openvue](https://github.com/openvi-foundation/openvue)                   | The core Vue UI component library              |
| [openux](https://github.com/openvi-foundation/openux)                     | Shared theming and design-token package        |
| [openicons](https://github.com/openvi-foundation/openicons)               | Icon library (this repository)                 |
| [openvue-tailwind](https://github.com/openvi-foundation/openvue-tailwind) | Components styled with Tailwind CSS            |

## Contributing

We're building the initial maintainer team now. Issues and pull requests are open, and we'd welcome the help.

### Building

Everything generated in this repository is built locally — no hosted tooling and no browser step:

```bash
pnpm install
pnpm build
```

| Script | Output |
| --- | --- |
| `pnpm build:font` | `fonts/*` and the glyph rules of `openicons.css` |
| `pnpm build:compat` | `openicons-compat.css` |
| `pnpm build:vue` | `packages/vue/` components |
| `pnpm build:docs` | `docs/index.html` |
| `pnpm normalize` | rewrites `raw-svg/` into canonical form |
| `pnpm check` | fails if any icon is not normalized |
| `pnpm add-icon <name>` | registers a new icon in `selection.json` |

`openicons.css`, `openicons-compat.css`, `fonts/`, `packages/vue/` and `docs/` are all generated. Edit `raw-svg/`, `selection.json`, or the scripts instead.

The font build reads geometry and codepoints from [`selection.json`](selection.json), not from `raw-svg/`. IcoMoon normalized every icon individually when it produced the original font, so rebuilding from the 24×24 artwork would silently resize all 323 icons relative to what is already published. Keeping `selection.json` as the font's source makes the build reproducible against the shipped font — verified byte-identical geometry across the set.

### Adding an icon

Adding an icon no longer requires [IcoMoon](https://icomoon.io) or any other hosted tool:

```bash
cp my-icon.svg raw-svg/                                  # 24x24 artwork
pnpm normalize                                           # canonical form, geometry verified
pnpm add-icon my-icon --tags "keyword,keyword"           # registers it in selection.json
# add "my-icon" to a category in scripts/categories.mjs
pnpm build                                               # font, CSS, components, docs
```

`pnpm add-icon` reproduces the transform IcoMoon applied to the original set — a uniform scale onto the 1024 em grid, sized to fill the em and centred on the short axis — and assigns the next free codepoint. It refuses duplicate names and `fill-rule="evenodd"`, which the font would render differently once paths are merged.

**Codepoints are append-only.** Never reuse or renumber one: the font is published, and a shifted codepoint silently changes which glyph every page already using it renders.

Every icon must be listed in [`scripts/categories.mjs`](scripts/categories.mjs), which groups the docs catalog. `pnpm build:docs` fails on an icon with no category, on a category naming an icon that no longer exists, and on a stale icon count in either README — so the docs cannot quietly drift from the set.

IcoMoon still opens `selection.json` if you prefer its editor for reassigning codepoints, but nothing in the build depends on it.

The font build is deterministic — set `SOURCE_DATE_EPOCH` to stamp a real date into a release.

## License

MIT, unchanged. Every release under the MIT license stays exactly as it is. This fork doesn't affect that in any way.
