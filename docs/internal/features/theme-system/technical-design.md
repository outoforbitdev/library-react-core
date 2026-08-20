# Technical Design: Theme System

## Architecture Overview

The theme system consists of three main layers:

1. **Configuration Layer** (`themes.json`) - Theme definitions and color swatches
2. **Generation Layer** - TypeScript scripts that generate CSS and validate themes
3. **Runtime Layer** (`themes.css`) - Generated CSS variables and class definitions

## Color Ramp Generation

### Strategy: Swatch-Based Generation

Instead of hardcoding all 9 color steps, we start with a vibrant 500-value swatch and generate the gradient:

- **Light steps (100-400)**: Move 25% toward white with each step
- **Dark steps (600-900)**: Move 25% toward black with each step
- **Middle step (500)**: The original swatch

### Algorithm

```
For light steps (100-400):
  new_value = current_value + (white - current_value) * 0.25

For dark steps (600-900):
  new_value = current_value - (current_value - black) * 0.25
```

This approach ensures:

- Vibrant mid-tone colors (not washed out)
- Smooth, predictable gradients
- Consistent contrast at each level

## CSS Variable Organization

### Naming Convention

All CSS variables use slug format (kebab-case):

```
--ood-{component}-{property}
--ood-primary-text
--ood-primary-background
--ood-primary-shade
--ood-primary-link
--ood-primary-link-visited
```

### Component Types

**Background Components** (primary, secondary, accent-block, error-block, warning-block, submission-block):

- `text` - Primary text color
- `background` - Component background
- `shade` - Hover/active state background
- `link` - Link text color
- `link-visited` - Visited link color

**Accent Components** (accent):

- `text` - Accent text color

**Status Components** (error, warning, submission - for use outside blocks):

- `text` - Status text color

## Theme Cascade

CSS variables cascade through multiple layers:

```css
/* 1. Light defaults (base) */
:root {
  --ood-primary-text: var(--ood-gray-900);
  --ood-primary-background: var(--ood-gray-100);
  /* ... */
}

/* 2. Dark theme override (via media query) */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    --ood-primary-text: var(--ood-gray-100);
    --ood-primary-background: var(--ood-gray-900);
    /* ... */
  }
}

/* 3. Explicit theme override (via data-theme) */
[data-theme="dark"] {
  --ood-primary-text: var(--ood-gray-100);
  --ood-primary-background: var(--ood-gray-900);
  /* ... */
}
```

This cascade ensures:

- System preference respected by default
- Explicit data-theme overrides user/media query
- Works with Storybook theme switching

## Contrast Validation

### Validation Approach

Each component is validated against all possible text/background pairs:

**Pairs validated per component:**

1. `{component}-text` vs `{component}-background`
2. `{component}-text` vs `{component}-shade`
3. `{component}-link` vs `{component}-background`
4. `{component}-link` vs `{component}-shade`
5. `{component}-link-visited` vs `{component}-background`
6. `{component}-link-visited` vs `{component}-shade`
7. Status text (error, warning, submission) vs background and shade

### Contrast Requirements

- **Text colors**: 7:1 ratio (WCAG AAA)
- **Link colors**: 4.5:1 ratio (WCAG AA)
- **Stock colors**: Informational only (no validation failure)

### Validation Failure Behavior

If a theme fails contrast validation:

1. Build process reports which pairs failed
2. Generate CSS anyway (for debugging)
3. Exit with error status (fails CI)

## Implementation Details

### Key Files

- `scripts/themes/colors.ts` - RGB color utilities, contrast calculation
- `scripts/themes/ramps.ts` - Color ramp generation from swatches
- `scripts/themes/types.ts` - TypeScript type definitions
- `scripts/themes/css.ts` - CSS generation logic
- `scripts/themes/validation.ts` - Contrast validation
- `scripts/themes/utils.ts` - Shared utilities
- `scripts/themes/themes.json` - Theme configuration

### Configuration Structure

```json
{
  "light": {
    "accessibility-level": "AAA",
    "primary": {
      "text": "gray-900",
      "background": "gray-100",
      "shade": "gray-200",
      "link": "blue-600",
      "link-visited": "purple-600"
    },
    "stock": {
      "red": "red-500",
      "blue": "blue-500",
      "green": "green-400"
    }
  },
  "dark": {/* ... */},
  "default-light-theme": "light",
  "default-dark-theme": "dark"
}
```

## Type Safety

The system uses TypeScript to ensure:

- Theme definitions match expected structure
- All required properties are present
- No typos in component names or properties
- Swatch references are valid

Key types:

- `Theme` - Complete theme definition
- `BackgroundComponent` - Component with text, background, shade, links
- `RampStep` - Valid color step values (100-900)
- `TextColorPair` - Text color and validation label
- `ContrastPair` - Validated color pair with ratio information

## Build Integration

### npm Scripts

```json
{
  "validate-themes": "tsx scripts/themes/validate.ts",
  "build": "npm run validate-themes && rollup -c"
}
```

The validate script:

1. Loads theme definitions from `themes.json`
2. Generates color ramps from swatches
3. Validates all contrast pairs
4. Generates `src/styles/themes.css`
5. Reports validation results
6. Exits with error if validation fails

## Storybook Integration

Theme switching in Storybook uses `data-theme` attributes:

```jsx
export const Dark: Story = {
  decorators: [(story) => (
    <div data-theme="dark">
      {story()}
    </div>
  )],
};
```

This allows stories to demonstrate themes without affecting the rest of the Storybook UI.
