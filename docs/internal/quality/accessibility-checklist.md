# Accessibility Checklist

Accessibility is not a review pass bolted onto a finished component — it is [Principle #1](../product/principles.md#1-accessibility-by-default-wcag-21-aa) of this library. A component that fails any of the requirements below is not complete, regardless of how well it otherwise matches its design. This document turns that principle into a concrete, testable checklist: what the WCAG 2.1 AA floor requires, how to satisfy it for keyboard, ARIA, contrast, and semantics, how screen readers should experience the component, how to test all of it, and a final checklist to run against every component before it ships.

If you're extending an existing component, re-run this checklist for the parts you touched — accessibility regressions are usually introduced by a "small" prop addition, not a rewrite.

## WCAG 2.1 AA Minimum Requirements

WCAG 2.1 Level AA is the floor for every component in `@outoforbitdev/ood-react`, not a target to approach. It is organized around four principles — content must be **P**erceivable, **O**perable, **U**nderstandable, and **R**obust (POUR):

- **Perceivable** — information and UI components must be presentable to users in ways they can perceive. Covers color contrast, text alternatives for non-text content, and content that doesn't rely on color alone to convey meaning.
- **Operable** — UI components and navigation must be operable. Covers full keyboard operability, no keyboard traps, and enough time for users to read and use content.
- **Understandable** — information and UI operation must be understandable. Covers predictable behavior, consistent identification of components with the same function, and clear labeling.
- **Robust** — content must be robust enough to be interpreted reliably by a wide variety of user agents, including assistive technology. Covers valid markup and correct name/role/value exposure for custom UI.

Because this is a component library consumed by other applications, AA compliance at the component level is necessary but not sufficient for a consuming app to be AA compliant end-to-end — page-level concerns (skip links, heading order across a whole page, focus management between routes) are the consuming application's responsibility. What this library guarantees is that every component it ships is accessible in isolation and does not introduce a barrier the consuming application would have to work around.

## Keyboard Navigation

All interactive functionality must be operable via keyboard alone. There is no exception for "mouse-only" interactions in this library — if a mouse can trigger it, a keyboard must be able to trigger it too.

- **Tab order follows visual/logical order.** A component's interactive elements are reachable via `Tab` (forward) and `Shift+Tab` (backward) in an order that matches how the component reads visually. Do not use positive `tabIndex` values to force an order — fix the DOM order instead.
- **Every interactive element is focusable.** Native interactive elements (`<button>`, `<a href>`, `<input>`) are focusable by default; don't strip that with `tabIndex="-1"` unless the element is intentionally excluded from the tab sequence (for example, a decorative or duplicate control).
- **Non-native interactive elements need explicit `tabIndex="0"`.** If a component genuinely cannot use a native interactive element (rare — see [Semantic HTML](#semantic-html) below), any element given an interactive ARIA role must also get `tabIndex="0"` so it joins the natural tab order.
- **Activation works with both `Enter` and `Space`.** Native `<button>` elements get this for free. A non-native interactive element must implement both key handlers explicitly — implementing only one is a common, easy-to-miss bug.
- **Visible focus indicator.** Every focusable element shows a visible focus indicator when focused via keyboard, and that indicator's contrast meets the 3:1 minimum required for UI components (see [Color Contrast](#color-contrast)). Do not suppress the default focus outline (`outline: none`) without replacing it with an equally visible alternative.
- **No keyboard traps.** Focus must always be able to move away from a component using standard keyboard navigation (`Tab`, `Shift+Tab`, or `Escape` for components that open an overlay). A component that captures focus and never releases it — even unintentionally, through a misconfigured focus trap in a modal or expandable — fails this requirement outright.
- **Escape closes dismissible UI.** Any component that opens transient UI (a menu, a popover, an expanded panel meant to be dismissible) closes on `Escape` and returns focus to the control that opened it.
- **Arrow keys for composite widgets.** Components that represent a single composite control with multiple focusable parts (a tab list, a radio group) use arrow keys to move between parts, following the [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) pattern for that widget type, rather than requiring `Tab` to step through every part individually.

## ARIA Usage

ARIA supplements semantic HTML — it never replaces it. The first rule of ARIA is: if a native HTML element or attribute already has the semantics and behavior you need, use it instead of adding an ARIA role to a generic element. Reach for ARIA only when no semantic element expresses the component's role.

- **Proper semantic roles.** When a component's role isn't conveyed by a native element (a custom tab panel, a custom combobox), assign the correct `role` from the ARIA spec and implement the full set of required states/properties for that role, not just the role attribute alone. An incomplete ARIA pattern (a `role="tab"` with no `aria-selected`, for example) is often worse than no ARIA at all, because it advertises a contract to assistive technology that the component doesn't fulfill.
- **`aria-label` for controls without visible text.** Any interactive element whose accessible name isn't already supplied by visible text content (an icon-only button, for example) must have an `aria-label` describing what it does, not just what it looks like ("Close", not "X icon").
- **`aria-labelledby` to reuse existing visible text as a label.** When a visible heading or text node elsewhere in the component already says what a region or control is, reference it with `aria-labelledby` instead of duplicating the string into a fresh `aria-label`.
- **`aria-describedby` for supplementary description.** Helper text, validation error messages, and hints that add context beyond the accessible name are connected with `aria-describedby`, so assistive technology announces them alongside the control rather than requiring the user to discover them separately.
- **State reflected in ARIA attributes, not just visual styling.** Any state a sighted user perceives visually (expanded/collapsed, selected, disabled, invalid, pressed) must have a corresponding ARIA attribute (`aria-expanded`, `aria-selected`, `aria-disabled`, `aria-invalid`, `aria-pressed`) kept in sync with that visual state. `Expandable`'s toggle, for example, must expose `aria-expanded` on the trigger, updated whenever local expand/collapse state changes.
- **Don't add redundant ARIA to native elements.** A `<button>` does not need `role="button"`; a `<nav>` does not need `role="navigation"`. Redundant ARIA adds noise for screen reader users and risk if it ever drifts out of sync with the element's native semantics.
- **`aria-hidden` for purely decorative content.** SVG icons and other decorative visuals that add no information beyond what's already conveyed by adjacent text are marked `aria-hidden="true"` so screen readers skip them, rather than being announced as unlabeled or generically-labeled content.

## Color Contrast

- **4.5:1 minimum for normal text** against its background, in every theme mode the library supports (light and dark, at minimum, and any custom theme added later).
- **3:1 minimum for large text** (18pt/24px regular weight or larger, or 14pt/18.66px bold or larger) and for UI components/graphical objects (borders that convey meaning, icons that stand alone as controls, the visible boundary of a focus indicator).
- **Never rely on color alone.** Any distinction conveyed by color (an error state, a required field, a selected item) must also be conveyed through at least one other channel — text, an icon, an underline, a pattern — so the distinction survives for users who can't perceive the color difference.
- **Contrast is validated automatically, not eyeballed.** This library generates its color tokens through a ramp system (see [Theme System Architecture](../architecture/theme-system.md)) and validates every semantic contrast pair — text against background, text against block backgrounds, links, error/warning/submit states — with `npm run validate-themes`. A component must consume theme tokens (never a hardcoded color) precisely so it inherits this validation automatically; introducing a one-off color value bypasses contrast validation entirely and is not permitted (see [Theme Compliance](../requirements/component-requirements.md#theme-compliance)).
- **Focus indicators meet the 3:1 UI-component threshold** against both the unfocused and focused background they appear on.

## Semantic HTML

Semantic HTML is the first and cheapest accessibility win available — native elements come with keyboard behavior, focus management, and an accessibility-tree role built in, for free, without a single line of ARIA. See the full table of required elements per component purpose in [Component Patterns — Semantic HTML](../architecture/component-patterns.md#semantic-html); the accessibility-specific rules are:

- **Use the native element that matches the component's purpose** — `<button>` for actions, `<a href>` for navigation, `<nav>` for navigation regions, `<input>`/`<label>`/`<form>` for form fields, `<table>`/`<tr>`/`<th>`/`<td>` for tabular data — rather than a `<div>` or `<span>` styled and scripted to imitate one.
- **A styled `<div>` pretending to be a button is a defect, not a style choice.** It loses native keyboard operability, focus behavior, and the implicit `role="button"` an assistive technology would otherwise get for free, all of which then have to be manually and imperfectly reconstructed with ARIA and JavaScript.
- **`<div>`/`<span>` are correct when there is genuinely no semantic role** — a layout wrapper, a generic grouping element with no meaning of its own (`Expandable`'s outer wrapper is the library's example). The rule is "reach for the semantic element first," not "never use `<div>`."
- **Labels are programmatically associated with their form controls** (`<label for="...">` matched to the input's `id`, or the input nested inside the `<label>`), so a screen reader announces the label when the field receives focus.
- **Heading levels and list structures are used correctly** wherever a component renders structural content, so the DOM outline makes sense independent of how it's styled.

## Screen Reader Support

- **Every interactive element has an accessible name.** Whether from visible text content, `aria-label`, or `aria-labelledby`, a screen reader user must be able to tell what a control does without seeing it.
- **State changes are announced.** When a component's internal state changes in a way a sighted user would notice (an `Expandable` opening, a validation error appearing, a loading state resolving), that change must be perceivable to a screen reader — through the relevant ARIA state attribute changing (`aria-expanded`, `aria-invalid`) and, where the change isn't already tied to something the user just activated, through an `aria-live` region so the change is announced even though focus didn't move.
- **`aria-live` is used sparingly and at the right politeness level.** `aria-live="polite"` for informational updates that shouldn't interrupt (a saved confirmation); `aria-live="assertive"` only for updates that genuinely need immediate attention (a blocking error). Overusing live regions creates noise that trains screen reader users to tune the component out.
- **Reading order matches visual order.** The DOM order a screen reader traverses linearly must match the order a sighted user would visually scan, even when CSS repositions elements visually (`order`, `flex-direction: row-reverse`, absolute positioning). Don't let visual layout and DOM order silently diverge.
- **Decorative content is hidden, informative content is not.** See [`aria-hidden` for purely decorative content](#aria-usage) above — the flip side is making sure nothing informative gets accidentally hidden this way.

## Testing Approach

Accessibility is verified at three levels, and all three are required — no single one catches everything.

### Automated (axe / WAVE)

- Automated accessibility checks run as part of the component's Storybook test suite, using an axe-core-based checker (`@storybook/addon-a11y` or an equivalent Storybook accessibility addon wired into the test runner). Any violation reported at this level blocks the component from being considered complete — see the [Definition of Done](./definition-of-done.md).
- Automated tools (axe, WAVE) catch a meaningful subset of issues reliably — missing labels, insufficient contrast, invalid ARIA usage, missing form labels — but they cannot verify logical tab order, whether an `aria-label` is actually meaningful, or whether a screen reader announcement makes sense in context. Automated passing is a floor, not proof of full accessibility.
- Run WAVE (or the equivalent browser extension) against a component's live Storybook rendering as a second automated pass, independent of the axe-core check embedded in the test suite — the two tools have different rule sets and occasionally catch different issues.

### Manual testing

- **Keyboard-only pass.** Unplug the mouse, mentally or literally, and operate the entire component using only `Tab`, `Shift+Tab`, `Enter`, `Space`, `Escape`, and arrow keys where applicable. Confirm every interactive affordance is reachable, every action is triggerable, focus is always visible, and there is no keyboard trap.
- **Zoom and reflow.** Check the component at 200% browser zoom and confirm content reflows without loss of functionality or horizontal scrolling of the whole page.
- **Color-only check.** Temporarily view the component in grayscale (a browser devtools filter, or an actual grayscale/color-blindness simulation) and confirm every state distinction the component conveys is still perceivable.

### Screen reader testing

- Test new or significantly changed components with at least one screen reader — VoiceOver (macOS/iOS, built in) is the most accessible baseline for local development; NVDA (Windows, free) is recommended when feasible for broader coverage.
- Confirm: every control announces a meaningful name and role, state changes are announced, reading order matches visual order, and nothing informative is silently skipped (and nothing decorative is announced as noise).
- Manual keyboard and screen reader testing is required for **new or significantly changed components** per [Constraints — Accessibility](../requirements/constraints.md#accessibility); routine, purely visual changes to an already-verified component don't require a full re-pass, but any change that touches interaction, state, or markup does.

## Checklist for Every Component

Run this list before marking any component complete, and again for any pull request that changes a component's markup, interaction, or state:

- [ ] Uses the correct native semantic HTML element for its purpose (or the correct ARIA role plus full state/property set, if no native element applies)
- [ ] Every interactive element is reachable and operable via keyboard alone (`Tab`, `Enter`/`Space`, `Escape`/arrow keys as applicable)
- [ ] Tab order matches visual/logical order; no positive `tabIndex` used to force it
- [ ] Visible focus indicator present on every focusable element, meeting 3:1 contrast
- [ ] No keyboard trap — focus can always move away using standard navigation
- [ ] Every control has an accessible name (visible text, `aria-label`, or `aria-labelledby`)
- [ ] Supplementary text (hints, errors) is connected via `aria-describedby`
- [ ] All perceivable state (expanded, selected, disabled, invalid, pressed) has a matching ARIA attribute kept in sync
- [ ] No redundant ARIA on elements whose native semantics already provide it
- [ ] Purely decorative content (icons with adjacent text) is `aria-hidden`
- [ ] Text meets 4.5:1 contrast; large text and UI components meet 3:1, in every supported theme
- [ ] No information is conveyed by color alone
- [ ] Component consumes only theme tokens for color (no hardcoded values bypassing contrast validation)
- [ ] State changes are announced to screen readers (via ARIA state changes and/or `aria-live` where appropriate)
- [ ] Reading order (DOM order) matches visual order
- [ ] Automated accessibility check (axe-based Storybook test) passes with zero violations
- [ ] Manual keyboard-only pass completed for new/significantly changed components
- [ ] Manual screen reader spot check completed for new/significantly changed components
- [ ] `npm run validate-themes` passes for every theme the component is rendered in
