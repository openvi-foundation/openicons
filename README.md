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

Open [`demo.html`](demo.html) from a clone of this repository to browse every icon and its class name. The source SVGs are in [`raw-svg/`](raw-svg/) if you need them individually.

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

The font itself is generated with [IcoMoon](https://icomoon.io) from [`selection.json`](selection.json). If you change the icon set, regenerate the font files and then run `npm run build:compat` to rebuild the compatibility stylesheet — `openicons-compat.css` is generated and should never be edited by hand.

## License

MIT, unchanged. Every release under the MIT license stays exactly as it is. This fork doesn't affect that in any way.
