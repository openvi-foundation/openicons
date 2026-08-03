<div align="center">

# OpenIcons

**The icon library for OpenVue, continued.**

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/%40openvue%2Fopenicons/alpha.svg)](https://www.npmjs.com/package/@openvue/openicons)

</div>

## About

OpenIcons is a community-maintained continuation of PrimeIcons, the icon font used by PrimeVue and the wider Prime ecosystem, following its archival by the original maintainers. The project is stewarded by [openvi-foundation](https://github.com/openvi-foundation), an independent organization of experienced developers who use these libraries in production and are committed to keeping them maintained, stable, and open.

OpenIcons is not affiliated with PrimeTek or PrimeUI. It ships 313 icons as a webfont, with no dependencies and no build step required.

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

The webfont loads all 313 glyphs to show one, cannot be multicolored, and puts icons in the text layer where screen readers meet them. For Vue 3 apps, `@openvue/openicons-vue` ships each icon as a tree-shakeable SVG component instead — importing two icons costs under 1 KB.

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

Open [`docs/index.html`](docs/index.html) to search all 313 icons by name or keyword — `create` finds `folder-plus`, `chart` also finds `table` — and copy the class name, component import or codepoint for any of them. The page is self-contained and needs no server.

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

`openicons.css`, `openicons-compat.css`, `fonts/`, `packages/vue/` and `docs/` are all generated. Edit `raw-svg/`, `selection.json`, or the scripts instead.

The font build reads geometry and codepoints from [`selection.json`](selection.json), not from `raw-svg/`. IcoMoon normalized every icon individually when it produced the original font, so rebuilding from the 24×24 artwork would silently resize all 313 icons relative to what is already published. Keeping `selection.json` as the font's source makes the build reproducible against the shipped font — verified byte-identical geometry across the set.

[IcoMoon](https://icomoon.io) is still the editing surface: load `selection.json` there to add icons or reassign codepoints, then export it back and run `pnpm build`. The build no longer depends on it.

The font build is deterministic — set `SOURCE_DATE_EPOCH` to stamp a real date into a release.

## License

MIT, unchanged. Every release under the MIT license stays exactly as it is. This fork doesn't affect that in any way.
