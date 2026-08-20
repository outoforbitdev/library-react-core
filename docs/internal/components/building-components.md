# Building Components

This document walks through building a component from nothing to merge-ready, using `Button` as the running example. For the underlying interfaces and helpers referenced throughout (`IComponentProps`, `getDomProps`, `combineClassNames`), see [architecture/component-patterns.md](../architecture/component-patterns.md) — this document shows how to *apply* those patterns, not what they are.

## Component Anatomy

Every component is made of three files, each with one job:

| File | Location | Responsibility |
| --- | --- | --- |
| **Component file** | `src/components/ComponentName.tsx` | The React component itself: props interface, JSX, and any component-local logic. Renders semantic HTML and wires props to the DOM via `getDomProps`. |
| **Styles file** | `src/styles/component-name.module.css` | Structural CSS only — layout, spacing, borders, cursor, `:hover`/`:focus` states. Never hardcodes theme colors; those come from consumer-supplied utility classes. |
| **Stories file** | `src/stories/ComponentName.stories.tsx` | Storybook stories demonstrating the component's states and variants. Doubles as living documentation and the basis for automated interaction/a11y/visual regression tests. |

A fourth step — exporting the component from `src/index.ts` — makes it part of the library's public API. A component isn't usable by consuming applications until this step is done, even if the other three files are complete.

## Step-by-Step: Building `Button`

This walks through building `Button` from scratch, in the order you'd actually do the work.

### 1. Create the component file

`src/components/Button.tsx`:

```tsx
import { getDomProps, IComponentProps } from "./IComponent";
import styles from "../styles/button.module.css";
import "../styles/themes.css";

interface IButtonProps extends IComponentProps {}

export function Button(props: IButtonProps) {
  return (
    <button {...getDomProps(props, styles.button)}>{props.children}</button>
  );
}
```

Notes on the choices made here:

