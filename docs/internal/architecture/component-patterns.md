# Component Patterns

This document is the technical reference for how components in `@outoforbitdev/ood-react` are built: the base interfaces every component extends, the helper functions that wire props to the DOM, the styling approach, and the conventions that keep the library consistent as it grows.

If [Architecture Overview](./overview.md) describes the layers of the library, this document describes the contract each component in the Component Layer must honor.

## Base Interfaces

Every component's props interface is built on one of two base interfaces defined in `src/components/IComponent.tsx`:

```typescript
import type { CSSProperties, MouseEventHandler, ReactNode } from "react";

export interface IChildlessComponentProps {
  className?: string;
  id?: string;
  onClick?: MouseEventHandler;
  style?: CSSProperties;
}

export interface IComponentProps extends IChildlessComponentProps {
  children?: ReactNode;
}
```

- **`IChildlessComponentProps`** — the floor every component sits on. It guarantees a consistent, minimal set of DOM-facing props: `className`, `id`, `onClick`, and `style`. Use this as the base for components that never render children (icons are the primary example).
- **`IComponentProps`** — extends `IChildlessComponentProps` with an optional `children: ReactNode`. Use this as the base for anything that can wrap content — the large majority of components in the library.

Picking the wrong base is a common review comment: if a component can never meaningfully render `props.children`, it should extend `IChildlessComponentProps`, not `IComponentProps`, so consumers don't get a `children` prop that silently does nothing.

## Helper Functions

Two small helpers, also in `src/components/IComponent.tsx` (and re-exported from `src/lib/`), do the repetitive work of turning props into DOM attributes.

```typescript
export function getDomProps(
  props: IComponentProps,
  ...args: (string | undefined)[]
) {
  return {
    className: combineClassNames(props.className, ...args),
    id: props.id,
    onClick: props.onClick,
    style: props.style,
  };
}

export function combineClassNames(...args: (string | undefined)[]) {
  const stringNames = args.filter((s) => (s?.length ?? 0) > 0).join(" ");
  return stringNames;
}
```

- **`combineClassNames`** — takes any number of possibly-`undefined` strings, filters out empty/undefined values, and joins the rest with a space. This is what lets a component merge its own CSS Module class with a consumer-supplied `className` (a theme utility class, typically) without producing `"undefined"` strings or doubled spaces.
- **`getDomProps`** — the standard way a component spreads props onto its root DOM element. It takes the component's own props plus any number of internal class names (usually CSS Module classes), combines them with `combineClassNames`, and returns an object with `className`, `id`, `onClick`, and `style` ready to spread.

Nearly every component root element looks like this:

```tsx
<button {...getDomProps(props, styles.button)}>{props.children}</button>
```

`getDomProps` always wins the argument order this way: `props` first, then the component's internal style module classes. This keeps a predictable, consistent ordering of the combined class string across the library.

