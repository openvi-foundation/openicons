# Webfont

Once [openicons.css](./installation#webfont) is loaded, an icon is an element with two classes: `oi` and the icon's own class.

```html
<i class="oi oi-check"></i>
```

Any inline element works. `<i>` is the convention; `<span>` is just as good.

## Size and colour

Glyphs are text, so they follow `font-size` and `color` like the words around them. Set those on the icon or on any parent.

```html
<i class="oi oi-bell" style="font-size: 1.5rem"></i>

<button class="danger">
  <i class="oi oi-trash"></i> Delete
</button>
```

The icons are drawn on a 24×24 grid, so they render crispest at 24px and 48px.

## Fixed width

Glyphs vary slightly in width. In a list or a menu where icons should line up, add `oi-fw` to give each one the same width.

```html
<ul class="menu">
  <li><i class="oi oi-fw oi-home"></i> Home</li>
  <li><i class="oi oi-fw oi-inbox"></i> Inbox</li>
  <li><i class="oi oi-fw oi-cog"></i> Settings</li>
</ul>
```

## Spinning

`oi-spin` rotates an icon continuously. It's meant for loading indicators.

```html
<i class="oi oi-spin oi-spinner"></i>
```

If the user has asked their system to reduce motion, the animation doesn't run.

## Using a codepoint in CSS

To put an icon in a pseudo-element, set the font family and the icon's codepoint. Each icon's page in the [catalog](/icons/) lists its codepoint.

```css
.external::after {
  font-family: 'openicons';
  content: '\e93c';
  margin-left: 0.25em;
}
```

Codepoints never change between releases, so this is safe to hard-code. See [Versioning](./versioning).

## Accessibility

A font glyph has no text of its own, and screen readers may announce the private-use character or skip it unpredictably. Hide decorative icons and label meaningful ones. The [Accessibility](./accessibility) page has examples.
