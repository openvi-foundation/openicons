# @openvue/openicons-vue

Tree-shakeable Vue 3 SVG components for [OpenIcons](https://github.com/openvi-foundation/openicons) — 323 icons for OpenVue and other OpenVi Foundation projects.

> [!NOTE]
> Currently in **alpha**. Install with the `alpha` tag.

```bash
npm install @openvue/openicons-vue@alpha
```

## Usage

Import icons individually so bundlers can drop the rest:

```vue
<script setup>
import OiCheck from '@openvue/openicons-vue/icons/OiCheck';
import OiTrash from '@openvue/openicons-vue/icons/OiTrash';
</script>

<template>
  <OiCheck />
  <OiTrash :size="20" />
</template>
```

The barrel import is tree-shaken just as well by any modern bundler, if you prefer it:

```js
import { OiCheck, OiTrash } from '@openvue/openicons-vue';
```

Importing two icons from the barrel produces a 1.3 KB bundle (667 bytes gzipped); all 323 icons come to 166 KB (44 KB gzipped).

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `number \| string` | `'1em'` | Width and height of the svg |
| `title` | `string` | — | Accessible name |

Any other attribute (`class`, `style`, event listeners) passes through to the `<svg>`.

## Sizing and color

Icons default to `1em` and `fill: currentColor`, so they inherit from surrounding text with no extra CSS:

```vue
<p style="font-size: 1.5rem; color: tomato">
  Deleted <OiTrash />
</p>
```

## Accessibility

Icons are `aria-hidden="true"` by default, which is right for the common case of an icon beside a text label — announcing it would only add noise.

When an icon carries meaning on its own, give it a `title`. That renders an SVG `<title>` and switches the element to `role="img"`:

```vue
<button>
  <OiTrash title="Delete item" />
</button>
```

## Icon names

Component names are the PascalCase form of the CSS class, prefixed `Oi`: `oi-sort-alpha-down-alt` becomes `OiSortAlphaDownAlt`.

Browse and search the full set in [`docs/index.html`](https://github.com/openvi-foundation/openicons/blob/master/docs/index.html), which shows the import line for every icon.

## Relationship to the webfont

This package and [`@openvue/openicons`](https://www.npmjs.com/package/@openvue/openicons) cover the same 323 icons. Use the font when you want a drop-in `<i class="oi oi-check">` or are migrating from PrimeIcons; use these components when you want per-icon bundling and real SVG in the DOM.

## License

MIT
