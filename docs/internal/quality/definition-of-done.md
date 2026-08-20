# Definition of Done

This document provides the comprehensive merge checklist for pull requests to `@outoforbitdev/ood-react`. Before a PR is approved and merged, every item below must be satisfied. Each item is cross-referenced to the documentation that describes it in detail, so reviewers and contributors can quickly find the full context.

## Functional Requirements

These items verify that the component or feature is built correctly, following the library's architectural and design patterns.

### Semantic HTML and Accessibility Foundations

- [ ] **Renders semantic HTML** — The component uses appropriate semantic HTML elements (`<button>`, `<nav>`, `<input>`, `<a>`, etc.) for its purpose, not generic `<div>`/`<span>` styled to look interactive.
  - See: [Component Requirements — Semantic HTML](../requirements/component-requirements.md#semantic-html)

- [ ] **ARIA roles and attributes are correct** — Where no native element fully expresses the component's role (custom dropdown, tab panel, etc.), the component uses the correct ARIA role, state, and property attributes.
  - See: [Accessibility Checklist](./accessibility-checklist.md)

- [ ] **Heading levels and landmarks are correct** — If the component renders structural content, heading levels, list structures, and landmark regions are used correctly so the DOM makes sense independent of visual styling.
  - See: [Component Requirements — Semantic HTML](../requirements/component-requirements.md#semantic-html)

### TypeScript and Types

- [ ] **Public props interface is defined and exported** — Every component exposes a public props interface, prefixed with `I` (e.g., `IButtonProps`), and the interface is exported from the library's public API (`src/index.ts`).
  - See: [Component Requirements — TypeScript Interfaces](../requirements/component-requirements.md#typescript-interfaces)

- [ ] **All props are explicitly typed** — No implicit `any`, no untyped `object` or `Function` props. Every prop has a concrete, documented type.
  - See: [Component Requirements — TypeScript Interfaces](../requirements/component-requirements.md#typescript-interfaces), [Coding Standards](./coding-standards.md)

- [ ] **Optional props are marked and given defaults** — Optional props are declared with `?` and have sensible defaults in the component implementation rather than relying on consumers to always supply a value.
  - See: [Component Requirements — TypeScript Interfaces](../requirements/component-requirements.md#typescript-interfaces)

- [ ] **Shared base interfaces are used** — Props interfaces extend one of the shared base interfaces (`IComponentProps` or `IChildlessComponentProps`) defined in `src/components/IComponent.tsx`, not redefined per component.
  - See: [Component Patterns — Base Interfaces](../architecture/component-patterns.md#base-interfaces)

- [ ] **Union types model exclusive prop combinations** — Mutually exclusive prop combinations are modeled using union types or discriminated unions so invalid combinations are caught at compile time, not runtime.
  - See: [Component Patterns](../architecture/component-patterns.md)

### Theme Compliance

- [ ] **Only theme tokens are consumed** — The component consumes color, spacing, and typography exclusively through the shared theme system (CSS variables defined in `src/styles/themes.css`), with no hardcoded values.
  - See: [Theme System Architecture](../architecture/theme-system.md), [Constraints — Technical](../requirements/constraints.md#technical-constraints)

- [ ] **Renders correctly in every supported theme** — The component displays correctly in every theme mode the library supports (light and dark, at minimum) without requiring component-specific overrides.
  - See: [Theme System Architecture](../architecture/theme-system.md)

- [ ] **No duplicate or bypassed theme values** — The component does not introduce one-off color, spacing, or typography values that duplicate or bypass existing theme tokens. New visual values that are broadly useful are proposed as new theme tokens rather than embedded in a component's stylesheet.
  - See: [Theme System Architecture](../architecture/theme-system.md#cascade-constraint), [Constraints — Technical](../requirements/constraints.md#technical-constraints)

### Passthrough Props and Extensibility

- [ ] **Standard HTML attributes are forwarded** — The component forwards applicable HTML attributes (`className`, `id`, `data-*`, `aria-*`, event handlers, etc.) to its underlying DOM element so consumers can extend behavior and styling without the library needing to anticipate every use case.
  - See: [Component Requirements — Passthrough Props](../requirements/component-requirements.md#passthrough-props)

- [ ] **Passthrough uses native element attribute types** — Passthrough is implemented by extending the appropriate native element's attribute type (e.g., `React.ButtonHTMLAttributes<HTMLButtonElement>`), not by manually re-declaring individual attributes.
  - See: [Component Requirements — Passthrough Props](../requirements/component-requirements.md#passthrough-props)

- [ ] **Non-forwarded attributes are intentional and documented** — Where the component intentionally does not forward a native attribute (because the component manages it internally), this omission is deliberate and documented in Storybook, not accidental.
  - See: [Component Requirements — Passthrough Props](../requirements/component-requirements.md#passthrough-props)

- [ ] **Consumer className is merged, not replaced** — Consumer-supplied `className` is merged with the component's own generated class names, not replaced by them. The `combineClassNames` helper in `src/lib/` is used for this.
  - See: [Component Patterns — Helper Functions](../architecture/component-patterns.md#helper-functions)

### File Structure and Organization

- [ ] **Component lives in correct directory** — Each component lives in its own directory under `src/components/`, containing the component implementation (`.tsx`), its CSS Module (`.module.css`), and its exported types.
  - See: [Component Requirements — File Structure](../requirements/component-requirements.md#file-structure)

- [ ] **Storybook stories are in sync and colocated** — Corresponding Storybook stories live in `src/stories/` using the `.stories.tsx` naming convention and are kept in sync with the component's actual props and behavior.
  - See: [Component Requirements — File Structure](../requirements/component-requirements.md#file-structure)

- [ ] **Shared utilities are centralized** — Shared utilities used by a component are placed in `src/lib/` rather than duplicated inside the component's own directory or scattered across multiple components.
  - See: [Component Requirements — File Structure](../requirements/component-requirements.md#file-structure)

- [ ] **Component is exported from public index** — The component and its props interface are added to `src/index.ts` so they are part of the published `@outoforbitdev/ood-react` API surface.
  - See: [Component Requirements — File Structure](../requirements/component-requirements.md#file-structure)

### No Circular Dependencies

- [ ] **No circular imports** — The component does not import from other components in a way that creates a dependency cycle (Component A imports Component B, which imports Component A).
  - See: [Component Requirements — No Circular Dependencies](../requirements/component-requirements.md#no-circular-dependencies)

- [ ] **Shared logic is extracted** — Logic that multiple components depend on is extracted into `src/lib/` utilities rather than having components depend directly on one another.
  - See: [Component Requirements — No Circular Dependencies](../requirements/component-requirements.md#no-circular-dependencies)

- [ ] **Dependency direction is correct** — Dependency direction flows from components toward shared utilities and the theme layer. Utilities and theme code never import from `src/components/`.
  - See: [Component Requirements — No Circular Dependencies](../requirements/component-requirements.md#no-circular-dependencies)

## Non-Functional Requirements

These items verify that the component meets quality standards for accessibility, testing, performance, and maintainability.

### Accessibility (WCAG 2.1 AA)

- [ ] **WCAG 2.1 Level AA is met** — The component meets WCAG 2.1 Level AA success criteria at minimum, covering perceivable, operable, understandable, and robust requirements.
  - See: [Accessibility Checklist](./accessibility-checklist.md), [Constraints — Accessibility](../requirements/constraints.md#accessibility)

- [ ] **Keyboard operability is full** — Interactive elements are fully operable via keyboard alone, with visible focus indicators that meet WCAG contrast requirements.
  - See: [Accessibility Checklist](./accessibility-checklist.md)

- [ ] **Color contrast meets standards** — Color contrast between foreground and background meets or exceeds WCAG 2.1 AA thresholds (4.5:1 for normal text, 3:1 for large text and UI components) in every supported theme.
  - See: [Accessibility Checklist](./accessibility-checklist.md)

- [ ] **Automated accessibility checks pass** — Automated accessibility checks run as part of the component's Storybook test suite, and no violations are present.
  - See: [Testing Strategy](./testing-strategy.md), [Constraints — Testing](../requirements/constraints.md#testing)

### Storybook Testing

- [ ] **Automated test suite covers meaningful states** — The component ships with an automated Storybook test suite covering its meaningful states (default, disabled, error, loading, etc.) and interactions.
  - See: [Component Requirements — Storybook Tests](../requirements/component-requirements.md#storybook-tests), [Testing Strategy](./testing-strategy.md)

- [ ] **Interaction tests simulate real user behavior** — Interaction tests use Storybook Play functions to simulate real user behavior (clicks, keyboard input, focus changes) and assert on the resulting state, not just that the component renders without throwing.
  - See: [Testing Strategy](./testing-strategy.md)

- [ ] **Visual regression baseline is captured** — Visual regression coverage is included so that unintended appearance changes (including changes introduced indirectly through shared styles or theme updates) are caught automatically.
  - See: [Component Requirements — Storybook Tests](../requirements/component-requirements.md#storybook-tests), [Testing Strategy](./testing-strategy.md)

- [ ] **Accessibility testing is integrated** — Accessibility testing is included in the same test suite as interaction and visual regression tests, not treated as a separate, optional pass.
  - See: [Testing Strategy](./testing-strategy.md)

- [ ] **All Storybook tests pass** — The automated Storybook test suite passes completely before merge.
  - See: [Testing Strategy](./testing-strategy.md)

### TypeScript Strict Mode

- [ ] **Code compiles under strict mode** — All component code is written and compiles under TypeScript strict mode (`strict: true`), with no local suppression of strict checks (no `// @ts-ignore` or `any` used to bypass type errors).
  - See: [Component Requirements — TypeScript Strict Mode](../requirements/component-requirements.md#typescript-strict-mode), [Coding Standards](./coding-standards.md)

- [ ] **Declaration files are generated and accurate** — The build produces complete `.d.ts` declarations for every public export, and those declarations are verified to accurately describe the component's runtime behavior.
  - See: [Component Requirements — TypeScript Strict Mode](../requirements/component-requirements.md#typescript-strict-mode)

### Performance

- [ ] **Unnecessary re-renders are avoided** — The component keeps prop shapes stable and uses memoization (`React.memo`, `useMemo`, `useCallback`) where it measurably helps, not reflexively.
  - See: [Component Requirements — Performance](../requirements/component-requirements.md#performance)

- [ ] **Render computation is minimal** — The component performs minimal computation during render and avoids unnecessary internal state.
  - See: [Component Requirements — Performance](../requirements/component-requirements.md#performance)

- [ ] **Animations use CSS** — Animation and transition effects are implemented in CSS rather than JavaScript wherever the effect can be achieved that way.
  - See: [Component Requirements — Performance](../requirements/component-requirements.md#performance)

- [ ] **Bundle weight is proportionate** — The component's contribution to the library's overall bundle size is considered before it is merged; it should not introduce disproportionate bundle weight relative to the functionality it provides.
  - See: [Component Requirements — Performance](../requirements/component-requirements.md#performance), [Constraints — Performance](../requirements/constraints.md#performance)

### Documentation

- [ ] **Storybook documentation describes purpose and usage** — The component has Storybook documentation describing its purpose, its props (including types, defaults, and whether each is required), and representative usage examples.
  - See: [Component Requirements — Documentation](../requirements/component-requirements.md#documentation)

- [ ] **Non-obvious behavior is documented** — Non-obvious behavior, including accessibility considerations, intentional omissions from passthrough, and interactions with the theme system, is called out explicitly in the component's documentation rather than left to be discovered by reading source.
  - See: [Component Requirements — Documentation](../requirements/component-requirements.md#documentation)

- [ ] **Breaking changes include migration guidance** — Breaking changes to a component's public API are documented in release notes with clear migration guidance.
  - See: [Component Requirements — Documentation](../requirements/component-requirements.md#documentation)

## Code Quality

These items verify that the code follows the library's standards for style, naming, dependencies, and maintainability.

### Linting and Formatting

- [ ] **Code passes linting** — The code passes the project's linter (ESLint) without warnings or errors.
  - See: [Coding Standards](./coding-standards.md)

- [ ] **Code is formatted consistently** — The code is formatted using Prettier with no deviations from the project's `.prettierrc` configuration.
  - See: [Coding Standards](./coding-standards.md)

- [ ] **just gate passes completely** — Running `just gate` (which runs tests, linting, type checking, and theme validation) passes without errors.
  - See: [Coding Standards](./coding-standards.md), [Component Requirements — Definition of Done](../requirements/component-requirements.md#definition-of-done)

### Naming Conventions

- [ ] **Components use PascalCase** — Component names, files, and directories use PascalCase (e.g., `Button`, `src/components/Button/Button.tsx`).
  - See: [Constraints — Naming Conventions](../requirements/constraints.md#naming-conventions)

- [ ] **Props interfaces use I-prefix** — Props interfaces use PascalCase prefixed with `I` (e.g., `IButtonProps`).
  - See: [Constraints — Naming Conventions](../requirements/constraints.md#naming-conventions)

- [ ] **CSS uses lowercase kebab-case** — CSS class names and CSS Module file names use lowercase, kebab-case (e.g., `button-primary`, `button.module.css`).
  - See: [Constraints — Naming Conventions](../requirements/constraints.md#naming-conventions)

- [ ] **Utilities are prefixed with ood-** — Shared or globally-facing utility classes or identifiers are prefixed with `ood-` to avoid collisions with consuming applications' own class names (e.g., `ood-visually-hidden`).
  - See: [Constraints — Naming Conventions](../requirements/constraints.md#naming-conventions)

### No Placeholders or TODOs

- [ ] **No placeholder content** — The code contains no placeholder text, `TODO`, `FIXME`, `XXX`, or other markers indicating incomplete work.
  - See: [Building Components](./building-components.md), [Coding Standards](./coding-standards.md)

- [ ] **Documentation is complete** — All documentation strings, Storybook docs, and comments are complete and not left in draft form.
  - See: [Building Components](./building-components.md), [Coding Standards](./coding-standards.md)

### Dependency Management

- [ ] **No new runtime dependencies** — The component does not introduce new runtime dependencies (only React and React-DOM are permitted as runtime deps). Any proposed runtime dependency has been justified and approved by maintainers.
  - See: [Constraints — Dependency Constraints](../requirements/constraints.md#dependency-constraints)

- [ ] **Development dependencies are appropriate** — Any new development or build-time dependencies are well-maintained and widely used.
  - See: [Constraints — Dependency Constraints](../requirements/constraints.md#dependency-constraints)

### Code Style and Structure

- [ ] **One component per file** — Each component is defined in its own `.tsx` file, not bundled with multiple components in a single file.
  - See: [Coding Standards](./coding-standards.md)

- [ ] **Styling uses CSS Modules** — Component styling is authored using CSS Modules (`.module.css`), not CSS-in-JS or runtime style injection.
  - See: [Constraints — Technical Constraints](../requirements/constraints.md#technical-constraints)

- [ ] **No CSS-in-JS** — Styling libraries that generate or inject styles at runtime (styled-components, Emotion, etc.) are not used. Styling remains in plain CSS.
  - See: [Constraints — Technical Constraints](../requirements/constraints.md#technical-constraints)

- [ ] **Semantic HTML is enforced** — See "Semantic HTML and Accessibility Foundations" section above.
  - See: [Constraints — Technical Constraints](../requirements/constraints.md#technical-constraints)

## Review Approval

These items verify that the code has been reviewed and approved by the team before merge.

### Code Review

- [ ] **Code review has been completed** — The PR has been reviewed by at least one other contributor and all substantive feedback has been addressed or discussed.
  - See: [Review Guidelines](./review-guidelines.md)

- [ ] **Component consistency is verified** — The reviewer has verified that the component follows established patterns and is consistent with other components in the library.
  - See: [Review Guidelines](./review-guidelines.md)

- [ ] **Theme compliance is checked** — The reviewer has verified that the component consumes theme tokens correctly and renders properly in all supported themes.
  - See: [Review Guidelines](./review-guidelines.md)

- [ ] **Testing is adequate** — The reviewer has confirmed that the component's test suite is thorough and covers meaningful states and edge cases.
  - See: [Review Guidelines](./review-guidelines.md)

- [ ] **Accessibility is verified** — The reviewer has spot-checked keyboard navigation and screen reader compatibility (in addition to automated checks).
  - See: [Review Guidelines](./review-guidelines.md)

### Maintainer Sign-Off

- [ ] **Maintainer approval is present** — A library maintainer has reviewed the PR and approved it for merge.
  - See: [Review Guidelines](./review-guidelines.md)

- [ ] **CI/CD gates are passing** — All automated CI/CD checks (tests, linting, type checking, theme validation) are passing.
  - See: [Coding Standards](./coding-standards.md)

- [ ] **No merge conflicts** — The branch has no unresolved merge conflicts and is up to date with the base branch.

- [ ] **Commits follow conventions** — Commit messages follow the conventional commits format (feat:, fix:, docs:, chore:, etc.).
  - See: [Coding Standards](./coding-standards.md)

## Quick Reference by Document

- **[Component Requirements](../requirements/component-requirements.md)** — Functional and non-functional requirements for every component.
- **[Constraints](../requirements/constraints.md)** — Hard constraints on dependencies, technical approach, browser support, accessibility, testing, performance, naming, and versioning.
- **[Component Patterns](../architecture/component-patterns.md)** — Base interfaces, helper functions, styling approach, semantic HTML, and common patterns.
- **[Theme System Architecture](../architecture/theme-system.md)** — How themes work, color ramps, cascade constraints, and theme management.
- **[Icon Library](../architecture/icon-library.md)** — Icon strategy, sizing conventions, and accessibility for icons.
- **[Building Components](./building-components.md)** — Step-by-step guidance and templates for building new components.
- **[Coding Standards](./coding-standards.md)** — TypeScript strict mode, formatting, component conventions, interfaces, commits, and dependencies.
- **[Testing Strategy](./testing-strategy.md)** — Storybook automated tests, what to test, axe integration, and coverage expectations.
- **[Accessibility Checklist](./accessibility-checklist.md)** — WCAG 2.1 AA requirements, keyboard navigation, ARIA, color contrast, semantic HTML, and testing approach.
- **[Review Guidelines](./review-guidelines.md)** — What reviewers verify during code review.

## Using This Checklist

- **For contributors:** Work through this checklist as you develop your component or feature. Refer to linked documentation for clarification on any item.
- **For reviewers:** Use this checklist to guide your review. Verify that all items are satisfied before approving the PR. Where an item is unclear, consult the linked documentation.
- **For maintainers:** Before merging, confirm that every item above is checked. No component or feature is considered complete and ready to ship until the entire checklist is satisfied.

