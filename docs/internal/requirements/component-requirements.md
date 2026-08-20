# Component Requirements

This document defines the functional and non-functional requirements every component in `@outoforbitdev/ood-react` must satisfy. These requirements apply to every new component and to significant changes to existing components. They exist alongside, and in service of, the [Core Principles](../product/principles.md) — this document translates those principles into concrete, checkable requirements.

## Functional Requirements

### Semantic HTML

- Components render semantic HTML elements appropriate to their purpose (`<button>` for buttons, `<nav>` for navigation, `<input>` for form fields, `<a>` for links, etc.). Generic `<div>`/`<span>` elements styled to look interactive are not acceptable substitutes.
- Where no native element fully expresses the component's role (for example, a custom dropdown or tab panel), the component uses the correct ARIA role, state, and property attributes to convey that role to assistive technology.
- Heading levels, list structures, and landmark regions are used correctly when a component renders structural content, so the resulting DOM makes sense independent of visual styling.

### TypeScript Interfaces

- Every component exposes a public props interface, prefixed with `I` (for example, `IButtonProps`), that is exported from the library's public API.
- Props interfaces have explicit, documented types for every prop — no implicit `any`, and no untyped `object` or `Function` props.
- Optional props are marked optional (`?`) and given sensible, documented defaults in the component implementation rather than relying on consumers to always supply a value.
- Shared prop shapes (for example, standard DOM attribute passthrough, `children`, `className`) are drawn from shared base interfaces rather than redefined per component, per the Consistent Design Language principle.
- Union types and discriminated unions are used to model mutually exclusive prop combinations (for example, a component that accepts either `href` or `onClick`, but constrains the resulting shape) so invalid combinations are caught at compile time rather than at runtime.

### Theme Compliance

- Components consume color, spacing, and typography exclusively through the shared theme system (CSS variables defined in `src/styles/themes.css`) rather than hardcoded values.
- Components render correctly in every theme mode the library supports (light and dark, at minimum) without requiring component-specific overrides.
- No component introduces a one-off color, spacing, or typography value that duplicates or bypasses an existing theme token. New visual values that are broadly useful are proposed as new theme tokens rather than embedded directly in a component's stylesheet.

### Passthrough Props

- Components forward standard, applicable HTML attributes (`className`, `id`, `data-*`, `aria-*`, event handlers, etc.) to their underlying DOM element so consumers can extend behavior and styling without the library needing to anticipate every use case.
- Passthrough is implemented by extending the appropriate native element's attribute type (for example, `React.ButtonHTMLAttributes<HTMLButtonElement>`) rather than manually re-declaring individual attributes.
- Where a component intentionally does not forward a given native attribute (because the component manages it internally), that omission is deliberate and documented in the component's Storybook documentation, not accidental.
- Consumer-supplied `className` is merged with, not replaced by, the component's own generated class names.

### File Structure

- Each component lives in its own directory under `src/components/`, containing the component implementation (`.tsx`), its CSS Module (`.module.css`), and its exported types.
- Corresponding Storybook stories live in `src/stories/` using the `.stories.tsx` naming convention and are kept in sync with the component's actual props and behavior.
- Shared utilities used by a component are placed in `src/lib/` rather than duplicated inside the component's own directory.
- The component's public exports (the component itself and its props interface) are added to the library's top-level index so they are part of the published `@outoforbitdev/ood-react` API surface.

### No Circular Dependencies

- Components do not import from other components in a way that creates a dependency cycle (Component A imports Component B, which imports Component A).
- Shared logic that multiple components depend on is extracted into `src/lib/` utilities rather than having components depend directly on one another.
- Dependency direction flows from components toward shared utilities and the theme layer, never the reverse — utilities and theme code must not import from `src/components/`.

## Non-Functional Requirements

### Accessibility (WCAG 2.1 AA)

- Every component meets WCAG 2.1 Level AA success criteria at minimum, covering perceivable, operable, understandable, and robust requirements.
- Interactive elements are fully operable via keyboard alone, with a visible focus indicator that meets contrast requirements.
- Color contrast between foreground and background meets or exceeds WCAG 2.1 AA thresholds (4.5:1 for normal text, 3:1 for large text and UI components) in every supported theme.
- Automated accessibility checks run as part of the component's Storybook test suite, and any violations block the component from being considered complete.

### Storybook Tests

- Every component ships with an automated Storybook test suite covering its meaningful states (default, disabled, error, loading, etc.) and interactions.
- Interaction tests use Storybook Play functions to simulate real user behavior (clicks, keyboard input, focus changes) and assert on the resulting state, not just that the component renders without throwing.
- Visual regression coverage is included so that unintended appearance changes, including changes introduced indirectly through shared styles or theme updates, are caught automatically.
- Accessibility testing is included in the same suite rather than treated as a separate, optional pass.

### TypeScript Strict Mode

- All component code is written and compiled under TypeScript strict mode (`strict: true`), with no local suppression of strict checks (no `// @ts-ignore` or `any` used to bypass type errors).
- The build produces complete `.d.ts` declarations for every public export, and those declarations are verified to accurately describe the component's runtime behavior.

### Performance

- Components avoid unnecessary re-renders by keeping prop shapes stable and using memoization (`React.memo`, `useMemo`, `useCallback`) where it measurably helps, not reflexively.
- Components perform minimal computation during render and avoid unnecessary internal state.
- Animation and transition effects are implemented in CSS rather than JavaScript wherever the effect can be achieved that way.
- A component's contribution to the library's overall bundle size is considered before it is merged; components should not introduce disproportionate bundle weight relative to the functionality they provide.

### Documentation

- Every component has Storybook documentation describing its purpose, its props (including types, defaults, and whether each is required), and representative usage examples.
- Non-obvious behavior — accessibility considerations, intentional omissions from passthrough, interactions with the theme system — is called out explicitly in the component's documentation rather than left to be discovered by reading source.
- Breaking changes to a component's public API are documented in release notes with clear migration guidance.

## Definition of Done

A component is not considered complete until every item below is satisfied:

- [ ] Renders semantic HTML (or correct ARIA roles/states where no semantic element applies)
- [ ] Public props interface is defined, exported, and prefixed with `I`
- [ ] All props are explicitly typed; no `any` is used
- [ ] Component consumes only theme system tokens for color, spacing, and typography
- [ ] Component renders correctly in every supported theme mode
- [ ] Standard HTML attributes are passed through to the underlying element, including merged `className`
- [ ] Component, styles, and types follow the standard file structure under `src/components/`
- [ ] Component and its props interface are exported from the library's public index
- [ ] No circular dependencies are introduced between components or between components and shared utilities
- [ ] Component meets WCAG 2.1 AA accessibility criteria, including keyboard operability and color contrast
- [ ] Automated Storybook tests cover meaningful states and interactions
- [ ] Automated accessibility checks pass with no violations
- [ ] Visual regression baseline is captured or updated
- [ ] TypeScript strict mode compiles with no errors and no suppressions
- [ ] `.d.ts` declarations are generated and accurately reflect the public API
- [ ] Component avoids unnecessary re-renders and unnecessary internal state
- [ ] Bundle size impact has been considered and is proportionate to the component's functionality
- [ ] Storybook documentation describes purpose, props, and usage examples
- [ ] Any intentional deviations (non-forwarded attributes, non-standard theming, etc.) are documented
- [ ] `just gate` (tests, linting, type checking) passes
