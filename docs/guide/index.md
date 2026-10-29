# Introduction

OpenIcons is an MIT fork of PrimeIcons, developed by the [OpenVi Foundation](https://openvi.dev). It started from the PrimeIcons set and has grown in its own direction since, with new icons and Vue 3 components alongside the webfont. It has no runtime dependencies.

Coming from PrimeIcons, you can switch without touching your templates, because every original name and codepoint still works. Starting fresh, you get a webfont for any page and tree-shakeable components for Vue apps.

## Two packages

Both packages contain the same icons under the same names. Pick the one that suits the project, or use both.

| | `@openvue/openicons` | `@openvue/openicons-vue` |
| --- | --- | --- |
| Format | Webfont and CSS classes | Vue 3 SVG components |
| Usage | `<i class="oi oi-check">` | `<OiCheck />` |
| What you ship | The whole font, once | Only the icons you import |
| Works without a bundler | Yes | No |
| PrimeIcons class names | Yes, through a compatibility stylesheet | No |

The webfont is the easier fit for an app that already uses PrimeIcons, for server-rendered pages, and for anywhere you'd rather add a class than an import. The components suit Vue apps that care about bundle size or want real SVG in the DOM, which screen readers and CSS handle better than font glyphs.

## Naming

Every icon has one name, and the other forms are derived from it:

| Form | Example |
| --- | --- |
| Icon name | `sort-alpha-down` |
| CSS class | `oi-sort-alpha-down` |
| PrimeIcons class | `pi-sort-alpha-down` |
| Vue component | `OiSortAlphaDown` |

## Next steps

- [Install a package](./installation)
- [Browse the icons](/icons/)
- [Migrate from PrimeIcons](./migrating)

## About the project

OpenIcons is not affiliated with PrimeTek or PrimeUI. The original set was released under the MIT license and this project keeps it that way. The one icon that was dropped is `pi-prime`, the PrimeTek logo, which the license doesn't cover.

The foundation also maintains [OpenVue](https://openvue.dev), a continuation of PrimeVue, and uses OpenIcons there.
