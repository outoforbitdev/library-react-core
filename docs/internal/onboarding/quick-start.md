# Quick Start

A 30-minute walkthrough that takes you from a fresh clone to an open pull request. It builds one small component (a `Badge`) end to end so you touch every part of the workflow: setup, component code, styling, a Storybook story, tests, and the commit/PR process.

If you want the bigger picture first, see [Repo Tour](./repo-tour.md) for how the codebase is organized, or the [FAQ](./faq.md) for quick answers to common questions.

## Before you start

You'll need:

- Node.js and npm installed
- [`just`](https://github.com/casey/just) installed (the command runner used for all repo tasks — see the [Justfile](../../../Justfile))
- [`pre-commit`](https://pre-commit.com/) installed (`just setup` installs the git hook, but the `pre-commit` binary itself must already be on your `PATH`)
- Git configured with your name/email

## 1. Clone the repo (1 minute)

```bash
git clone git@github.com:outoforbitdev/library-react-core.git
cd library-react-core
```

## 2. Run `just setup` (2 minutes)

```bash
just setup
```

This runs `npm install` and `pre-commit install`. The pre-commit hook enforces [Conventional Commits](https://www.conventionalcommits.org/) on your commit messages and runs `npm test`, `npx prettier --check .`, and `npx tsc --noEmit` before each commit — the same checks CI runs, so failures surface locally first.

See the full command list in the [Justfile](../../../Justfile) or the summary in [Repo Tour](./repo-tour.md#key-files).

## 3. Create a feature branch (1 minute)

```bash
git checkout -b your-name/badge-component
```

Branch naming isn't strictly enforced, but `<name>/<short-description>` matches the convention used across outoforbitdev repos. See [Development Process](../workflows/development-process.md) for the full git workflow.

## 4. Read how components are built (5 minutes)

Before writing code, read [Building Components](../components/building-components.md). It covers the anatomy of a component (props interface, `getDomProps`, CSS Module styling), walks through a Button-sized example, and lists common mistakes to avoid. Also skim [Component Patterns](../architecture/component-patterns.md) for the base interfaces (`IComponentProps`, `IChildlessComponentProps`) and helper functions every component uses.

## 5. Build a simple component: `Badge` (10 minutes)

Create `src/components/Badge.tsx`:

```tsx
import { getDomProps, IComponentProps } from "./IComponent";
import styles from "../styles/badge.module.css";

interface IBadgeProps extends IComponentProps {}

export function Badge(props: IBadgeProps) {
  return <span {...getDomProps(props, styles.badge)}>{props.children}</span>;
}
```

Create `src/styles/badge.module.css`:

```css
.badge {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.5;
  color: var(--ood-text);
  background-color: var(--ood-background);
}
```

`Badge` follows the same shape as every other component: it extends `IComponentProps` (it wraps `children`), it uses `getDomProps` to merge its own CSS Module class with any consumer-supplied `className`, and it reads color from the theme variables (`--ood-text`, `--ood-background`) rather than hardcoding a color, so it automatically works inside `ood-primary`, `ood-error`, or any other utility class. See [Theme System Architecture](../architecture/theme-system.md) if that indirection is unfamiliar.

Export it from `src/index.ts`, next to the other component exports:

```ts
export { Badge } from "./components/Badge";
```

## 6. Write a Storybook story (5 minutes)

Create `src/stories/Badge.stories.tsx`:

```tsx
import type { Meta, StoryObj } from "@storybook/react";

import { Badge } from "../components/Badge";

const meta = {
  title: "Example/Badge",
  component: Badge,
  tags: ["autodocs"],
  render: (args) => <Badge {...args}>New</Badge>,
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    className: "ood-primary",
  },
};

export const Error: Story = {
  args: {
    className: "ood-primary ood-error",
  },
};
```

Run Storybook to see it render and to eyeball it against both themes:

```bash
npm run storybook
```

Storybook opens at `http://localhost:6006`. Find "Example/Badge" in the sidebar. See [Testing Strategy](../quality/testing-strategy.md) for what Storybook's automated checks (visual regression, accessibility, interaction tests) expect from a story.

## 7. Run tests (2 minutes)

```bash
just test
```

`just test` runs `npm test` (theme validation) followed by `npx tsc --noEmit` (type checking). Run the full pre-merge gate — tests, lint, and type check — with:

```bash
just gate
```

Fix anything that fails before moving on. If Prettier complains, `just lint-write` auto-fixes formatting.

## 8. Commit (2 minutes)

```bash
git add src/components/Badge.tsx src/styles/badge.module.css src/stories/Badge.stories.tsx src/index.ts
git commit -m "feat: add Badge component"
```

The pre-commit hook enforces the [Conventional Commits](https://www.conventionalcommits.org/) format (`feat:`, `fix:`, `docs:`, etc.) and reruns tests, lint, and the type check. If the hook fails, fix the issue and commit again — see [Development Process](../workflows/development-process.md) for details.

## 9. Open a PR (2 minutes)

```bash
git push -u origin your-name/badge-component
```

Then open a pull request against `master`. CI re-runs the same gate (`just gate`) your pre-commit hook already ran, so a clean local run means a clean PR check. Before requesting review, run through the [Definition of Done](../quality/definition-of-done.md) checklist and skim [Review Guidelines](../quality/review-guidelines.md) so you know what a reviewer will look for.

## What's next

- [Repo Tour](./repo-tour.md) — get oriented in the rest of the codebase
- [Component Requirements](../requirements/component-requirements.md) — the full requirements checklist a real component must satisfy
- [Accessibility Checklist](../quality/accessibility-checklist.md) — WCAG 2.1 AA requirements every component must meet
- [FAQ](./faq.md) — quick answers to questions you'll hit next
