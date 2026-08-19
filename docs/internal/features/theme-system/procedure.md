# Procedure: Theme System Usage and Extension

This guide covers how to use the theme system, validate themes, and extend it with new components or colors.

## Table of Contents

1. [Adding New Colors](#adding-new-colors)
2. [Adding New Component Types](#adding-new-component-types)
3. [Modifying Theme Values](#modifying-theme-values)
4. [Validating Themes](#validating-themes)
5. [Generating CSS](#generating-css)
6. [Using Themes in Components](#using-themes-in-components)
7. [Theme Switching](#theme-switching)

## Adding New Colors

### Step 1: Generate Swatch Value

First, decide on a vibrant 500-value color. This will be the base for gradient generation.

Example: `#0064C8` for blue

### Step 2: Add to ramps.json

Edit `scripts/themes/ramps.json` and add your color:

```json
{
  "gray": { "500": "#6c6c6c" },
  "blue": { "500": "#0064C8" },
  "new-color": { "500": "#YOUR_HEX_VALUE" }
}
```

### Step 3: Update themes.json

Add the color to the `stock` section of each theme:

```json
{
  "light": {
    "stock": {
      "new-color": "new-color-500"
    }
  },
  "dark": {
    "stock": {
      "new-color": "new-color-500"
    }
  }
}
```

### Step 4: Validate and Generate

Run the validation script to generate color ramps and CSS:

```bash
npm run validate-themes
```

The system will:

1. Generate the full 9-step ramp from the 500 value
2. Create CSS variables `--ood-new-color-100` through `--ood-new-color-900`
3. Validate stock colors (informational)

## Adding New Component Types

### Step 1: Define the Component Type in types.ts

Add a new interface if needed:

```typescript
export interface StatusBlockComponent {
  text: string;
  ["block-text"]: string;
  ["block-background"]: string;
  ["block-shade"]: string;
}
```

Or use existing `BackgroundComponent` for components with the full set of properties.

### Step 2: Add to Theme Interface

Update `scripts/themes/types.ts`:

```typescript
export interface Theme {
  ["accessibility-level"]: AccessibilityLevel;
  primary: BackgroundComponent;
  secondary: BackgroundComponent;
  "new-component": BackgroundComponent; // Add here
  // ...
}
```

### Step 3: Define Values in themes.json

Add the component to each theme variant:

```json
{
  "light": {
    "new-component": {
      "text": "gray-900",
      "background": "gray-100",
      "shade": "gray-200",
      "link": "blue-600",
      "link-visited": "purple-600"
    }
  },
  "dark": {
    "new-component": {
      "text": "gray-100",
      "background": "gray-900",
      "shade": "gray-800",
      "link": "blue-100",
      "link-visited": "purple-100"
    }
  }
}
```

### Step 4: Add Validation

Update `scripts/themes/validation.ts` in the `validateTheme` function:

```typescript
validateBackgroundComponent(
  report,
  "new-component",
  theme["new-component"],
  theme.error.text,
  theme.warning.text,
  theme.submission.text,
  ramps,
  requiredRatio,
);
```

### Step 5: Add CSS Classes

Update `scripts/themes/css.ts` in `generateUtilityClasses()`:

```typescript
.ood-new-component {
  --ood-text: var(--ood-new-component-text);
  --ood-background: var(--ood-new-component-background);
  --ood-shade: var(--ood-new-component-shade);
  --ood-link: var(--ood-new-component-link);
  --ood-link-visited: var(--ood-new-component-link-visited);
}
```

### Step 6: Validate and Generate

```bash
npm run validate-themes
```

Verify no contrast errors and CSS is generated correctly.

## Modifying Theme Values

### 1. Edit themes.json

Change color values directly:

```json
{
  "light": {
    "primary": {
      "text": "gray-900", // Old: gray-900
      "text": "gray-800", // New: gray-800
      "background": "gray-100"
    }
  }
}
```

### 2. Validate

Run validation to check contrast:

```bash
npm run validate-themes
```

If validation fails, you'll see which pairs fall below 7:1 (text) or 4.5:1 (links).

### 3. Iterate

Adjust colors until all pairs pass validation.

## Validating Themes

### Manual Validation

Run the validation script:

```bash
npm run validate-themes
```

Output shows:

- ✓ Loaded X theme(s)
- ✓ Ramps loaded and generated
- Validation results per theme
- ✓ Generated themes.css
- ✗ Validation failed (if any pairs fall below required ratio)

### CI Integration

Validation is part of the build process:

```bash
npm run build
```

The build fails if any theme doesn't pass validation.

### Reading Validation Reports

The validation script generates `scripts/themes/validation-report.json` with detailed information:

```json
{
  "timestamp": "2026-08-17T...",
  "summary": {
    "totalThemes": 2,
    "passedThemes": 2,
    "failedThemes": 0,
    "overallStatus": "pass"
  },
  "themes": {
    "light": {
      "name": "light",
      "status": "pass",
      "errors": [],
      "contrastPairs": [
        {
          "label": "primary-text vs primary-background",
          "foreground": "gray-900",
          "background": "gray-100",
          "contrastRatio": 18.5,
          "requiredRatio": 7.0,
          "passes": true
        }
      ]
    }
  }
}
```

## Generating CSS

### Manual Generation

The validation script automatically generates CSS:

```bash
npm run validate-themes
```

This creates `src/styles/themes.css` with:

- Color swatch variables
- Light theme defaults
- Dark theme media query
- Explicit theme overrides
- Utility classes

### Customizing Generation

Edit `scripts/themes/css.ts` to modify:

- CSS variable naming
- Utility class definitions
- Media query structure
- CSS output structure

## Using Themes in Components

### Apply Theme Classes

Wrap your components with the appropriate class:

```jsx
<div className="ood-primary">
  <Button>Primary Button</Button>
</div>

<div className="ood-secondary">
  <Button>Secondary Button</Button>
</div>

<div className="ood-accent-block">
  <h1>Accent Block Heading</h1>
</div>
```

### Access Theme Variables in CSS

Use CSS variables for custom styling:

```css
.my-component {
  color: var(--ood-primary-text);
  background: var(--ood-primary-background);
  border-color: var(--ood-primary-shade);
}

.my-link {
  color: var(--ood-primary-link);
}

.my-link:visited {
  color: var(--ood-primary-link-visited);
}
```

### Component Example

```jsx
import styles from "./MyComponent.module.css";

export function MyComponent() {
  return (
    <div className={styles.container}>
      <p>This text inherits color from its parent's theme class</p>
      <a href="#">This link uses the theme's link color</a>
    </div>
  );
}
```

In the CSS module:

```css
.container {
  color: var(--ood-text);
  background: var(--ood-background);
}

a {
  color: var(--ood-link);
}

a:visited {
  color: var(--ood-link-visited);
}
```

## Theme Switching

### System Preference (Default)

The browser's color scheme preference automatically applies:

```css
/* Light theme by default */
:root {
  --ood-primary-text: var(--ood-gray-900);
}

/* Dark theme if user prefers dark */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    --ood-primary-text: var(--ood-gray-100);
  }
}
```

### Explicit Theme Override

Set `data-theme` on any element to override the system preference:

```jsx
// Switch to dark theme
<div data-theme="dark">
  <YourApp />
</div>

// Switch to light theme
<div data-theme="light">
  <YourApp />
</div>
```

### Storybook Theme Switching

In Storybook stories, use decorators:

```jsx
export const DarkTheme: Story = {
  decorators: [(story) => (
    <div data-theme="dark">
      {story()}
    </div>
  )],
};
```

## Troubleshooting

### Validation Fails: Contrast Too Low

**Problem**: A color pair falls below the required ratio.

**Solution**:

1. Check which pair fails in the validation output
2. Either darken the text color or lighten the background
3. Use the next step in the generated ramp (100-900 scale)
4. Re-validate and iterate

### Colors Not Appearing in CSS

**Problem**: A color variable doesn't exist in generated CSS.

**Possible causes**:

1. Typo in `themes.json` color reference
2. Color not defined in `ramps.json`
3. Generation script didn't run

**Solution**:

1. Check spelling in `themes.json`
2. Add missing color to `ramps.json` (500 value)
3. Run `npm run validate-themes` again

### Theme Not Switching in Storybook

**Problem**: Setting `data-theme` doesn't change colors.

**Solution**:

1. Ensure themes.css is loaded
2. Check that the selector matches exactly (e.g., `[data-theme="dark"]`)
3. Verify CSS specificity isn't being overridden
4. Reload the browser (CSS may be cached)

## Best Practices

1. **Always validate before merging** - Run `npm run validate-themes` before committing theme changes
2. **Use ramps for gradation** - Don't hardcode all 9 steps; let the system generate them
3. **Consistent naming** - Use slug format (kebab-case) for all new variables and properties
4. **Component-based styling** - Apply theme classes to parent containers, not individual elements
5. **Test both themes** - Manually verify both light and dark themes before shipping
6. **Document changes** - Update this procedure if you add new component types or validation rules
