# Core Principles

These five principles govern every design decision made in `library-react-core`. They are not aspirational — they are prescriptive requirements. When a proposed change conflicts with one of these principles, the principle wins unless an explicit, documented exception is granted. Every pull request should be evaluated against this list, and reviewers should cite the relevant principle when requesting changes.

## 1. Accessibility by Default (WCAG 2.1 AA)

Every component ships accessible by default. Consuming applications must never need to add accessibility as an afterthought — it is built into the component before it ever reaches Storybook.

**What this means:**

- Components use semantic HTML elements (`<button>`, `<nav>`, `<input>`, etc.) instead of generic `<div>`/`<span>` elements dressed up to look interactive.
- Interactive elements carry correct ARIA roles, states, and properties when semantic HTML alone is insufficient to convey meaning.
- All interactive functionality is fully operable via keyboard alone — no mouse-only interactions.
- Color contrast between foreground and background meets or exceeds WCAG 2.1 AA thresholds in every theme the component supports.
- Components work correctly with screen readers: meaningful labels, announced state changes, and a sensible reading order.

**How we verify:**

- Automated accessibility testing runs as part of the Storybook test suite for every component.
- Manual testing (keyboard-only navigation, screen reader spot checks) is performed for new or significantly changed components.
- The PR review checklist includes an explicit accessibility sign-off before a component can be merged.

## 2. Consistent Design Language

One way to do something is always better than five. When multiple components solve similar problems in different ways, every consumer pays a tax in confusion, inconsistent UX, and duplicated learning. This library optimizes for a single, predictable way of doing things over flexibility for its own sake.

**What this means:**

- Components that solve similar problems use the same prop names and the same prop shapes (for example, every component that accepts children and standard DOM attributes extends the same shared prop interfaces).
- Styling is unified through the shared theme system and utility classes rather than one-off, component-specific styling approaches.
- Component behavior is predictable: a click handler behaves the same way across components, disabled state looks and behaves the same way everywhere, and so on.
- Visual consistency (spacing, typography, color usage) is maintained across the entire component set, not just within individual components.

**How we verify:**

- Code review explicitly checks new components against existing patterns and prop conventions before approval.
- Storybook serves as the living catalog of every component's appearance and behavior, making inconsistencies visible at a glance.
- The theme system is the single source of truth for color, spacing, and typography, preventing components from diverging with hardcoded values.

## 3. Minimal Third-Party Dependencies (Security-Focused)

The primary reason this library minimizes third-party dependencies is **security**, not performance. Every runtime dependency added to this library is a dependency every consuming application inherits, and every dependency is a potential vector for supply-chain vulnerabilities, malicious updates, and unpatched CVEs. Reducing the number and depth of dependencies directly reduces the library's vulnerability surface area. A smaller bundle size is a welcome secondary benefit of this discipline, not the reason for it.

**What this means:**

- The library avoids adding runtime dependencies whenever the same functionality can reasonably be built using native browser or React APIs.
- Native platform capabilities (native HTML form elements, native CSS features, native browser APIs) are preferred over pulling in a package to do the same job.
- Any proposed new runtime dependency must be explicitly justified in the pull request: what problem it solves, why it cannot be reasonably solved natively, and what its maintenance and security track record looks like.
- Development-only dependencies are held to a lighter but still deliberate standard — they should be well-maintained and widely used.

**How we verify:**

- `package.json` changes are reviewed specifically for new or updated dependencies as part of every relevant PR.
- New runtime dependencies require written justification in the PR description before they will be approved.
- Existing dependencies are kept up to date so that known vulnerabilities are patched promptly rather than accumulating.

## 4. High Performance (Prefer Native Features)

Components should be fast by construction, not fast because of after-the-fact optimization. The most reliable way to achieve this is to lean on the platform: native HTML and CSS are almost always faster, more robust, and better supported than a custom JavaScript reimplementation of the same behavior.

**What this means:**

- Animations and transitions are implemented with CSS wherever possible, rather than with JavaScript-driven animation.
- Native HTML form elements and their built-in behaviors are used instead of building custom replacements from generic elements.
- Components avoid unnecessary re-renders by keeping prop shapes stable, memoizing where appropriate, and avoiding unnecessary state.
- Components stay lightweight: minimal internal state, minimal computation on render, and no unnecessary work performed on every update.

**How we verify:**

- Bundle size is monitored over time so that regressions are caught before they reach consuming applications.
- Performance implications are an explicit part of PR review for any component with non-trivial rendering logic, animation, or state.

## 5. Comprehensive Testing for Regression Confidence

Every application that depends on this library trusts that a version bump will not silently break its UI. That trust is earned through comprehensive, automated testing. Automated Storybook tests are non-negotiable — they are what allows the library to change with confidence.

**What this means:**

- Every component has an automated Storybook test suite covering its important states and interactions before it is considered complete.
- Visual regression testing catches unintended appearance changes, including changes introduced indirectly through shared styles or the theme system.
- Accessibility testing is automated alongside functional testing, not treated as a separate, optional pass.
- Interaction testing verifies that components behave correctly in response to user actions (clicks, keyboard input, focus changes), not just that they render.

**How we verify:**

- The PR checklist requires passing Storybook tests before a component can be merged.
- CI/CD gates block merges when tests fail, so regressions cannot land on the default branch.
- A visual regression baseline is maintained and updated deliberately, so unintended visual changes are flagged rather than silently accepted.
