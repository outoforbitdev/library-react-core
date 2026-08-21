# Feature: Theme System

The theme system provides a comprehensive, accessible, and maintainable approach to styling components across the library. It implements WCAG AAA contrast validation, vibrant color ramps, and flexible theming capabilities.

## Overview

The theme system enables:

- **Multiple themes** - Light and dark theme variants with automatic cascade
- **WCAG AAA compliance** - Automatic validation of contrast ratios (7:1 for text, 4.5:1 for links)
- **Vibrant colors** - Swatch-based color ramp generation with 9-step gradients
- **Flexible styling** - CSS variables with proper cascade for theme switching
- **Easy extension** - Add new component types, colors, or validation rules

## Documents

- [Product Requirements](./product-requirements.md) - What the theme system provides and its goals
- [Technical Design](./technical-design.md) - How the system works internally
- [Procedure](./procedure.md) - How to use, extend, and maintain the theme system
- [Theme System Architecture](../../architecture/theme-system.md) - The architectural view for maintainers: CSS variable cascade, the two-layer ramp/theme model, and **the ramp cascade constraint** (why editing a color ramp affects every theme at once, and how to change ramps safely)
