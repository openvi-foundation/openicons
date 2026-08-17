# Changelog

For the PrimeIcons history up to 7.0.0, see [CHANGELOG_ARCHIVE.md](CHANGELOG_ARCHIVE.md).

## 1.0.0

First stable release. The packages are unchanged from `1.0.0-beta.1`; this promotes that build
after the beta period without further edits to the icons.

- `@openvue/openicons` and `@openvue/openicons-vue` both leave prerelease and publish to the
  `latest` tag. Installing either without a tag now resolves to 1.0.0.
- Install instructions drop the `@beta` tag, and the npm badge tracks `latest`.

The set is 323 icons. Every codepoint, CSS class and component name from the betas is unchanged,
so upgrading from `1.0.0-beta.0` or `1.0.0-beta.1` is a version bump with no migration.

## 1.0.0-beta.1

Documentation only; the packages are unchanged from `1.0.0-beta.0`.

- Install instructions and the npm badge point at the `beta` tag. The published
  `1.0.0-beta.0` readme still told readers to install `@alpha`, which resolves to
  `0.0.1-alpha.1` — the build from before the ten new icons.
- The readme lists the icons added in this release with their class and component names.

## 1.0.0-beta.0

The set is now maintained from its own source rather than round-tripped through IcoMoon, and
ships as Vue components alongside the webfont.

### Added

- **10 icons**, bringing the set to 323: `battery`, `bluetooth`, `code-branch`, `keyboard`,
  `laptop`, `layers`, `rss`, `sidebar`, `terminal`, `wifi-slash` (`U+EA3A`-`U+EA43`). Drawn on the
  same 24x24 grid and weight as the rest of the set.
- **`@openvue/openicons-vue`**, tree-shakeable Vue 3 components for every icon, with a `size` prop
  and `fill="currentColor"`. Importing two icons costs 1.3 KB.
- **`docs/index.html`**, a self-contained catalog: keyword search, 15 categories, size, density,
  colour and theme controls, and copyable class, import, inline-SVG and codepoint snippets.
- **`pnpm add-icon`**, which registers an icon into `selection.json` — the step that previously
  required the IcoMoon app. Codepoints are assigned by increment and never reused.
- **`pnpm normalize` / `pnpm check`**, which rewrite `raw-svg/` into one canonical form (24x24
  viewBox, `<path>` only, paint-free so icons inherit `currentColor`) and verify that no
  geometry moved.

### Changed

- `raw-svg/` filenames now match the names already in `selection.json`: `asteriks` to `asterisk`,
  and `sort-{alpha,numeric}-alt-{down,up}` to `sort-{alpha,numeric}-{down,up}-alt`. No CSS class,
  component name or codepoint changed.
- Published files are an allowlist rather than an ignore list. The package contains the fonts,
  stylesheets and `raw-svg/` only.

### Removed

- `demo.html` and `demo-files/`, IcoMoon's generated preview, superseded by `docs/index.html`.
  Neither was ever part of the published package.

No existing icon's codepoint moved.

## 0.0.1-alpha.1

First release of OpenIcons, a community continuation of PrimeIcons 7.0.0 under the
[OpenVi Foundation](https://github.com/openvi-foundation).

Published as `@openvue/openicons`. The unscoped `openicons` name is blocked by npm's
package-name similarity filter; the project itself is still called OpenIcons.

### Breaking changes

- **Renamed the CSS class prefix from `.pi` / `.pi-*` to `.oi` / `.oi-*`.** The stylesheet is
  now `openicons.css` and the font family is `openicons`.
- **Removed the `pi-prime` icon.** It was the PrimeTek logo mark, which the MIT license does
  not cover.

### Migration

Existing markup keeps working — no template changes required:

```diff
- import 'primeicons/primeicons.css';
+ import '@openvue/openicons/primeicons.css';
```

That entry point loads `openicons-compat.css`, which aliases every legacy `.pi-*` class onto
the new font. To move to the new prefix, import `@openvue/openicons/openicons.css` instead and rename
`pi pi-check` to `oi oi-check` throughout.

### Other

- Renamed the font files to `fonts/openicons.*`.
- Renamed the spin keyframes from `fa-spin` to `oi-spin`, a leftover from Font Awesome.
- Removed an IcoMoon account token that had been committed in `selection.json`.
- Rebranded package metadata, license attribution, and embedded font metadata.
