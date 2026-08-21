# Vision

## Purpose

`library-react-core` is a reusable React component library that builds the npm package `@outoforbitdev/ood-react`. It provides the foundational UI building blocks — buttons, inputs, navigation, layout primitives, and more — that outoforbitdev applications assemble into full user experiences. Rather than every application team designing, styling, and testing its own version of a button or a navbar, this library centralizes that work so it is done once, done well, and reused everywhere.

This library is primarily built for outoforbitdev's internal teams. Its primary consumer today is `app-galaxy-map`, and it is expected to grow as new applications and teams are added to the organization. While the package is published publicly on npm as `@outoforbitdev/ood-react` and is available for external use, its API, roadmap, and priorities are driven primarily by the needs of outoforbitdev's own products. Documentation and patterns in this library should be accessible to external consumers, but the library's evolution will reflect outoforbitdev's product needs.

The library matters because consistency and maintainability compound over time. Without a shared component library, every application drifts toward its own conventions, its own accessibility gaps, and its own styling inconsistencies — and every fix must be applied N times instead of once. `library-react-core` exists to prevent that drift: a bug fixed here, an accessibility improvement made here, or a design update rolled out here benefits every application that depends on it, immediately and consistently.

## Target Use Cases

### Primary

- **Building web applications.** Application teams import components from this library to assemble product UIs without building common elements from scratch.
- **Standardizing components.** Any UI element that appears in more than one application — buttons, inputs, navigation, expandable sections — belongs here so there is exactly one implementation to maintain.
- **Reducing duplication.** Eliminating copy-pasted or reinvented UI code across repositories, so improvements and fixes are made in a single place and propagate everywhere the library is used.

### Secondary

- **Reference for patterns.** The library's component structure, prop conventions, and file organization serve as the canonical example other outoforbitdev code should follow, even outside the library itself.
- **Testing the theme system.** As the proving ground for the shared theming system, the library validates that theme changes (color ramps, utility classes) work correctly before those changes propagate to consuming applications.
- **Design system foundation.** The library is the base layer for a broader outoforbitdev design system, providing the primitives that future design tooling and documentation will build on.

## What We Build

- **Core UI Components** — Foundational, general-purpose elements such as buttons, inputs, navbars, expandable/collapsible sections, search inputs, infoboxes, and an icon library.
- **Consistent Styling** — A styling approach built on CSS Modules combined with shared utility classes, backed by a theme system so visual changes propagate consistently across every component.
- **Accessibility by Default** — Every component meets WCAG 2.1 AA out of the box, so consuming applications do not have to retrofit accessibility after the fact.
- **Automated Testing** — Storybook-based automated tests that verify behavior, appearance, and accessibility for every component, catching regressions before they reach consumers.
- **Clear Patterns** — Documented component architecture (shared prop interfaces, file layout, styling conventions) so any contributor can build a new component that looks and behaves like the rest of the library.

## What We Don't Build

- **Complex application logic.** Business rules, data fetching, routing, and state management belong in the consuming application, not in this library.
- **Custom charting or visualization.** Specialized visualization needs (such as the galaxy map) are built as their own dedicated libraries, not folded into this general-purpose component set.
- **Browser polyfills.** The library targets modern, supported browsers directly; it does not ship or maintain polyfills for legacy environments.
- **Form management frameworks.** Currently, the library provides form-related input components but not a full form-management or validation framework; that responsibility remains with the consuming application. This decision may evolve if shared form patterns emerge across multiple outoforbitdev applications.
- Components in this library are expected to be **presentational and composable**: they render UI and expose behavior through props, and they compose cleanly with application-specific logic rather than owning it.

## Success Criteria

1. A new contributor can build and ship a simple new component in under two hours, from scratch to a working Storybook story.
2. Code review catches consistency issues (prop naming, styling approach, missing accessibility attributes) automatically, without relying on tribal knowledge.
3. Theme changes (colors, spacing, typography) can be made in one place without requiring scattered edits across individual component files.
4. All components pass automated accessibility testing before they are considered done.
5. Library updates — new versions of `@outoforbitdev/ood-react` — do not introduce regressions in the applications that consume it.
