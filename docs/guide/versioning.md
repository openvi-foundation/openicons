# Versioning

An icon font is a contract. Pages in production map class names to codepoints, and codepoints to glyphs. If a codepoint moved, every page using it would silently show a different icon after an upgrade. OpenIcons is set up so that can't happen.

## What never changes

Once an icon has been released:

- its name, and so its CSS class and component name, stays the same
- its codepoint stays the same
- it isn't removed

New icons are added at the next free codepoint. Codepoints are never reused, not even for an icon that was withdrawn before release.

This is checked by CI on every pull request. A change that moves an existing codepoint fails the build.

## What can change

- **New icons.** Adding an icon never affects the ones you already use.
- **Keywords and categories.** These only affect search and grouping in the catalog.

## Release notes

Every release is described in the [changelog](https://github.com/openvi-foundation/openicons/blob/master/CHANGELOG.md), including the name, codepoint and component of every icon it adds. The history from before the fork is kept in the [PrimeIcons archive](https://github.com/openvi-foundation/openicons/blob/master/CHANGELOG_ARCHIVE.md).
