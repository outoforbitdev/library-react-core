# Testing Strategy

This document describes how `@outoforbitdev/ood-react` is tested. The strategy is deliberately shaped around what this library is: a visual, presentational component library, not a business-logic application. Testing therefore centers on **Storybook**, not on a conventional unit test suite.

## Storybook as the Primary Testing Platform

Storybook is the library's primary automated testing platform, not just a documentation tool. As described in the [Architecture Overview](../architecture/overview.md), stories are co-located with components in `src/stories/` using the `.stories.tsx` convention, and they serve three testing purposes at once:

1. **Visual regression testing** — Each story renders a component in a specific state/variant. Snapshotting these stories catches unintended visual changes (spacing, color, layout) before they reach consumers.
2. **Accessibility testing** — Stories are the unit under test for automated a11y checks (see Axe/Wave Integration below), run against real rendered DOM rather than a mocked test environment.
3. **Interaction testing** — Stories can drive user interactions (clicks, keyboard input, focus changes) against the rendered component and assert on the resulting DOM state, exercising the component the same way a consumer's browser would.

Because stories already need to exist for documentation and showcase purposes, testing through them avoids duplicating effort in a parallel test suite that would only re-describe the same states.

## What Tests to Write

For every component added or changed, contributors are expected to cover:

- **Each meaningful component variation.** Every prop combination that changes rendered output or behavior should have a corresponding story — size variants, color/theme variants, disabled/loading/error states, with-children/without-children, etc. If a variation isn't represented by a story, it isn't considered tested.
- **Interactive behavior.** Anything the component does in response to user input — click handlers firing, expandable sections opening/closing (`Expandable`), draggable behavior (`Draggable`), dropdown open/close (`NavDropdown`) — needs a story that exercises the interaction and verifies the resulting state, not just a story that renders the idle state.
- **Accessibility compliance.** Every component needs at least one story validated against automated a11y rules (see below), and interactive components additionally need keyboard-only interaction verified manually (see Testing Workflow).

A component is not considered done until its stories cover its variations, its interactive behavior, and its accessibility compliance.

## Axe/Wave Integration

Automated accessibility checks are run against components via **axe** rules integrated into the Storybook testing workflow, supplemented by manual **WAVE** checks during development:

- Every story is checked against axe's automated ruleset (color contrast, ARIA attribute correctness, label/name presence, landmark structure, focus order) as part of the Storybook test run.
- A story with an axe violation is treated the same as a failing test — it must be fixed before merge, not suppressed. If a violation is a false positive, it must be discussed and explicitly documented, not silently disabled.
- WAVE (Web Accessibility Evaluation Tool) is used as a secondary, manual check during component development in the browser, since it surfaces some structural and contrast issues that automated CI-style checks can miss and gives a visual overlay of the page's accessibility structure.
- New components should never be merged with unresolved axe violations on their default stories.

## Coverage Expectations

"Coverage" for this library is measured in terms of **story coverage**, not line/branch coverage:

- Every exported component must have at least one story.
- Every prop that materially changes appearance or behavior must be represented by at least one story (either as its own story or as a `Controls`-driven argType that a reviewer can exercise).
- Every interactive component must have at least one story demonstrating its interaction, and at least one story path verified with keyboard navigation and screen reader use (see Testing Workflow).
- There is no numeric line-coverage target (e.g. "80% coverage") for this library — a component with 100% line coverage but a single, unvarying story is considered under-tested, while a component with fewer lines but stories covering every variant, interaction, and a11y state is considered well-tested.

## Why No Unit Tests

This library intentionally does not maintain a conventional unit test suite (e.g. Jest/React Testing Library assertions on isolated components) as its primary testing mechanism. This is a deliberate choice, not an omission:

- The library is presentational — nearly all of its logic is "given these props, render this markup/styling," which is exactly what a rendered Storybook story and a visual/DOM snapshot already verify, without the overhead of maintaining a second, parallel test description of the same behavior.
- Testing through Storybook exercises components the way real consumers use them — as rendered React trees in a browser-like environment — rather than through a synthetic test renderer, which better catches real-world issues like actual CSS Module class application, real focus behavior, and real DOM structure.
- The library's `npm test` script (`validate-themes`) covers the one area of genuinely logic-heavy, non-visual code (theme/color ramp generation), which is exactly the kind of pure-logic code where a conventional test script is the right tool. That precedent is intentional: use conventional scripted tests for logic, use Storybook for components.
- If a future component introduces substantial non-visual logic (e.g. complex state machines, data transformation), a targeted unit test for that logic specifically is appropriate and should be added — the "no unit tests" stance applies to component testing, not to all code in the repository.

## Testing Workflow

Before opening a PR for a new or changed component, run through this workflow:

1. **Run Storybook locally.** `npm run storybook` (or `just` equivalent) to start the dev server and load the component's stories.
2. **Verify visually in the browser.** Check every story/variant renders as intended in both light and dark themes (stories support theme switching via the `data-theme` attribute, per the Architecture Overview), and that layout/spacing/typography match the design intent.
3. **Test keyboard navigation.** Tab through the component and confirm: focus is visible, focus order is logical, all interactive elements are reachable and operable via keyboard alone (Enter/Space to activate, Escape to dismiss where applicable, arrow keys for composite widgets like dropdowns), and focus doesn't get trapped or lost.
4. **Test with a screen reader.** Use a screen reader (e.g. VoiceOver on macOS) to confirm the component announces its role, name, and state correctly, and that interactions produce sensible announcements (e.g. expanded/collapsed state changes).
5. **Run the automated checks.** Confirm axe reports no violations on the component's stories, run `just lint` and `npx tsc --noEmit` (or `just gate` for the full suite), and run `npm test` to validate themes if the change touches styling.

Only once all five steps pass is the component considered ready for review.
