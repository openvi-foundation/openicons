---
layout: home
markdownStyles: false
---

<HomePage>
<template #webfont>

```html
<link rel="stylesheet"
      href="https://unpkg.com/@openvue/openicons/openicons.css">

<i class="oi oi-check"></i>
<i class="oi oi-spin oi-spinner"></i>
```

</template>
<template #vue>

```vue
<script setup>
import OiCheck from '@openvue/openicons-vue/icons/OiCheck';
</script>

<template>
  <OiCheck :size="20" title="Saved" />
</template>
```

</template>
<template #migrate>

```js
// main.js
import 'primeicons/primeicons.css'; // [!code --]
import '@openvue/openicons/primeicons.css'; // [!code ++]
```

</template>
</HomePage>
