# Icon Library Architecture

This document describes the design, implementation, and conventions for managing SVG-based icon components in `@outoforbitdev/ood-react`. The icon system prioritizes styling flexibility, theming support, and accessibility while maintaining a lightweight bundle footprint.

## Overview

The icon library uses **SVG-based inline React components** rather than font icons or image assets. This approach provides several key benefits:

- **Styling Control** — Icons inherit color from CSS classes and inline styles using `currentColor`. Backgrounds, borders, and transforms can be applied via CSS without asset duplication.
- **Theming** — Icons automatically adapt to light and dark themes by inheriting the text color from their context.
- **No HTTP Requests** — SVG markup is bundled directly with the library, eliminating extra network requests and reducing latency.
- **Accessibility** — SVG content can be annotated with semantic titles, ARIA labels, and roles for screen reader users.
- **Runtime Flexibility** — Props enable dynamic sizing, color inversion, and interactive states without generating multiple asset variants.

## Icon as a Component

Each icon is a self-contained React component that wraps SVG markup inside a reusable `Icon` component. Icons are treated as first-class components with props for customization.

### IIconProps Interface

```typescript
export interface IIconProps extends IChildlessComponentProps {
  clickable?: boolean;
  invert?: boolean;
  size?: IconSize;
}

export enum IconSize {
  Small = 10,   // 0.75em — inline/badge contexts
  Medium = 15,  // 1em    — standard default
  Large = 20,   // 1.5em  — prominent display
}
```

The `IChildlessComponentProps` base includes standard DOM props:
- `className?: string` — Additional CSS classes
- `id?: string` — DOM element ID
- `onClick?: MouseEventHandler` — Click handler for interactive icons
- `style?: CSSProperties` — Inline styles for size and color overrides

### Icon Component

The `Icon` component is a low-level wrapper that renders the SVG container. Individual icon components (e.g., `ArrowDown`, `HamburgerMenu`) pass their SVG paths and shapes to this component:

```typescript
interface IIconInternalProps extends IComponentProps {
  externalProps: IIconProps;
  preventInvert?: boolean;
  viewBoxSize: number;
}

export function Icon(props: IIconInternalProps) {
  const sizeClass = getClassFromSize(props.externalProps.size);
  const foregroundColor = "currentColor";
  
  return (
    <svg
      stroke={foregroundColor}
      fill={foregroundColor}
      viewBox={`0 0 ${props.viewBoxSize} ${props.viewBoxSize}`}
      strokeWidth={10}
      {...getDomProps(
        props.externalProps,
        sizeClass,
        props.externalProps.clickable ? styles.clickable : undefined,
      )}
    >
      {props.children}
    </svg>
  );
}
```

The component:
1. Sets `stroke` and `fill` to `currentColor` to inherit from surrounding text color
2. Accepts a `viewBoxSize` (typically 100) for consistent scaling
3. Applies size classes based on the `size` prop
4. Supports color inversion via a mask-based technique when `invert={true}`
5. Adds hover/active states when `clickable={true}`

## Icon Storage and Organization

All icon components are stored in `src/components/icons/` with individual `.tsx` files per icon. Icons are organized by purpose and alphabetically within that folder.

### Current Icon Set

- **Navigation** — `ArrowUp`, `ArrowDown`, `DoubleArrowUp`, `DoubleArrowDown` — Used in pagination, sort controls, and expandable sections
- **Menu** — `HamburgerMenu` — Mobile navigation trigger
- **Utilities** — `X` — Close buttons, modal dismissal, tag removal

### Icon Example: ArrowDown

```typescript
// src/components/icons/ArrowDown.tsx
import { Icon, IIconProps } from "./Icon";

export function ArrowDown(props: IIconProps) {
  return (
    <Icon externalProps={props} viewBoxSize={100}>
      <g>
        <polyline points="20,35 50,65, 80,35" fill="none" />
      </g>
    </Icon>
  );
}
```

The polyline draws a downward-pointing arrow within a 100×100 viewBox. The path uses relative coordinates (20–80 range) to center within the viewBox, leaving padding for visual breathing room.

### Icon Example: HamburgerMenu

```typescript
// src/components/icons/HamburgerMenu.tsx
import { Icon, IIconProps } from "./Icon";

export function HamburgerMenu(props: IIconProps) {
  return (
    <Icon externalProps={props} viewBoxSize={100}>
      <g>
        <line x1="20" x2="80" y1="20" y2="20" />
        <line x1="20" x2="80" y1="50" y2="50" />
        <line x1="20" x2="80" y1="80" y2="80" />
      </g>
    </Icon>
  );
}
```

Three horizontal lines at y=20, y=50, and y=80 create the hamburger menu icon. The lines span from x=20 to x=80, providing visual consistency with other icons.

## Styling Icons

Icons inherit styling from their context and can be customized through CSS and props.

### Color Inheritance

Icons use `currentColor` for both stroke and fill, allowing them to inherit the text color of their container:

