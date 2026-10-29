<div align="center">

# OpenIcons

**The icon library for OpenVue, continued.**

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/%40openvue%2Fopenicons.svg?label=%40openvue%2Fopenicons)](https://www.npmjs.com/package/@openvue/openicons)
[![npm](https://img.shields.io/npm/v/%40openvue%2Fopenicons-vue.svg?label=%40openvue%2Fopenicons-vue)](https://www.npmjs.com/package/@openvue/openicons-vue)
[![npm downloads](https://img.shields.io/npm/dt/%40openvue%2Fopenicons.svg)](https://www.npmjs.com/package/@openvue/openicons)

[**Browse icons**](docs/index.html) · [**Vue components**](packages/vue/README.md) · [**Migrate from PrimeIcons**](#migrating-from-primeicons) · [**Changelog**](CHANGELOG.md)

</div>

## About

OpenIcons is a community-maintained continuation of PrimeIcons, the icon font used by PrimeVue and the wider Prime ecosystem, following its archival by the original maintainers. The project is stewarded by [openvi-foundation](https://github.com/openvi-foundation), an independent organization of experienced developers who use these libraries in production and are committed to keeping them maintained, stable, and open.

OpenIcons is not affiliated with PrimeTek or PrimeUI. It ships 324 icons as a webfont and as Vue 3 components, with no runtime dependencies.

## Installation

```bash
npm install @openvue/openicons
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

## Vue components

The webfont loads every glyph to show one, cannot be multicolored, and puts icons in the text layer where screen readers meet them. For Vue 3 apps, `@openvue/openicons-vue` ships each icon as a tree-shakeable SVG component instead. Importing two icons costs under 1 KB.

```bash
npm install @openvue/openicons-vue
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

Icons default to `1em` and `currentColor`, so they follow surrounding text exactly as the font does. They are `aria-hidden` unless given a `title`, which promotes them to `role="img"` with an accessible name. See the [package README](packages/vue/README.md) for all props.

## Migrating from PrimeIcons

Existing markup keeps working through a compatibility stylesheet, so the migration is a one-line dependency swap:

```diff
- import 'primeicons/primeicons.css';
+ import '@openvue/openicons/primeicons.css';
```

That entry point loads `openicons-compat.css`, which aliases every `.pi-*` class onto the new font. Nothing in your templates has to change.

To move to the new prefix, import `@openvue/openicons/openicons.css` instead and rename `pi pi-check` to `oi oi-check` throughout. Both stylesheets can be loaded at once during a gradual migration.

One icon was removed rather than renamed: `pi-prime` was the PrimeTek logo mark, which the MIT license does not cover.

## Stability

Codepoints are append-only. New icons get new codepoints, and no existing icon is ever renamed, removed or renumbered, so upgrading can never change which glyph a class you already use renders. This is checked on every pull request.

## Ecosystem

The fork spans the full toolchain, each piece maintained under the [openvi-foundation](https://github.com/orgs/openvi-foundation/repositories) organization.

| Repository                                                                | Description                             |
| ------------------------------------------------------------------------- | --------------------------------------- |
| [openvue](https://github.com/openvi-foundation/openvue)                   | The core Vue UI component library       |
| [openux](https://github.com/openvi-foundation/openux)                     | Shared theming and design-token package |
| [openicons](https://github.com/openvi-foundation/openicons)               | Icon library (this repository)          |
| [openvue-tailwind](https://github.com/openvi-foundation/openvue-tailwind) | Components styled with Tailwind CSS     |

## Contributing

OpenIcons is maintained by the openvi-foundation team together with the community. Icon requests, bug reports, fixes and new icons are all welcome.

Start with the [contributing guide](CONTRIBUTING.md) for the build setup and the steps for adding an icon.

## License

MIT, unchanged. Every release under the MIT license stays exactly as it is. This fork doesn't affect that in any way.
