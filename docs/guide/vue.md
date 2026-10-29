# Vue components

`@openvue/openicons-vue` has one component per icon. Each one renders an inline `<svg>`, so there's no font to load and nothing is drawn as text.

## Importing

Import each icon from its own path:

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

Named imports from the package root work as well. Modern bundlers tree-shake them just as well, so pick whichever style you prefer:

```js
import { OiCheck, OiTrash } from '@openvue/openicons-vue';
```

Either way, two icons add about 1.3 KB to your bundle (667 bytes gzipped).

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `number \| string` | `'1em'` | Sets both width and height. Numbers are pixels. |
| `title` | `string` | | An accessible name. See [Accessibility](./accessibility). |

Every other attribute, including `class`, `style` and event listeners, goes straight to the `<svg>`.

```vue
<OiSearch class="text-muted" style="flex: none" @click="open" />
```

## Size and colour

The default size is `1em` and the fill is `currentColor`, so an icon matches the text around it the same way a font glyph would:

```vue
<p style="font-size: 1.5rem; color: tomato">
  Deleted <OiTrash />
</p>
```

To size an icon on its own, pass `size`:

```vue
<OiBell :size="24" />
<OiBell size="2rem" />
```

## Using icons dynamically

When the icon is only known at runtime, say from a menu config, keep the components in an object and look them up:

```vue
<script setup>
import { OiHome, OiInbox, OiCog } from '@openvue/openicons-vue';

const items = [
  { label: 'Home', icon: OiHome },
  { label: 'Inbox', icon: OiInbox },
  { label: 'Settings', icon: OiCog }
];
</script>

<template>
  <a v-for="item in items" :key="item.label">
    <component :is="item.icon" /> {{ item.label }}
  </a>
</template>
```

Avoid `import * as icons` followed by a lookup on a string name. The bundler can't tell which icons you use, so it has to include all of them.

## TypeScript

Every component ships with type declarations. No extra setup is needed.

## Webfont or components?

The two packages cover the same icons. Components are the better default for a Vue app: you ship only what you use, the icons are real SVG, and nothing flashes while a font loads. Use the [webfont](./webfont) when you're migrating from PrimeIcons, when you'd rather add a class than an import, or outside Vue.