```tsx
// Icon inherits dark gray from the button text
<button style={{ color: "#333" }}>
  <ArrowDown />
</button>

// Icon inherits blue from CSS class
<span className="text-blue-600">
  <X />
</span>
```

### Size Control via Props

The `IconSize` enum provides three standard sizes that map to CSS classes:

```css
/* src/components/icons/icon.module.css */
.small {
  height: 0.75em;
  width: 0.75em;
}

.medium {
  height: 1em;
  width: 1em;
}

.large {
  height: 1.5em;
  width: 1.5em;
}
```

Sizes are relative to the font size of their parent (`em` units), enabling responsive scaling:

```tsx
// Uses medium size (1em — default)
<ArrowDown />

// Uses large size (1.5em)
<ArrowDown size={IconSize.Large} />

// Override with inline style (e.g., for 32px at 16px base font)
<ArrowDown style={{ width: "32px", height: "32px" }} />
```

### Mobile Responsiveness

Clickable icons increase in size on small screens to meet touch target guidelines:

```css
@media (max-width: 768px) {
  .clickable.small {
    height: 1em;
    width: 1em;
  }
  .clickable.medium {
    height: 1.5em;
    width: 1.5em;
  }
  .clickable.large {
    height: 2em;
    width: 2em;
  }
}
```

### Usage Examples

```tsx
import { ArrowDown, IconSize } from "@outoforbitdev/ood-react";

// Standard size with theme color
<ArrowDown className="text-theme-primary" />

// Large size for prominent display
<ArrowDown size={IconSize.Large} className="text-theme-success" />

// Small size for badges
<ArrowDown size={IconSize.Small} className="text-theme-muted" />

// Clickable with custom color
<ArrowDown clickable={true} onClick={handleSort} style={{ color: "#0066cc" }} />

// Inverted (white icon on colored background)
<ArrowDown invert={true} className="bg-theme-primary" />
```

## Accessibility

Icons must be accessible to screen reader users. Decorative icons should be hidden from assistive technology, while semantic icons should communicate their purpose.

### Semantic Icons in Buttons

When an icon is the only content of a button, provide an accessible label:

```tsx
// ❌ Bad: No accessible label
<button>
  <X />
</button>

// ✅ Good: Use aria-label
<button aria-label="Close dialog">
  <X />
</button>

// ✅ Good: Use title for tooltip
<button title="Close">
  <X />
</button>
```

### Decorative Icons

When an icon is purely decorative (e.g., next to text that already conveys meaning), hide it from screen readers:

```tsx
// ✅ Good: Icon hidden from AT
<button>
  <ArrowDown aria-hidden="true" /> Sort by Date
</button>

// Alternative: Use role="presentation"
<span role="presentation">
  <ArrowDown />
</span>
```

### Icon with Descriptive Text

When text accompanies the icon, the text provides the meaning:

```tsx
<div className="flex items-center gap-2">
  <ArrowDown />
  <span>Downloads in progress</span>
</div>
```

### Future: title and aria-label Props

Future enhancements may add `title` and `aria-label` props to the `IIconProps` interface:

```typescript
// Proposed future enhancement
export interface IIconProps extends IChildlessComponentProps {
  clickable?: boolean;
  invert?: boolean;
  size?: IconSize;
  title?: string;        // Tooltip and semantic title
  ariaLabel?: string;    // Screen reader label
  ariaHidden?: boolean;  // Hide from assistive tech
}
```

## Adding New Icons

Follow this process to add a new icon to the library:

### Step 1: Obtain SVG Code

