# Component Development Guides

This section is practical, how-to documentation for contributors building or modifying components in `@outoforbitdev/ood-react`. Where [architecture/component-patterns.md](../architecture/component-patterns.md) is the *reference* for the library's conventions, and [requirements/component-requirements.md](../requirements/component-requirements.md) is the *checklist* those conventions must satisfy, this section is the *how*: step-by-step guidance for actually building a component, validating its input, and composing it into forms.

If you haven't read [product/principles.md](../product/principles.md) and [architecture/overview.md](../architecture/overview.md) yet, read those first — this section assumes you already know why the library exists and how it's structured.

## Getting Started

Work through these three documents in order:

1. **[Building Components](./building-components.md)** — Component anatomy (component file, styles file, stories file), a full step-by-step walkthrough building a `Button`, a copy-paste template for new components, and the mistakes reviewers see most often.
2. **[Validation](./validation.md)** — How validation responsibility is split between a component and its consumer, HTML-native validation, async/server-side validation, and how to surface errors accessibly (`aria-invalid`, `aria-describedby`).
3. **[Form Patterns](./form-patterns.md)** — Controlled vs. uncontrolled components, managing form state with React state, grouping related fields with `fieldset`/`legend`, and vertical/horizontal layout conventions.

This order matters: `building-components.md` establishes the anatomy every component (including form components) follows, `validation.md` builds on that anatomy for input-like components specifically, and `form-patterns.md` builds on validation to show how individual fields compose into whole forms.

## Component Lifecycle

Every component in the library moves through three states over its lifetime:

| Stage | Meaning | Signals |
| --- | --- | --- |
| **New / Experimental** | Recently added, or an existing component undergoing a breaking rework. API may still change without a major version bump. | Storybook docs call this out explicitly (e.g., "Experimental — API may change"). Used cautiously in consuming applications. |
| **Stable** | Meets every item in the [Definition of Done](../quality/definition-of-done.md). API changes now follow [Versioning](../requirements/constraints.md#versioning) rules (breaking changes require a major version and migration guidance). | No "experimental" notice in Storybook docs. Safe for general use in consuming applications. |
| **Deprecated** | Superseded by another component or pattern, and scheduled for removal in a future major version. Still functional, but should not be adopted in new code. | Storybook docs and the component's Storybook description state the replacement and the target removal version. `AGENTS.md`/`CHANGELOG.md` note the deprecation. |

A component graduates from **New/Experimental** to **Stable** by satisfying the full Definition of Done — there's no separate approval step beyond that checklist. A component moves to **Deprecated** only when a maintainer has identified and documented its replacement; deprecation is never silent.

## Common Patterns

Most components in the library fall into one of four shapes. Recognizing which shape you're building helps you pick the right base interface and structure from the start (see [component-patterns.md](../architecture/component-patterns.md#base-interfaces) for the full interface reference).

- **Simple** — A single element with no meaningful internal structure. Extends `IComponentProps` (or `IChildlessComponentProps` if it can never render children) and renders one semantic element. `Button` is the canonical example.
- **Input** — A form control that reports a value and, optionally, a validation state back to the consumer. Typically extends `IChildlessComponentProps` plus the relevant native `*HTMLAttributes` type (`React.InputHTMLAttributes<HTMLInputElement>`, etc.). Covered in depth in [validation.md](./validation.md) and [form-patterns.md](./form-patterns.md).
- **Container** — Wraps and lays out other components via `children`, rather than configuring content through props. `NavBar` and `Expandable` are examples; see [Composition Over Props Explosion](../architecture/component-patterns.md#composition-over-props-explosion).
- **Compound** — A family of components that share implicit state or structure, coordinated by convention rather than a single monolithic component. `Infobox` / `InfoboxSection` / `InfoboxRow` / `InfoboxTitle` is the library's existing example.

## File Organization Checklist

Every component's files land in the same three places. Before opening a PR, confirm:

- [ ] Component implementation lives in `src/components/` (`ComponentName.tsx`)
- [ ] CSS Module lives in `src/styles/` (`component-name.module.css`)
- [ ] Storybook stories live in `src/stories/` (`ComponentName.stories.tsx`)
- [ ] The component and its props interface are exported from `src/index.ts`
- [ ] Shared logic used by more than one component lives in `src/lib/`, not duplicated per component
- [ ] No new file introduces a circular dependency (see [No Circular Dependencies](../requirements/component-requirements.md#no-circular-dependencies))

See [Building Components](./building-components.md#component-anatomy) for what belongs in each of these files.

## Testing

Every component ships with automated tests before it's considered done — manual testing supplements automated coverage but never replaces it.

- **Storybook (automated, required)** — Interaction tests (Storybook Play functions simulating clicks, keyboard input, and focus changes), accessibility checks (the a11y addon, gating on zero violations), and visual regression coverage (baseline screenshots per story). These run as part of `just gate` and block merges when they fail. See [requirements/component-requirements.md#storybook-tests](../requirements/component-requirements.md#storybook-tests).
- **Manual (supplementary)** — Keyboard-only navigation through the component in the running Storybook instance (`npm run storybook`), and a screen reader spot check for new or significantly changed components. Manual testing is expected to catch what automated a11y checks can't (e.g., whether the reading order actually makes sense), not to substitute for the automated suite.

## Next Steps

Once a component is built, validated, and tested here:

- Confirm it against the full [Definition of Done](../quality/definition-of-done.md) checklist.
- Review [quality/coding-standards.md](../quality/coding-standards.md) and [quality/testing-strategy.md](../quality/testing-strategy.md) for the standards your PR will be reviewed against.
- Read [workflows/development-process.md](../workflows/development-process.md) for how to open the PR itself (branching, commit conventions, CI gates).
