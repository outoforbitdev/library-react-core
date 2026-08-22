# Icon Library Usage Guide

A set of reusable, accessible icons built with SVG and React. Icons inherit text color from their context and support multiple appearance variations.

## Basic Usage

Import icons from the library as a namespace:

```tsx
import { Icons } from "@outoforbitdev/ood-react";

export function MyComponent() {
  return (
    <button>
      <Icons.Check />
      Save Changes
    </button>
  );
}
```

## Available Icons

- **Check** — Checkmark icon
- **Error** — X in a circle (error indicator)
- **Warning** — Triangle with exclamation point
- **Plus** — Plus/add icon
- **X** — Close/exit icon
- **HamburgerMenu** — Three horizontal lines
- **ChevronDown, ChevronUp, ChevronLeft, ChevronRight** — Directional chevron icons
- **Spinner** — Animated loading indicator

## Sizing

Icons support five size options via the `size` prop. The default size is `Medium` (1.25em).

```tsx
import { Icons, IconSize } from "@outoforbitdev/ood-react";

<Icons.Check size={IconSize.ExtraSmall} />  {/* 0.75em */}
<Icons.Check size={IconSize.Small} />       {/* 1em */}
<Icons.Check size={IconSize.Medium} />      {/* 1.25em (default) */}
<Icons.Check size={IconSize.Large} />       {/* 1.5em */}
<Icons.Check size={IconSize.ExtraLarge} />  {/* 2em */}
```

Icons scale with `em` units, so they automatically size relative to the text around them. To override sizing, use CSS:

```tsx
<Icons.Check style={{ height: "24px", width: "24px" }} />
```

## Appearance Variations

### Default

The icon appears in the text color (default).

```tsx
<Icons.Check />
```

### Bordered

Adds a rounded border around the icon. Useful for emphasized or standalone icons.

```tsx
<Icons.Check bordered />
```

### Inverted

Swaps the icon and background colors. The background becomes text color, and the icon becomes background color. Useful for creating high-contrast buttons or badges.

```tsx
<Icons.Check inverted />
```

### Bordered + Inverted

Combines both effects. The border and icon use the background color, creating a distinct visual treatment.

```tsx
<Icons.Check bordered inverted />
```

## Accessibility

### Icons in Buttons (Recommended)

When an icon is inside a button or link, the parent element should provide the accessible name:

```tsx
{
  /* Good: Button provides accessible context */
}
<button aria-label="Close menu">
  <Icons.X />
</button>;

{
  /* Good: Text label provides context */
}
<button>
  <Icons.Check />
  Save
</button>;
```

### Standalone Icons with Meaning

When an icon conveys meaning outside of an interactive context (e.g., validation feedback, status indicator), use the `aria-label` prop:

```tsx
{
  /* Error icon indicating invalid field */
}
<Icons.Error aria-label="This field is required" />;

{
  /* Status indicator */
}
<Icons.Warning aria-label="This action is irreversible" />;
```

### Decorative Icons

Mark purely decorative icons with `aria-hidden`:

```tsx
{
  /* Decorative separator */
}
<Icons.Plus aria-hidden />;
```

### Tooltip

Use the `title` prop to add a browser tooltip:

```tsx
<Icons.Warning title="This action cannot be undone" />
```

## Common Patterns

### Icon Button

Combine icons with buttons for common actions:

```tsx
<button aria-label="Delete item">
  <Icons.Error />
</button>
```

### Status Badge

Use inverted icons to create status indicators:

```tsx
<div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
  <Icons.Check inverted aria-label="Completed" />
  <span>Order placed</span>
</div>
```

### Expandable Content

Use chevrons to indicate expandable sections (the Expandable component handles this automatically):

```tsx
<button>
  {expanded ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
  Show details
</button>
```

### Loading State

The Spinner animates continuously. It respects `prefers-reduced-motion` for users who prefer reduced animations:

```tsx
<div>
  <Icons.Spinner size={IconSize.Small} />
  Loading...
</div>
```

## Color Inheritance

Icons inherit color from their context via CSS `currentColor`. This means they automatically match the text color of their parent:

```tsx
{
  /* Icon is red */
}
<div style={{ color: "red" }}>
  <Icons.Check />
</div>;

{
  /* Icon uses theme text color */
}
<div className="ood-primary">
  <Icons.Check />
</div>;
```

## Theme Integration

Icons work seamlessly with the design system's theme system. In inverted mode, the background color comes from the theme's `--ood-background` CSS variable, ensuring proper contrast across themes.

```tsx
{
  /* In light theme: dark icon on light background */
}
{
  /* In dark theme: light icon on dark background */
}
<Icons.Check inverted />;
```

## Type Safety

All icons are TypeScript components. The `IconSize` enum provides type-safe size options:

```tsx
import { Icons, IconSize } from "@outoforbitdev/ood-react";

// ✓ TypeScript knows IconSize.Small is valid
const icon = <Icons.Check size={IconSize.Small} />;

// ✗ TypeScript error: "medium" is not a valid size
const invalid = <Icons.Check size="medium" />;
```

## Visual Examples

For interactive examples and to see all icons in different states, visit the Storybook documentation:

- **Icons > AllDefault** — All icons in default appearance
- **Icons > AllBordered** — All icons with borders
- **Icons > AllInverted** — All icons inverted
- **Icons > Sizes** — Size options (XS through XL)
- Individual icon stories for detailed examples of each icon