Obtain the SVG markup from a designer or icon library. For example, an X icon from [Feather Icons](https://feathericons.com/):

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" 
     fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <line x1="18" y1="6" x2="6" y2="18"></line>
  <line x1="6" y1="6" x2="18" y2="18"></line>
</svg>
```

### Step 2: Normalize to Component

Convert the SVG to a React component with a 100×100 viewBox for consistency. Adjust coordinates proportionally:

```typescript
// Original: 24×24 viewBox, lines from 6–18
// Normalized: 100×100 viewBox, lines from 25–75 (same proportions)

import { Icon, IIconProps } from "./Icon";

export function X(props: IIconProps) {
  return (
    <Icon externalProps={props} viewBoxSize={100}>
      <g>
        <line x1="25" y1="25" x2="75" y2="75" />
        <line x1="75" y1="25" x2="25" y2="75" />
      </g>
    </Icon>
  );
}
```

Conversion formula: `newCoord = (oldCoord / oldViewBoxSize) × 100`

### Step 3: Add to Export Index

Update `src/components/icons/index.ts` to export the new icon:

```typescript
export { ArrowDown } from "./ArrowDown";
export { ArrowUp } from "./ArrowUp";
export { DoubleArrowDown } from "./DoubleArrowDown";
export { DoubleArrowUp } from "./DoubleArrowUp";
export { HamburgerMenu } from "./HamburgerMenu";
export { X } from "./X";
// Add new icon below
export { Settings } from "./Settings";
```

### Step 4: Test in Storybook

Create a story to document the new icon and test it visually:

```typescript
// src/stories/icons/Settings.stories.tsx
import { Settings } from "../../components/icons";
import { IconSize } from "../../components/icons";

export default {
  title: "Icons/Settings",
  component: Settings,
};

export const Default = () => <Settings />;
export const Large = () => <Settings size={IconSize.Large} />;
export const Small = () => <Settings size={IconSize.Small} />;
export const CustomColor = () => <Settings style={{ color: "#0066cc" }} />;
export const Clickable = () => (
  <Settings clickable={true} onClick={() => alert("Clicked")} />
);
export const Inverted = () => (
  <div style={{ backgroundColor: "#0066cc", padding: "8px", display: "inline-block" }}>
    <Settings invert={true} />
  </div>
);
```

Run Storybook (`npm run storybook`) and verify the icon renders correctly at all sizes and with theme colors.

## Size Conventions

The library follows standard icon sizes for consistent spacing and readability:

- **Small (10)** — `0.75em` — Inline badges, secondary indicators, compact UI
- **Medium (15)** — `1em` — Default, standard buttons, navigation items (recommended default)
- **Large (20)** — `1.5em` — Prominent actions, hero sections, large buttons

These sizes map to actual pixel dimensions based on the font size of the parent element. At a standard 16px base font:

- Small = 12px (0.75 × 16)
- Medium = 16px (1 × 16)
- Large = 24px (1.5 × 16)

On mobile (max-width: 768px), clickable icons increase by 1.5× to meet the 48px touch target guideline.

## Icon Naming Convention

All icon names follow consistent patterns for discoverability and clarity:

- **Lowercase** — `arrow-down` not `ArrowDown` in file names; component exports use PascalCase (`ArrowDown`)
- **Descriptive** — Use specific names that indicate purpose: `settings`, `download`, `upload`, `trash`, `search`, `share`
- **Avoid Generic Terms** — Do not use vague names like `icon`, `symbol`, `glyph`, or `action`
- **Compound Names** — Use compound words for direction or state: `arrow-up`, `arrow-down`, `double-arrow-up`, `chevron-left`, `menu-open`, `menu-close`

### Naming Examples

✅ **Good**
- `settings` — Clearly represents a settings/configuration action
- `download` — Obvious purpose
- `arrow-down` — Specific direction indicator
- `hamburger-menu` — Clear semantic name
- `share` — Obvious social/sharing action

❌ **Poor**
- `icon` — Too generic; doesn't describe the icon
- `arrow` — Ambiguous; which direction?
- `menu` — Unclear if it's a menu button or menu content
- `action` — Vague; what action?
- `symbol` — Not descriptive

## Future Enhancements

### Icon Sprite Optimization

As the icon library grows, consider bundling icons into an SVG sprite sheet to reduce bundle size. This would allow loading multiple icons from a single HTTP request and reduce overall page weight.

```tsx
// Future: Icon sprite approach
<svg>
  <use href="/icons-sprite.svg#arrow-down" />
</svg>
```

### Search and Discovery

Add a searchable icon gallery in Storybook that indexes all available icons by name, purpose, and tags. This allows developers to quickly find and reference icons.

### Icon Variants

Support icon variants for different styles:
- **Outline** — Stroked design for lighter appearance
- **Filled** — Solid filled design for emphasis
- **Duo-tone** — Two-color icons for richer visual hierarchy

```tsx
// Future API
<ArrowDown variant="outline" />
<ArrowDown variant="filled" />
<ArrowDown variant="duo-tone" />
```

### Font Fallback

In rare cases where SVG rendering is problematic, provide a fallback to a web font. This ensures icons render correctly even if SVG support is limited:

```tsx
// Future: Graceful degradation
<ArrowDown useFont={true} /> // Falls back to font-icon if needed
```

### Semantic Icon Props

Extend `IIconProps` with standard accessibility props:

```typescript
// Proposed future interface
export interface IIconProps extends IChildlessComponentProps {
  clickable?: boolean;
  invert?: boolean;
  size?: IconSize;
  title?: string;        // Tooltip and semantic meaning
  ariaLabel?: string;    // Screen reader label
  ariaHidden?: boolean;  // Hide from assistive technology
  role?: string;         // Custom ARIA role
}
```

## Testing and Validation

Icons should be tested for:

1. **Visual Consistency** — All icons maintain consistent line weight, padding, and alignment at all sizes
2. **Color Inheritance** — Icons properly inherit `currentColor` from their context
3. **Accessibility** — Proper use of `aria-hidden`, `title`, and `role` attributes
4. **Performance** — Minimal SVG markup size; no unnecessary paths or groups
5. **Responsive Behavior** — Clickable icons meet 48px touch targets on mobile

Validation occurs through Storybook visual regression testing and manual review during code review.
