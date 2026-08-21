# Constraints

This document lists the hard constraints that govern development on `@outoforbitdev/ood-react`. Unlike the [Component Requirements](./component-requirements.md), which describe what a component must do, these are boundaries on how the library is built — dependencies it may use, technical choices it must follow, and conventions it must not deviate from. These constraints derive directly from the [Core Principles](../product/principles.md) and the [Architecture Overview](../architecture/overview.md); where this document and those diverge, treat it as a documentation gap to be resolved, not a license to bypass the constraint.

## Dependency Constraints

- **No runtime dependencies except React.** React and React-DOM (as peer dependencies) are the only runtime dependencies the library may ship. No other package may appear in `dependencies` in `package.json`.
- **Justification required for any new runtime dependency.** A proposed runtime dependency must be explicitly justified in the pull request description: what problem it solves, why it cannot reasonably be solved with native browser or React APIs, and what its maintenance and security track record looks like. Justification is necessary but not sufficient — maintainers may still decline the dependency.
- **Security review before addition.** Any new runtime dependency undergoes a security review (checking maintenance activity, known CVEs, transitive dependency depth, and package provenance) before it is merged. This applies even to well-known, widely used packages.
- **Development dependencies held to a lighter standard.** Build and tooling dependencies (Rollup, TypeScript, Storybook, Prettier, testing tools, etc.) do not require the same justification process, but should be well-maintained and widely used before adoption.
- **Existing dependencies are kept current.** Dependency updates that patch known vulnerabilities are prioritized and should not be allowed to lag.

## Technical Constraints

- **TypeScript strict mode.** All source code compiles under `strict: true`. No file may locally disable strict checks, and `any` is not used to work around type errors.
- **CSS Modules and utility classes only.** Component styling is authored using CSS Modules (`.module.css`) and shared utility classes defined in `src/styles/`. This is the only supported styling mechanism for components.
- **No CSS-in-JS.** Styling libraries that generate or inject styles at runtime through JavaScript (styled-components, Emotion, inline runtime style objects used as a primary styling mechanism, etc.) are not permitted. Keeping styling in CSS keeps it out of the JavaScript bundle and keeps the library's runtime dependency count at zero.
- **Semantic HTML.** Components must be built from semantic HTML elements appropriate to their function, with ARIA used to supplement — not replace — semantic markup where no native element applies. See [Component Requirements](./component-requirements.md#semantic-html) for the full requirement.
- **Bundling with Rollup.** The library is built exclusively with Rollup, producing CommonJS (`dist/cjs`), ES Modules (`dist/esm`), and TypeScript declaration (`dist/types.d.ts`) outputs from `src/`. Alternative bundlers are not introduced without an explicit architectural decision.

## Browser Support

- The library supports the last 2 versions of major evergreen browsers (Chrome, Firefox, Safari, Edge). Features that are not supported across this baseline are avoided or provided with a graceful fallback.
- The library targets ES5 output for broad compatibility while source code is written using modern JavaScript/TypeScript features during development; Rollup and its associated plugins handle the transformation.
- No support commitment is made for Internet Explorer or other browsers outside the evergreen last-2-versions baseline.

## Accessibility

- WCAG 2.1 Level AA is the minimum accessibility standard for every component. This is a floor, not a target to approach — components that fall short of AA are not considered complete.
- Accessibility is validated automatically (via Storybook accessibility testing) as part of every component's test suite, and manually (keyboard navigation, screen reader spot checks) for new or significantly changed components.

## Testing

- Storybook is the primary and required testing platform for components. Every component's automated test suite (interaction tests, accessibility tests, visual regression tests) lives alongside its Storybook stories.
- Automated Storybook tests must pass before a component is considered complete, and CI/CD gates block merges when tests fail.
- Theme validation (`npm run validate-themes`) runs as part of the standard test/build pipeline and must pass.

## Performance

- Bundle size is a first-class concern, not an afterthought. Every component's contribution to overall bundle size is weighed against the functionality it delivers before it is merged.
- Rollup's minification, tree-shaking, and terser configuration are relied upon to keep shipped output as small as possible; components should not defeat tree-shaking (for example, through side-effectful module-level code).
- Native CSS and HTML capabilities are preferred over JavaScript-driven equivalents (animation, form behavior, etc.) both for performance and to avoid unnecessary runtime code.

## Naming Conventions

- **Components** — PascalCase for component names, files, and directories (for example, `Button`, `src/components/Button/Button.tsx`).
- **Props interfaces** — PascalCase prefixed with `I` (for example, `IButtonProps`).
- **CSS** — Lowercase, kebab-case for class names and CSS Module file names (for example, `button-primary`, `button.module.css`).
- **Utilities** — Prefixed with `ood-` when exposed as shared/global-facing utility classes or identifiers (for example, `ood-visually-hidden`), to avoid collisions with consuming applications' own class names.

## Versioning

- The library follows Semantic Versioning (Major.Minor.Patch):
  - **Major** — Breaking API changes: component prop removals or type changes, removed exports, CSS variable removals.
  - **Minor** — New, non-breaking functionality: new components, new optional props, new theme variables.
  - **Patch** — Bug fixes and maintenance updates: style fixes, accessibility corrections, dependency patch updates.
- Every release clearly documents which changes are breaking, features, or fixes, and breaking changes include migration guidance.
