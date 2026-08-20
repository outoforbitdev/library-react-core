# Glossary

This glossary defines the key terms used throughout `library-react-core` documentation. It exists as a quick reference — consult it whenever a term in another document is unfamiliar.

- **Component** — A self-contained, reusable React element (for example, `Button`, `NavBar`, `Expandable`) that renders UI and exposes its configuration through props. In this library, one component lives in one file, follows the shared prop conventions, and is documented with a Storybook story.

- **Component Pattern** — The established, repeatable structure a component follows: its file layout, how it extends the shared prop interfaces, how it applies styling, and how it is exported. Following the component pattern is what makes a new component feel consistent with the rest of the library.

- **Prop** — A named input passed to a React component to configure its appearance or behavior (for example, `onClick`, `className`, `children`). Props are the primary API surface of every component in this library.

- **IComponentProps** — The base TypeScript prop interface most components in this library extend. It includes `children`, `className`, `id`, `onClick`, and `style`, giving every component a consistent, predictable base API.

- **IChildlessComponentProps** — A variant of `IComponentProps` for components that must not accept `children` (for example, a self-closing input element). It includes `className`, `id`, `onClick`, and `style`, but omits `children`.

- **Theme** — A named collection of design values — colors, spacing, typography — applied consistently across all components through CSS variables. Switching themes changes the library's appearance without changing any component code.

- **Color Ramp** — A set of related color values (typically stepped from light to dark, such as 100 through 900) generated from a single base color. Color ramps let the theme system produce a full, accessible palette from one input color per hue while keeping contrast relationships predictable.

- **Utility Class** — A small, single-purpose CSS class (for example, one that applies a specific spacing or color value from the theme) that components compose together for styling, rather than writing bespoke one-off CSS for common concerns.

- **CSS Module** — A CSS file (`*.module.css`) whose class names are automatically scoped to the component that imports it, preventing styles from leaking or colliding across components. This library pairs CSS Modules with theme-driven utility classes for its styling approach.

- **Story (Storybook)** — A single documented example of a component in a specific state or configuration, written using Storybook's story format. Stories serve simultaneously as living documentation and as the basis for automated tests.

- **Visual Regression Testing** — Automated testing that captures a component's rendered appearance and compares it against a known-good baseline, flagging any unintended visual change. This library relies on visual regression testing to catch styling regressions that unit tests would miss.

- **Accessibility (a11y)** — The practice of building components usable by people with disabilities, including those using screen readers, keyboard-only navigation, or assistive technology. "a11y" is the common numeronym abbreviation (the letters "a" and "y" with 11 letters between them).

- **Semantic HTML** — Using HTML elements according to their intended meaning (`<button>` for buttons, `<nav>` for navigation, `<label>` for form labels) rather than generic elements styled to look the part. Semantic HTML is the foundation this library's accessibility guarantees are built on.

- **Storybook** — The tool used to develop, document, and test components in isolation. Every component in this library has a corresponding set of Storybook stories that double as its documentation and its automated test suite.
