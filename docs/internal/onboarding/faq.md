# FAQ

Quick answers to the questions that come up most often. Each answer links to the doc with the full story — start here, then follow the link if you need more.

## How do I add a new component?

Read [Building Components](../components/building-components.md) for the step-by-step anatomy and a worked example, and [Component Patterns](../architecture/component-patterns.md) for the base interfaces (`IComponentProps` / `IChildlessComponentProps`) and helper functions (`getDomProps`, `combineClassNames`) every component uses. In short: create `src/components/YourComponent.tsx` extending the right base interface, a matching CSS Module in `src/styles/`, export it from `src/index.ts`, and add a story in `src/stories/`. Before opening a PR, check your component against [Component Requirements](../requirements/component-requirements.md) and the [Definition of Done](../quality/definition-of-done.md). [Quick Start](./quick-start.md) walks through building one (`Badge`) from scratch.

## What's the theme system?

Components don't hardcode colors. Consumers apply a utility class (`ood-primary`, `ood-secondary`, `ood-accent`, `ood-error`, etc.) to a container, which sets a small set of local CSS variables (`--ood-text`, `--ood-background`, `--ood-shade`, `--ood-link`, `--ood-link-visited`); every component inside reads from those local variables rather than theme-specific ones. Underneath, those local variables resolve through semantic theme variables down to a shared, globally-generated swatch ramp (grays, blues, etc.) that's identical across themes — themes only choose which step of a ramp to reference. Full details, including the cascade constraint on modifying ramps, are in [Theme System Architecture](../architecture/theme-system.md). Adding a new theme has its own guide: [Adding a Theme](../workflows/adding-a-theme.md).

## How do I test components?

There's no separate unit-test framework — testing happens through Storybook. Every component that ships needs a story in `src/stories/` (`<Component>.stories.tsx`), which Storybook's test runner exercises for visual regression, accessibility (axe), and interaction testing. Run Storybook locally with `npm run storybook`. Separately, `just test` runs theme-ramp validation (`scripts/themes/validate.ts`) and a TypeScript type check (`tsc --noEmit`); `just gate` runs the full pre-merge suite (tests + lint + type check). See [Testing Strategy](../quality/testing-strategy.md) for what's expected of a story and [Repo Tour](./repo-tour.md#testing-setup) for how the pieces fit together.

## What if my component needs custom logic?

Custom logic (state, effects, event handling, validation) is expected and fine — it's the styling and prop-shape conventions that are consistent across the library, not the internals. Keep the public props interface minimal and predictable (extend `IComponentProps`/`IChildlessComponentProps`, name it `I<Component>Props`), and keep DOM-facing concerns (`className`, `id`, `style`, `onClick`) flowing through `getDomProps` as usual even if the component has significant internal state. If the component involves form input or validation specifically, see [Validation](../components/validation.md) and [Form Patterns](../components/form-patterns.md) for the established approach to controlled/uncontrolled state and error display. If you're unsure whether your logic fits the library's patterns, [Component Patterns](../architecture/component-patterns.md#when-to-deviate) covers when it's acceptable to deviate from the norm.

## Where's the design system documentation?

Start at [docs/internal/README.md](../README.md) for the full index. The pieces that make up the "design system" specifically are:

- [Theme System Architecture](../architecture/theme-system.md) — colors, CSS variables, ramps
- [Component Patterns](../architecture/component-patterns.md) — the structural conventions every component follows
- [Icon Library](../architecture/icon-library.md) — icon components, sizing, and accessibility conventions
- [Product Vision](../product/vision.md) and [Design Principles](../product/principles.md) — the higher-level intent behind the library's design decisions
- Storybook itself (`npm run storybook`) — the living, visual reference for every shipped component and theme

## Where do I go from here?

- [Quick Start](./quick-start.md) — a 30-minute hands-on walkthrough
- [Repo Tour](./repo-tour.md) — full codebase orientation
- [Component Requirements](../requirements/component-requirements.md) and [Constraints](../requirements/constraints.md) — what a component must satisfy
- [Definition of Done](../quality/definition-of-done.md) — the merge checklist
