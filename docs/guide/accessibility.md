# Accessibility

Most icons sit next to a text label and add nothing for a screen reader. Some stand on their own, like a close button with no visible text, and need a name. The defaults are set up for the first case.

## Decorative icons

Vue components are hidden from assistive technology by default with `aria-hidden="true"`. You don't need to do anything:

```vue
<button>
  <OiTrash /> Delete
</button>
```

For the webfont, add `aria-hidden` yourself:

```html
<button>
  <i class="oi oi-trash" aria-hidden="true"></i> Delete
</button>
```

## Icons with meaning

When an icon is the only content of a control, give the control a name.

With a Vue component, pass `title`. It renders an SVG `<title>` and switches the element to `role="img"`:

```vue
<button>
  <OiTrash title="Delete item" />
</button>
```

With the webfont, label the control and hide the glyph:

```html
<button aria-label="Delete item">
  <i class="oi oi-trash" aria-hidden="true"></i>
</button>
```

Labelling the button rather than the icon is usually the better choice, and it works the same way for both packages.

## Colour and contrast

An icon that carries meaning, like an error state, needs the same contrast against its background as text does: 3:1 at minimum under WCAG for graphical objects. Don't rely on colour alone to tell states apart. Pair `exclamation-circle` in red with a written message, not just the red.

## Motion

`oi-spin` doesn't animate when the user has asked their system to reduce motion. If you animate icons yourself, respect `prefers-reduced-motion` in the same way.
