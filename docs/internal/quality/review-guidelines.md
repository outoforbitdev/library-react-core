# Review Guidelines

A code review on `@outoforbitdev/ood-react` is not a style opinion exchange — it's the gate that keeps this library's [Core Principles](../product/principles.md) true for every component that ships. Because every application that depends on this library trusts a version bump not to silently break its UI or introduce a security or accessibility regression, review here is stricter and more mechanical than on a typical application repo: most of what a reviewer checks has a concrete, checkable answer, not a matter of taste. This document describes what a reviewer must verify, gives a checklist to work through on every pull request, and lists the red flags that should stop a merge even if the rest of the PR looks fine.

Reviewers should cite the specific principle, requirement, or pattern doc a comment is grounded in (for example, "per [Component Patterns — Semantic HTML](../architecture/component-patterns.md#semantic-html)") rather than asserting a preference. This keeps review feedback consistent across reviewers and makes it easy for the author to look up the full rationale.

## What Reviewers Must Verify

### Consistency Against Existing Patterns

The library's [Consistent Design Language principle](../product/principles.md#2-consistent-design-language) exists precisely so that reviewers have a concrete standard to check against, not just their own judgment. Before approving:

- The component's props interface extends `IComponentProps` or `IChildlessComponentProps` (see [Component Patterns — Base Interfaces](../architecture/component-patterns.md#base-interfaces)) unless a deviation is explicitly justified per [When to Deviate](../architecture/component-patterns.md#when-to-deviate).
- The component builds its root element's props with `getDomProps`, in the standard `props` a-then-Module-classes argument order, rather than manually assembling `className`/`id`/`onClick`/`style`.
- New props follow the shapes and naming already established by similar components — a new prop that duplicates what a shared base interface already provides, or that reinvents a convention another component already solved differently, is a signal to reuse or align, not to add a fourth way of doing the same thing.
- The component favors composition (`children`, paired child components) over a flat prop surface that tries to configure every variation — see [Composition Over Props Explosion](../architecture/component-patterns.md#composition-over-props-explosion). A props list trending toward numbered or repeated-shape props (`link1To`, `link2To`, ...) is a hard stop, not a nitpick.
- If the PR touches an existing component's public API, the change doesn't silently alter established behavior that other components or consuming apps rely on — check for a documented breaking-change note and correct [SemVer](../requirements/constraints.md#versioning) classification if so.

### Theme Compliance

- The component reads all color, spacing, and typography through theme tokens (CSS variables from `src/styles/themes.css`) or the `ood-*` utility classes — never a hardcoded hex value, `rgb()`, or a fixed spacing value that duplicates what a token already provides. See [Theme Compliance](../requirements/component-requirements.md#theme-compliance).
- The component's own CSS Module stays structural (layout, spacing that isn't a theme token, borders, cursor, states like `:hover`) and explicitly does not set color/background — those are left to `inherit` or otherwise deferred to the consumer's utility class. See [Styling Approach: CSS Modules + Utility Classes](../architecture/component-patterns.md#styling-approach-css-modules--utility-classes).
- The component renders correctly in every supported theme mode (light and dark at minimum) without a component-specific override. If the PR adds a new visual state, check it against both `Light` and `Dark` stories (and any custom theme story), not just the default.
- If the PR introduces a genuinely new, broadly-useful visual value, it's proposed as a new theme token (see [Theme System Architecture](../architecture/theme-system.md)) rather than embedded directly in the component — a one-off value bypasses the library's automated contrast validation.
- `npm run validate-themes` passes. A reviewer should not approve a PR that changes theme tokens, ramps, or component styling that touches color without confirming this ran clean.

### Testing Verification

- The component ships an automated Storybook test suite covering its meaningful states (default, disabled, error, loading, etc.), not just a story that renders it once with default props.
- Interaction tests use Storybook Play functions to simulate real user behavior (clicks, keyboard input, focus changes) and assert on the resulting state — a story that renders without throwing is not, by itself, a test.
- Accessibility testing is included in the same suite (not a separate, optional pass) and passes with zero violations.
- Visual regression coverage exists for the component so an unintended appearance change — including one introduced indirectly through a shared style or theme update — would be caught automatically, not just by a human noticing in review.
- If the PR changes shared styles or theme tokens, the reviewer checks whether other components' visual regression baselines are affected, not just the component the PR appears to target.

### Accessibility Requirements

- Run the full [Accessibility Checklist](./accessibility-checklist.md) against the component, not just a subset. In particular, confirm:
  - Semantic HTML is used, or correct ARIA role/state/properties if no semantic element applies.
  - The component is fully keyboard operable, with a visible, sufficiently-contrasted focus indicator and no keyboard trap.
  - Color contrast meets 4.5:1 (normal text) / 3:1 (large text, UI components) in every theme.
  - State changes are exposed to assistive technology (ARIA state attributes kept in sync, `aria-live` used where appropriate).
- Automated accessibility checks (axe-based) pass with zero violations — this is a blocking requirement, not a warning to note and move past.
- For new or significantly changed components, confirm the PR description or test evidence shows a manual keyboard-only pass and a screen reader spot check were done, per [Constraints — Accessibility](../requirements/constraints.md#accessibility). A component that only has automated coverage has not been fully accessibility-tested.

## Code Review Checklist

Work through this list on every pull request that adds or meaningfully changes a component. Use it alongside — not instead of — the fuller detail in the sections above and in the [Definition of Done](./definition-of-done.md), which governs whether the PR is ready to merge overall.

- [ ] **Semantic HTML** — correct native element used for the component's purpose; ARIA only supplements where no native element applies, never replaces it
- [ ] **TypeScript** — props interface is named `I<Component>Props`, extends the correct base interface, every prop is explicitly typed, no `any` anywhere, code compiles clean under `strict: true` with no local suppressions
- [ ] **Storybook tests** — meaningful states covered, Play-function interaction tests exercise real behavior (not just render-without-throwing), accessibility tests included in the same suite, visual regression coverage present
- [ ] **Accessibility** — keyboard operable with visible focus indicator, correct ARIA state/roles, contrast meets AA thresholds in every theme, automated a11y check passes with zero violations, manual pass evidenced for new/significant changes
- [ ] **No circular dependencies** — component doesn't import another component in a way that creates a cycle; shared logic used by multiple components lives in `src/lib/`, and dependency direction flows from components toward utilities/theme, never the reverse
- [ ] **No runtime dependencies without justification** — `package.json`'s `dependencies` gains nothing beyond React/React-DOM without an explicit, written justification in the PR description (what problem it solves, why native/React APIs can't solve it, its maintenance/security track record) — and even then, treat justification as necessary, not sufficient, for approval
- [ ] **File structure** — component, its CSS Module, and its types live together under `src/components/`; a matching `.stories.tsx` exists under `src/stories/`; the component and its props interface are exported from the library's public index
- [ ] **Theme compliance** — no hardcoded color/spacing/typography; CSS Module stays structural; component renders correctly in every supported theme
- [ ] **Documentation** — Storybook docs describe purpose, props (type, default, required/optional), and representative usage; any intentional deviation from standard patterns (non-forwarded attribute, non-standard theming) is called out explicitly, not left implicit
- [ ] **Bundle size** — the component's contribution to bundle size is proportionate to the functionality it adds; nothing defeats tree-shaking (no side-effectful module-level code)
- [ ] **`just gate` passes** — tests, linting, and type checking all pass in CI before merge is considered

## Red Flags to Catch

These warrant stopping a review and requesting changes even if everything else in the PR looks polished — they tend to be the issues that are cheap to fix at review time and expensive to fix after release, once consuming applications depend on the shipped behavior.

- **A `<div>` or `<span>` standing in for an interactive element** (`onClick` on a `<div>` styled like a button) instead of the native element, or ARIA bolted on top to compensate. This silently loses keyboard operability and the correct accessibility tree.
- **A new runtime dependency added without justification**, or added to `dependencies` when it should be a `devDependency` (or shouldn't exist at all). This is a security-surface decision, not a convenience one — see [Principle #3](../product/principles.md#3-minimal-third-party-dependencies-security-focused).
- **`any` used to silence a type error**, or `// @ts-ignore`/`// @ts-expect-error` used to route around strict mode instead of fixing the underlying type.
- **Hardcoded color, spacing, or typography values** that duplicate or bypass an existing theme token — especially colors, since these silently escape the library's automated contrast validation.
- **A component that only renders correctly in one theme** — no `Dark` story, or a `Dark` story that was never actually visually checked (contrast validation passing numerically doesn't guarantee visual coherence — see [Theme System Architecture](../architecture/theme-system.md)).
- **A circular import between components**, or a shared utility placed inside a component's own directory instead of `src/lib/`, so other components end up importing from a component rather than from a shared utility.
- **A props interface that reinvents `className`/`id`/`onClick`/`style`/`children`** instead of extending the shared base interfaces — or, conversely, a component that extends `IComponentProps` (with `children`) when it can never meaningfully render children and should extend `IChildlessComponentProps` instead.
- **Storybook stories that only cover the default/happy-path state** — no disabled, error, loading, or interaction-tested state, for a component whose real usage clearly has more than one meaningful state.
- **A Play-function test that renders and asserts nothing meaningful** — present to satisfy "a test exists" without actually simulating user interaction or asserting on resulting state.
- **A keyboard trap**, however unintentional — most commonly introduced by a misconfigured focus trap in an expandable/overlay component that never releases focus, or a custom widget that captures `Tab` without providing an escape path.
- **A missing or generic accessible name** on an icon-only or otherwise text-less control (`aria-label="button"` is as unhelpful as no label at all).
- **Props explosion** — a growing set of numbered or same-shaped props (`link1To`, `link2To`, ...) where composition (`children`, a paired child component) is the fitting solution instead.
- **An undocumented breaking change**, or a change classified as a Minor/Patch release when it actually breaks an existing prop's type or removes an export — see [Versioning](../requirements/constraints.md#versioning).
- **A deviation from standard patterns landing without an explicit justification and maintainer flag** — per [When to Deviate](../architecture/component-patterns.md#when-to-deviate), a non-standard shape should visibly stand out in review, not slip through as if it were routine.
