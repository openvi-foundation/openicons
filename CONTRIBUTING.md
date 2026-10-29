# Contributing to OpenIcons

Thanks for considering a contribution. OpenIcons is maintained by a small team of volunteers, and community contributions are what keep this project moving.

## Before you start

- Search existing [issues](https://github.com/openvi-foundation/openicons/issues) to check your request hasn't already been made.
- For a new icon, open an issue first describing where you'd use it, unless it's an obvious gap. It saves you drawing something that doesn't fit the set.

## Development setup

```bash
git clone https://github.com/openvi-foundation/openicons.git
cd openicons
pnpm install
pnpm build
```

Everything is built locally, with no hosted tooling and no browser step.

| Script | Output |
| --- | --- |
| `pnpm build` | runs the three builds below |
| `pnpm build:font` | `fonts/*` and the glyph rules of `openicons.css` |
| `pnpm build:compat` | `openicons-compat.css` |
| `pnpm build:vue` | `packages/vue/` components |
| `pnpm docs:dev` | the documentation site, locally with hot reload |
| `pnpm docs:build` | the documentation site, into `docs/.vitepress/dist` |
| `pnpm normalize` | rewrites `raw-svg/` into canonical form |
| `pnpm check` | fails if any icon is not normalized |
| `pnpm check:codepoints` | fails if an existing codepoint changed against `origin/master` |
| `pnpm add-icon <name>` | registers a new icon in `selection.json` |

`openicons.css`, `openicons-compat.css`, `fonts/` and `packages/vue/` are all generated. Never edit them by hand: edit `raw-svg/`, `selection.json` or the scripts, then run `pnpm build` and commit the output.

## Adding an icon

```bash
cp my-icon.svg raw-svg/                                  # 24x24 artwork
pnpm normalize                                           # canonical form, geometry verified
pnpm add-icon my-icon --tags "keyword,keyword"           # registers it in selection.json
# add "my-icon" to a category in scripts/categories.mjs
pnpm build                                               # font, CSS, components
```

Draw on the 24×24 grid, centred, at the same weight as the surrounding icons. Look at a few existing icons in the same category before you start.

`pnpm add-icon` reproduces the transform IcoMoon applied to the original set (a uniform scale onto the 1024 em grid, sized to fill the em and centred on the short axis) and assigns the next free codepoint. It refuses duplicate names and `fill-rule="evenodd"`, which the font would render differently once paths are merged.

Every icon must be listed in [`scripts/categories.mjs`](scripts/categories.mjs), which groups the icon catalog on the docs site. `pnpm docs:build` fails on an icon with no category and on a category naming an icon that no longer exists.

## Codepoints are append-only

The font is published, so a codepoint is a contract with every page already using it. Never rename, remove or renumber an existing icon: a shifted codepoint silently changes which glyph those pages render. `pnpm check:codepoints` enforces this, and CI runs it on every pull request.

## Why the font is built from selection.json

The font build reads geometry and codepoints from [`selection.json`](selection.json), not from `raw-svg/`. IcoMoon normalized every icon individually when it produced the original font, so rebuilding from the 24×24 artwork would silently resize every icon relative to what is already published. Keeping `selection.json` as the font's source makes the build reproducible against the shipped font.

IcoMoon still opens `selection.json` if you prefer its editor, but nothing in the build depends on it.

The font build is deterministic. Set `SOURCE_DATE_EPOCH` to stamp a real date into a release.

## Submitting a pull request

1. Fork the repository.
2. Create a branch off `master` (`git checkout -b feat/my-icon`).
3. Make your change and run `pnpm check` and `pnpm build`.
4. Commit the generated files together with your source changes.
5. Add a changelog entry under `## Unreleased` in [CHANGELOG.md](CHANGELOG.md) if the change is user-facing.
6. Open the PR against `master` and reference the related issue.

CI checks that the SVGs are normalized, that no existing codepoint changed, and that the committed build output matches a fresh build. One icon per PR is easiest to review.
