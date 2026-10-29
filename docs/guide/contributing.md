# Contributing

OpenIcons is maintained by volunteers, and most new icons come from people who needed them. Icon requests, bug reports and pull requests are all welcome.

## Requesting an icon

[Open an issue](https://github.com/openvi-foundation/openicons/issues/new) and describe where you'd use it. A sentence of context helps more than a name: "a toggle for showing the sidebar in an editor" tells us more than "sidebar icon". Check the [catalog](/icons/) and existing issues first, since the icon may already exist under another name.

## Drawing an icon

If you'd like to draw it yourself, open the issue first unless the gap is obvious. It saves you drawing something that doesn't fit.

- Draw on a 24×24 grid, centred.
- Match the line weight and corner style of nearby icons. Look at a few in the same category before you start.
- Use filled paths only. No strokes, no `fill-rule="evenodd"`, and no colours; the build makes every icon inherit `currentColor`.

## Adding it to the set

```bash
git clone https://github.com/openvi-foundation/openicons.git
cd openicons
pnpm install
```

Then:

```bash
cp my-icon.svg raw-svg/
pnpm normalize                                  # rewrites the SVG into canonical form
pnpm add-icon my-icon --tags "keyword,keyword"  # registers it and assigns a codepoint
```

Add the name to a category in `scripts/categories.mjs`, then build:

```bash
pnpm build
```

`pnpm build` regenerates the font, both stylesheets and the Vue components. Commit those generated files along with your SVG; CI checks that they match a fresh build.

Good keywords are the words someone would type when looking for the icon but that aren't in its name. `folder-plus` has `add`, `new` and `create`.

## Running the docs

```bash
pnpm docs:dev
```

This starts this site locally. New icons appear in the catalog and get their own page as soon as they're registered and categorised. The docs build fails if an icon is missing a category, so you'll know if you forgot.

## Pull requests

- Branch off `master`, one icon per pull request.
- Run `pnpm check` and `pnpm build` before pushing.
- Add a line under `## Unreleased` in `CHANGELOG.md` for anything users will notice.

The full checklist is in [CONTRIBUTING.md](https://github.com/openvi-foundation/openicons/blob/master/CONTRIBUTING.md).
