# Changelog

For the PrimeIcons history up to 7.0.0, see [CHANGELOG_ARCHIVE.md](CHANGELOG_ARCHIVE.md).

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