- `Button` can render children (its label), so it extends `IComponentProps`, not `IChildlessComponentProps`.
- The root element is `<button>` — the semantic element for a clickable action (see the [semantic HTML table](../architecture/component-patterns.md#semantic-html)).
- `getDomProps(props, styles.button)` merges the component's own structural class (`styles.button`) with whatever `className` the consumer passes in (typically a theme utility class like `ood-primary`).
- The props interface is empty here because `Button` needs nothing beyond what `IComponentProps` already provides. An empty interface is still declared, not skipped, so the component has a named, exported type consumers can reference (`IButtonProps`) and so future props have somewhere to go.

### 2. Create the styles file

`src/styles/button.module.css`:

```css
.button {
  appearance: none;
  border: 2px solid;
  color: inherit;
  background-color: inherit;
  cursor: pointer;
}
```

This file only sets structural properties. `color` and `background-color` are `inherit`, not a fixed value — theming is deliberately left to whatever utility class (`ood-primary`, `ood-warning`, etc.) the consumer applies. See [Styling Approach](../architecture/component-patterns.md#styling-approach-css-modules--utility-classes) for the full rule.

### 3. Create the stories file

`src/stories/Button.stories.tsx`:

```tsx
import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "../components/Button";

const meta = {
  title: "Example/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  render: (args) => <Button {...args}>Press Me</Button>,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    className: "ood-primary",
  },
};

export const Warning: Story = {
  args: {
    className: "ood-primary ood-warning",
  },
};
```

Each named export is one story — one meaningful state or variant of the component. `tags: ["autodocs"]` generates a Storybook docs page automatically from the props interface and stories, so props documentation stays in sync with the actual component rather than being hand-written and left to drift.

### 4. Export it

Add `Button` to `src/index.ts`:

```typescript
export { Button } from "./components/Button";
```

If the component introduces a new props interface that consumers need to reference directly (for TypeScript typing their own wrapper components, for example), export the type too:

```typescript
export type { IButtonProps } from "./components/Button";
```

### 5. Test in Storybook

Run `npm run storybook` and confirm:

- The component renders correctly in every story/variant you wrote.
- Switching the Storybook theme toggle between light and dark mode doesn't break the component's appearance.
- Any interactive behavior (clicks, focus, keyboard input) works as expected when driven manually in the Storybook canvas.

Then add automated coverage: interaction tests (Play functions), and confirm the accessibility and visual regression addons report no issues for the new stories. See [quality/testing-strategy.md](../quality/testing-strategy.md) for what "enough" test coverage looks like.

### 6. Check accessibility

Before moving on, verify by hand, in addition to the automated a11y addon:

- The component is reachable and operable using only the keyboard (`Tab` to focus, `Enter`/`Space` to activate, as appropriate for its role).
- The focus indicator is visible and meets contrast requirements.
- The rendered element is the correct semantic element or has the correct ARIA role (a screen reader user should be able to tell what the component is and what it does from the accessibility tree alone).

See [quality/accessibility-checklist.md](../quality/accessibility-checklist.md) for the complete WCAG 2.1 AA checklist.

### 7. Verify against the Definition of Done

Before opening a PR, run through the full [Definition of Done](../quality/definition-of-done.md) checklist and run `just gate` (tests, linting, type checking) locally. A component isn't ready for review until every item on that checklist is satisfied — not just the ones covered above.

## Template

Use this as a starting point for a new simple component. Replace `ComponentName` and adjust the root element to whatever's semantically correct.

**`src/components/ComponentName.tsx`**

```tsx
import { getDomProps, IComponentProps } from "./IComponent";
import styles from "../styles/component-name.module.css";
import "../styles/themes.css";

interface IComponentNameProps extends IComponentProps {
  // Add component-specific props here. Keep them optional unless a
  // consumer must always provide a value for the component to be
  // meaningful (see component-patterns.md#extending-icomponentprops).
}

export function ComponentName(props: IComponentNameProps) {
  return (
    <div {...getDomProps(props, styles.componentName)}>
      {props.children}
    </div>
  );
}
```

**`src/styles/component-name.module.css`**

```css
.componentName {
  /* Structural styles only — no hardcoded colors. */
}
```

**`src/stories/ComponentName.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react";

import { ComponentName } from "../components/ComponentName";

const meta = {
  title: "Example/ComponentName",
  component: ComponentName,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
```

Remember to replace the placeholder `<div>` root element with whatever semantic element actually matches the component's purpose — `<div>` is only correct here as a generic template default, not as a recommendation. See the [semantic HTML table](../architecture/component-patterns.md#semantic-html) before you commit to a root element.

## Common Mistakes to Avoid

These are the issues that come up most often in review:

- **Wrong base interface.** Extending `IComponentProps` on a component that can never meaningfully render `children` (leaving a dead `children` prop consumers might try to use) — or the reverse, extending `IChildlessComponentProps` on something that should accept content. Pick based on whether `props.children` is ever actually rendered.
- **Hardcoded theme values.** Setting a fixed `color`, `background-color`, or spacing value in a CSS Module instead of leaving it to `inherit`/structural defaults and a consumer-supplied utility class. This breaks theme switching and duplicates values the theme system already provides.
- **Replacing instead of merging `className`.** Using `className={styles.button}` directly instead of `getDomProps(props, styles.button)` silently drops any `className` the consumer passed in, breaking theming entirely.
- **`<div>`/`<span>` soup.** Reaching for a generic element out of habit when a semantic one exists (`<button>`, `<nav>`, `<a>`, `<label>`, etc.). Check the [semantic HTML table](../architecture/component-patterns.md#semantic-html) before defaulting to a generic wrapper.
- **Forgetting the `src/index.ts` export.** A component that isn't exported doesn't exist as far as consuming applications are concerned, even if it's fully built and tested.
- **No stories, or stories that don't match reality.** Shipping a component without Storybook coverage, or with stories that don't reflect its actual current props (stale stories left over from an earlier version of the component).
- **Props explosion instead of composition.** Adding more and more flat props to configure every variation, instead of accepting `children` and letting the consumer compose. See [Composition Over Props Explosion](../architecture/component-patterns.md#composition-over-props-explosion).
- **Skipping the manual accessibility pass.** Automated a11y checks catch a meaningful subset of issues, not all of them (they can't tell you whether the tab order makes sense, for example). Treat the automated check as a floor, not a substitute for actually tabbing through the component.