`combineClassNames` is also exported standalone (as `classNames` from `src/lib/`) for the rare case where you need to combine class names outside of `getDomProps` — for example, computing a conditional class for a non-root element inside a component (see [NavBar's responsive class](#composition-over-props-explosion) below).

## Extending IComponentProps

To add component-specific props, declare a local interface that extends `IComponentProps` (or `IChildlessComponentProps`) and add only what's new. Do not redeclare `className`, `id`, `onClick`, `style`, or `children` — they're inherited.

```tsx
import { getDomProps, IComponentProps } from "./IComponent";
import styles from "../styles/button.module.css";

interface IButtonProps extends IComponentProps {
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

export function Button(props: IButtonProps) {
  return (
    <button
      disabled={props.disabled}
      {...getDomProps(
        props,
        styles.button,
        props.variant ? styles[props.variant] : undefined,
      )}
    >
      {props.children}
    </button>
  );
}
```

Notes on this pattern:

- The extended interface is named `I<Component>Props` and lives in the same file as the component (see [TypeScript Conventions](#typescript-conventions)).
- New props are optional (`?`) unless there's a strong reason a consumer must always provide them (compare to `INavLinkProps.to` in `src/components/NavLink.tsx`, which is required because a link without a destination isn't meaningful).
- Props that map directly to native HTML attributes (`disabled`, `href`, `to`, etc.) are passed straight through to the underlying element rather than reinvented.
- Props that affect styling (`variant` above) resolve to a CSS Module class and get folded into `getDomProps`, they don't become inline `style` overrides.

The real `Button` in `src/components/Button.tsx` doesn't yet have `variant`/`disabled` — the example above shows the target pattern for extending a component with custom props; use it as the template when adding new props to any component.

## Styling Approach: CSS Modules + Utility Classes

Components use two complementary styling mechanisms, and it's important not to blur them:

1. **CSS Modules** (`src/styles/*.module.css`) define a component's structure — layout, spacing, borders, cursor, states like `:hover`. These classes are scoped to the component and applied internally via `styles.<name>`, never by the consumer.
2. **Theme utility classes** (defined globally in `src/styles/themes.css`, applied by the consumer via `className`) drive theme-based appearance — color, background, and other values that come from the active theme's CSS variables. See [Theme System](../features/theme-system/) for how these variables and utility classes (`ood-primary`, `ood-accent`, `ood-error`, etc.) are generated.

`button.module.css` is a good example of a Module that intentionally stops short of color:

```css
.button {
  appearance: none;
  border: 2px solid;
  color: inherit;
  background-color: inherit;
  cursor: pointer;
}
```

Notice `color` and `background-color` are set to `inherit`, not to a fixed value. The Module handles structure (`appearance`, `border`, `cursor`); it deliberately leaves theming to whatever utility class the consumer applies.

A consumer then supplies the theme via `className`:

```tsx
<Button className="ood-primary">Submit</Button>
```

`getDomProps` combines the component's own Module class (`styles.button`) with the consumer's utility class (`ood-primary`) into a single `className` string, so the rendered button gets both the structural CSS and the theme's color variables.

**Rule of thumb:** if a style value should change when the theme changes (light/dark mode, primary/secondary/accent/error/warning/submit), it belongs in a utility class, not in the component's CSS Module. If a style value is structural and theme-independent, it belongs in the Module.

## Semantic HTML

Every component must render the semantic HTML element that matches its purpose, not a generic `<div>` styled to look the part. Semantic elements give screen readers, browsers, and search engines the correct built-in behavior and accessibility tree for free — this is a non-negotiable minimum per the library's [accessibility principles](../product/principles.md).

| Component purpose | Required element | Library example |
| --- | --- | --- |
| Clickable action | `<button>` | `Button` (`src/components/Button.tsx`) |
| Navigational link | `<a href="...">` | `NavLink` (`src/components/NavLink.tsx`) |
| Navigation container | `<nav>` | `NavBar` (`src/components/NavBar.tsx`) |
| Text input | `<input>` | (target pattern — see [form-patterns](../components/form-patterns.md)) |
| Form container | `<form>` | (target pattern — see [form-patterns](../components/form-patterns.md)) |
| Tabular data | `<table>` | `Infobox` (`src/components/infobox/Infobox.tsx`) |
| Table row | `<tr>` | `InfoboxRow` (`src/components/infobox/InfoboxRow.tsx`) |
| Vector graphic | `<svg>` | `Icon` (`src/components/icons/Icon.tsx`) |
| Generic grouping with no semantic role | `<div>` / `<span>` | `Expandable`'s wrapper (`src/components/Expandable.tsx`) |

`<div>` and `<span>` are not wrong — they're correct precisely when there is no more specific semantic element for the content's role (a generic layout wrapper, for instance). The rule is: reach for the semantic element first, and only fall back to a generic element when no semantic element fits.

## Composition Over Props Explosion

Components should stay composable — small, focused, and combined together — rather than growing a large flat prop surface that tries to configure every possible variation from one component.

**Good — composition.** `NavBar` doesn't take a `links` array prop with configuration for every possible link; it accepts `children` and lets the consumer compose `NavLink` elements into it:

```tsx
<NavBar home="/" homeLabel="Home">
  <NavLink to="/about">About</NavLink>
  <NavLink to="/contact">Contact</NavLink>
</NavBar>
```

`Expandable` is a similar example: it owns only the concerns that are actually its own (expand/collapse state, optional title) and renders whatever `children` the consumer gives it when expanded — it doesn't try to know what's inside.

**Bad — props explosion.** A hypothetical `NavBar` that instead tried to own every link's configuration through props would look like this:

```tsx
// Avoid this shape
<NavBar
  link1To="/about"
  link1Label="About"
  link1Icon="info"
  link2To="/contact"
  link2Label="Contact"
  link2Icon="mail"
  link3To="/pricing"
  // ...and so on, 20+ props deep, capped at an arbitrary max link count
/>
```

This shape doesn't scale (a fixed number of `linkN*` props caps how many links are possible), can't be extended by the consumer with anything the props didn't anticipate, and makes the component's own source harder to read and test. If a component's prop list is trending toward this — many props of the same shape, numbered or not, or props that only make sense in combination — that's a signal to introduce composition (children, or a paired child component) instead of more props.

## TypeScript Conventions

- **Interface naming** — all interfaces are prefixed with `I` (`IComponentProps`, `IButtonProps`, `INavLinkProps`). This distinguishes interfaces from types, components, and other symbols at a glance.
- **No `any`** — the use of `any` is prohibited anywhere in the library. If a type is genuinely unknown, model it precisely (a union, a generic, `unknown` with narrowing) rather than opting out of type checking.
- **Strict mode** — `tsconfig.json` sets `"strict": true`. All code must type-check under strict mode; do not weaken this setting to make a component compile.
- **One component per file** — each `.tsx` file exports exactly one public component (plus its co-located props interface and any small private helper functions it needs). `Button.tsx` exports `Button`; `NavLink.tsx` exports `NavLink` and `INavLinkProps`. This keeps components independently importable and keeps file size, and diff size, small.
- **Props interfaces are co-located** — a component's props interface (`I<Component>Props`) lives in the same file as the component, immediately above it, not in a shared types file.

## Common Patterns

**Optional children.** Most components extend `IComponentProps` and treat `children` as optional — components should render sensibly with no children, rather than requiring them:

```tsx
export function Infobox(props: IInfoboxProps) {
  return (
    <table {...getDomProps(props, styles.infobox)}>{props.children}</table>
  );
}
```

**Custom props with sensible defaults.** Optional custom props are resolved with `??` or a conditional at render time rather than requiring the consumer to always specify them:

```tsx
{props.home ? (
  <a href={props.home} {...getDomProps({}, styles.nav, styles.home)}>
    {props.homeLabel ?? "Home"}
  </a>
) : null}
```

**Theme-driven styling via className.** Components never hardcode theme colors. A component's own Module class handles structure; the theme is applied entirely through the `className` the consumer passes in, which `getDomProps` merges in:

```tsx
<Button className="ood-primary">Save</Button>
<Button className="ood-primary ood-warning">Delete</Button>
```

**Local state for self-contained behavior.** When a component owns transient UI state that isn't meant to be controlled by the consumer (an expand/collapse toggle, a responsive nav's open/closed state), it's kept in local `useState`, not lifted into props:

```tsx
const [expanded, setExpanded] = useState(false);
```

**Combining a conditional class outside the root element.** When a non-root part of a component needs a conditional class, `getDomProps`'s trailing arguments handle it the same way they do for the root:

```tsx
<nav
  {...getDomProps(props, styles.nav, responsive ? styles.responsive : "")}
>
```

## When to Deviate

The patterns above cover the large majority of components in this library. Some shapes of UI don't fit them cleanly:

- **Compound components** — a parent/child family that shares implicit state (`Infobox` / `InfoboxSection` / `InfoboxRow` / `InfoboxTitle` is the library's existing example: each piece is its own file and its own `IComponentProps`-based interface, coordinated by convention rather than a single monolithic component).
- **Complex forms** — multi-field forms with cross-field validation, async validation, or wizard-style multi-step flows may need state and prop shapes beyond what `IComponentProps` alone provides.
- **Components that must not accept arbitrary DOM props** — a small number of components (icons being the main case, via `IChildlessComponentProps`) intentionally restrict what a consumer can pass, and internal-only props (like `Icon`'s `externalProps`/`viewBoxSize`) exist purely for composition between library-internal files.

Deviating from the base interfaces, `getDomProps`, or the CSS Modules + utility class split is allowed, but it is a deliberate exception, not a default:

1. **Justify it.** The PR description must explain why `IComponentProps`/`IChildlessComponentProps` and `getDomProps` don't fit, not just that a different shape was more convenient.
2. **Get maintainer approval.** Deviations should be flagged for maintainer review explicitly — don't let a non-standard pattern land silently in a routine review pass.
3. **Keep the deviation local.** Prefer containing the non-standard shape to the specific component family that needs it (as with the `Infobox` compound components) rather than letting it spread to unrelated components.

When in doubt, default to the standard pattern. Deviations should be rare enough that seeing one signals to a reviewer that something genuinely didn't fit, not that the standard pattern was skipped for convenience.
