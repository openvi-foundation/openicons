# Migrating from PrimeIcons

You can switch in two steps. The first is a one-line change that keeps your templates as they are. The second, moving to the new class names, can happen whenever suits you, or not at all.

## Step 1: swap the package

Replace the dependency:

```bash
npm uninstall primeicons
npm install @openvue/openicons
```

Then change the import:

```js
import 'primeicons/primeicons.css'; // [!code --]
import '@openvue/openicons/primeicons.css'; // [!code ++]
```

That's it. `@openvue/openicons/primeicons.css` loads a compatibility stylesheet that maps every `pi` and `pi-*` class onto the OpenIcons font, so markup like this keeps working:

```html
<i class="pi pi-check"></i>
```

New icons that didn't exist in PrimeIcons get a `pi-` class too, so you can use them right away without renaming anything.

## Step 2: move to the oi- classes (optional)

Import the main stylesheet instead:

```js
import '@openvue/openicons/openicons.css';
```

Then rename the classes. `pi` becomes `oi` and every `pi-` prefix becomes `oi-`:

```html
<i class="pi pi-check"></i> <!-- [!code --] -->
<i class="oi oi-check"></i> <!-- [!code ++] -->
```

A search and replace across your templates handles most of it. Two patterns cover the common cases:

| Find (regex) | Replace |
| --- | --- |
| `\bpi pi-` | `oi oi-` |
| `\bpi-(?=[a-z])` | `oi-` |

Check the result before committing. The second pattern will also match any of your own classes that happen to start with `pi-`.

During a gradual migration you can load both stylesheets. The font is only downloaded once.

## What's different

- **`pi-prime` is gone.** It was the PrimeTek logo, which isn't covered by the MIT license. If you used it, replace it with your own asset.
- **The spin animation is `oi-spin`.** The class `pi-spin` still works through the compatibility stylesheet. If your own CSS refers to the `fa-spin` keyframes, a leftover from Font Awesome in PrimeIcons, rename it to `oi-spin`.
- **The font family is `openicons`.** This only matters if your CSS sets `font-family: 'primeicons'` directly, for example in a pseudo-element. Change it to `'openicons'`. Codepoints are the same.

Everything else (glyphs, codepoints, sizes, `pi-fw`) is unchanged.

## PrimeVue

PrimeVue components that use icon classes keep working with the compatibility stylesheet, because the class names they render are unchanged. If you're moving from PrimeVue to [OpenVue](https://openvue.dev), OpenIcons is the set it uses.
