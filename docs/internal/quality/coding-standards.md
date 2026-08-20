# Coding Standards

This document defines the coding standards for the `@outoforbitdev/ood-react` component library. These standards keep the codebase consistent, predictable, and easy for contributors to work in regardless of which component they're touching.

## Language

The library is written entirely in **TypeScript**. Plain `.js`/`.jsx` files are not accepted for source code.

- **Strict mode is mandatory.** `tsconfig.json` sets `"strict": true`, and this must not be weakened or overridden on a per-file basis (no `// @ts-nocheck`, no `// @ts-ignore` used to silence a real type error).
- **`any` is not allowed.** Every value, prop, and return type must be properly typed. If a type is genuinely unknown (e.g. data crossing a serialization boundary), use `unknown` and narrow it, rather than reaching for `any`.
- Prefer explicit types on exported functions and component props. Type inference is fine for local variables, but public APIs should have their types spelled out so consumers get accurate autocomplete and documentation from the `.d.ts` output.
- Target output is `es5` per `tsconfig.json`, so avoid relying on syntax or runtime features that don't transpile cleanly for the library's supported consumers.

## Formatting

Formatting is enforced by **Prettier** using the shared config at `.linters/config/.prettierrc`. There is no separate ESLint style layer — Prettier is the single source of truth for formatting.

- Run `just lint` (or `npx prettier --check .`) to verify formatting before committing.
- Run `just lint-write` to auto-fix formatting issues.
- Do not hand-tune whitespace, quote style, or line breaks to disagree with what Prettier produces — if Prettier's output looks wrong, that's a config discussion, not a per-file override.
- The `.prettierignore` rules at `.linters/config/.prettierignore` apply; don't add new ignore patterns without discussion.
- Formatting is checked automatically by the `npm-lint` pre-commit hook (see `.pre-commit-config.yaml`), so a properly configured local environment (`just setup`) will catch violations before they reach a commit.

## Component Conventions

- **One component per file.** Each React component gets its own file named after the component (e.g. `Button.tsx` exports `Button`). Don't bundle multiple unrelated components into a single file.
- **Use the `.tsx` extension** for any file containing JSX. Plain TypeScript modules with no JSX (utilities, type-only files) use `.ts`.
- **Styling is done with CSS Modules.** Component styles live in `src/styles/*.module.css` (e.g. `button.module.css`, `expandable.module.css`) and are imported into the component that uses them. Don't use inline styles for anything beyond consumer-provided `style` props, and don't introduce a CSS-in-JS or utility-class framework — CSS Modules is the library's one styling mechanism.
- Components that form a related family (e.g. `Infobox`, `InfoboxTitle`, `InfoboxSection`, `InfoboxRow`) are grouped in a subdirectory under `src/components/` (see `src/components/infobox/`), with each still following the one-component-per-file rule.
- Every component should accept and forward the shared base props (`className`, `id`, `onClick`, `style`) via `IComponentProps` / `IChildlessComponentProps` and `getDomProps` from `src/components/IComponent.tsx`, so consumers get consistent, composable behavior across the library.

## Interfaces and Types

- **Interfaces are prefixed with `I`.** For example, `IComponentProps`, `IChildlessComponentProps`. This makes it immediately clear at a glance whether a symbol is an interface, and keeps naming consistent with the rest of the codebase (see `src/components/IComponent.tsx`).
- Plain type aliases (`type Foo = ...`) don't take the `I` prefix — the prefix is reserved for `interface` declarations describing object shapes, especially component props.
- **Public types must be exported.** Any interface or type that is part of a component's public API (props, return values of exported hooks/utilities) must be exported from its module and re-exported through the library's public entry point so consumers get full type information from `dist/types.d.ts`. Internal-only types stay unexported.
- Favor composing shared interfaces (like `IComponentProps`) over duplicating the same prop shapes across components.

## Commits

Commit messages follow the **Conventional Commits** specification, enforced by commitlint (`@commitlint/config-conventional`, configured at `.linters/config/commitlint.config.js`) and the `conventional-pre-commit` git hook.

- Format: `<type>(<optional scope>): <description>`, e.g. `feat(button): add loading state`, `fix(navbar): correct focus trap on close`, `docs: add coding standards and testing strategy`.
- Common types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `build`, `ci`.
- Keep the description concise and in the imperative mood ("add", not "added" or "adds").
- Commit messages are validated automatically by the git hooks installed via `just setup`; a non-conforming message will be rejected at commit time.

## Dependencies

- **No new runtime dependencies without discussion.** The library's only runtime dependencies are `react` and `react-dom`, declared as peer dependencies. Adding any other package to `dependencies` (not `devDependencies`) requires explicit discussion with maintainers before it's introduced, since every runtime dependency is inherited by every consuming application.
- Build tooling, testing tooling, linters, and Storybook itself belong in `devDependencies` and are not subject to the same restriction, but should still be justified by a real need rather than convenience.
- Before proposing a new runtime dependency, first consider whether the functionality can be implemented directly in the library (as with the small `combineClassNames` helper in `IComponent.tsx`) to avoid the added weight and version-management burden for consumers.
