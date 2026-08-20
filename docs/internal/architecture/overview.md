# Architecture Overview

This document describes the technical architecture of the `@outoforbitdev/ood-react` component library, covering design principles, build strategy, and key architectural decisions.

## High-Level Design

The library is structured as three distinct layers:

1. **Component Layer** — React components in `src/components/` that implement the user interface. Components are self-contained, composable, and designed to be used across multiple applications.
2. **Styling Layer** — CSS Modules and utility classes in `src/styles/` that provide component styling. This layer abstracts style concerns from component logic.
3. **Theme Layer** — CSS variables (in `src/styles/themes.css`) that define the visual language (colors, spacing, typography). The theme system is built on a cascade of CSS variables with support for light/dark modes. For detailed theme architecture and color ramp generation, see [Theme System](../features/theme-system/).

These layers are designed to be loosely coupled, allowing styling and theming decisions to evolve independently from component implementation.

## Bundling and Distribution

The library uses Rollup to build three distribution formats from the `src/` directory:

- **CommonJS** (`dist/cjs/index.js`) — For Node.js environments and legacy bundlers
- **ES Modules** (`dist/esm/index.js`) — For modern JavaScript and tree-shaking
- **TypeScript Declarations** (`dist/types.d.ts`) — Complete type definitions for all public APIs

Only the `src/` directory is bundled; stories, scripts, and configuration files are excluded. The build process includes minification and source maps for debugging. React and React-DOM are marked as external dependencies and not bundled.

## Storybook Role

Storybook serves three distinct purposes:

1. **Component Showcase** — Interactive documentation that demonstrates each component's variants and usage patterns
2. **Testing Platform** — Automated testing environment for visual regression testing, accessibility validation (a11y), and interaction testing
3. **Documentation** — Living documentation that keeps component examples in sync with actual implementations

Stories are co-located with components in `src/stories/` and use the `.stories.tsx` convention. Storybook is configured with theme switching support via `data-theme` attributes, allowing stories to preview components in both light and dark modes.

## Dependency Strategy

The library maintains strict separation between runtime and development dependencies:

- **Runtime Dependencies** — Only React and React-DOM (as peer dependencies). No additional runtime libraries are included to keep the bundle minimal.
- **Development Dependencies** — Rollup, TypeScript, Storybook, Prettier, and related build tools are dev-only. Any new runtime dependency must be justified and discussed with maintainers before addition.

This strategy ensures the library remains lightweight and doesn't impose unnecessary dependencies on consuming applications.

## Folder Structure

```
src/
  ├── components/      # React components (.tsx files)
  ├── styles/         # CSS Modules and theme definitions
  ├── stories/        # Storybook stories and documentation
  └── lib/            # Shared utilities and helpers
dist/                # Build output (gitignored)
  ├── cjs/            # CommonJS bundle
  ├── esm/            # ES Module bundle
  └── types.d.ts      # TypeScript declarations
docs/
  └── internal/       # Developer documentation (this file)
.storybook/          # Storybook configuration
```

## Type Safety

The library enforces TypeScript strict mode (`strict: true` in `tsconfig.json`). All public APIs have explicit type definitions through TypeScript interfaces and type exports. The use of `any` is prohibited; all types must be explicitly declared. The build process generates `.d.ts` files for all components and utilities, ensuring consumers have full type information.

## Testing Strategy

Testing is primarily driven through Storybook:

- **Visual Regression Testing** — Automated visual testing against baseline screenshots to catch unintended style changes
- **Accessibility Testing** — Automated a11y checks to ensure components meet WCAG standards
- **Interaction Testing** — Storybook Play functions test component behavior and state changes

The `test` script in `package.json` runs theme validation (`npm run validate-themes`), which is the primary pre-build check. Additional automated testing via Storybook test addons can be integrated as the library grows.

## Performance Considerations

- **Bundle Size** — Monitored and optimized through Rollup configuration (minification, tree-shaking, terser plugin)
- **CSS Strategy** — CSS Modules are preferred over CSS-in-JS to keep styling out of the JavaScript bundle
- **Native Features** — CSS variables and modern CSS features are leveraged instead of JavaScript-based solutions (e.g., theme switching uses CSS variables, not runtime JS)

The library targets ES5 for browser compatibility while using modern JavaScript features during development.

## Versioning

The library follows Semantic Versioning (Major.Minor.Patch):

- **Major** — Breaking API changes (component prop changes, removed exports, CSS variable removals)
- **Minor** — New features and non-breaking enhancements (new components, new props, new theme variables)
- **Patch** — Bug fixes and maintenance updates (style fixes, accessibility improvements)

Release notes should clearly indicate which changes are breaking, features, or fixes.
