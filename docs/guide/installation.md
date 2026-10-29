# Installation

## Webfont

::: code-group

```bash [npm]
npm install @openvue/openicons
```

```bash [pnpm]
pnpm add @openvue/openicons
```

```bash [yarn]
yarn add @openvue/openicons
```

:::

Import the stylesheet once, usually in your app's entry file:

```js
import '@openvue/openicons/openicons.css';
```

The stylesheet references the font files with relative paths, so any bundler that handles CSS (Vite, webpack, Nuxt, Rspack) will pick them up without extra configuration.

### Without a bundler

Link the stylesheet from a CDN:

```html
<link rel="stylesheet" href="https://unpkg.com/@openvue/openicons/openicons.css">
```

For production, pin the version in the URL, for example `@openvue/openicons@1.0.0`, so a release can't change your page without you knowing.

## Vue components

::: code-group

```bash [npm]
npm install @openvue/openicons-vue
```

```bash [pnpm]
pnpm add @openvue/openicons-vue
```

```bash [yarn]
yarn add @openvue/openicons-vue
```

:::

There's nothing to register. Import the icons where you use them:

```vue
<script setup>
import OiCheck from '@openvue/openicons-vue/icons/OiCheck';
</script>

<template>
  <OiCheck />
</template>
```

The package needs Vue 3 as a peer dependency and nothing else.

## What's in the webfont package

| File | Purpose |
| --- | --- |
| `openicons.css` | The `oi` classes and the font |
| `primeicons.css` | Compatibility entry point with the `pi` classes, for [migrating](./migrating) |
| `fonts/` | The font in WOFF2, WOFF, TTF, EOT and SVG |
| `raw-svg/` | Every icon as a 24×24 SVG file |

The `raw-svg/` folder is useful when you need an icon outside the browser, in a design tool or a native app for example. You can also download any single icon as SVG or PNG from its page in the [catalog](/icons/).
