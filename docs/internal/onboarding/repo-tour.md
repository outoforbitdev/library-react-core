# Repo Tour

A map of the codebase: where things live and why. Read this after (or instead of) working through [Quick Start](./quick-start.md) if you'd rather orient yourself before writing code.

## Directory structure

```
library-react-core/
├── src/
│   ├── components/       # Component source (.tsx)
│   ├── styles/            # CSS Modules + theme CSS
│   ├── stories/            # Storybook stories (.stories.tsx, .mdx)
│   ├── lib/                # Small shared utilities, re-exported from the package
│   ├── index.ts             # Public API — every export the package ships
│   └── Globals.d.ts         # Ambient type declarations (e.g. *.module.css)
├── scripts/
│   └── themes/              # Theme ramp generation + validation (see below)
├── docs/
│   ├── internal/            # This documentation set
│   └── superpowers/         # Planning artifacts (specs, plans) for doc/feature work
├── .storybook/               # Storybook configuration
├── .linters/                  # Linter configuration
├── .pre-commit-config.yaml     # Git hook definitions (conventional commits, tests, lint, type check)
├── Justfile                     # Command runner — the canonical entry point for repo tasks
├── package.json                  # npm metadata, dependencies, and scripts
├── tsconfig.json                  # TypeScript compiler configuration
└── rollup.config.ts                # Build/bundling configuration
```

### `src/components/`

One component per file, PascalCase filenames matching the exported component name (`Button.tsx`, `NavBar.tsx`). Related components that form a family live in a subdirectory: `src/components/infobox/` (`Infobox`, `InfoboxRow`, `InfoboxSection`, `InfoboxTitle`) and `src/components/icons/` (one file per icon, see [Icon Library](../architecture/icon-library.md)).

`src/components/IComponent.tsx` is the foundation every other component builds on: it defines `IComponentProps`, `IChildlessComponentProps`, and the `getDomProps`/`combineClassNames` helpers. See [Component Patterns](../architecture/component-patterns.md) for the full contract.

### `src/styles/`

One CSS Module per component (`button.module.css`, `nav.module.css`, ...), plus the theme CSS that defines the semantic and swatch variable layers. Components read colors from theme variables (`--ood-text`, `--ood-background`, etc.) rather than hardcoding them — see [Theme System Architecture](../architecture/theme-system.md).

### `src/stories/`

Every component that ships in the public API has a matching `<Component>.stories.tsx` file here — this is both living documentation (Storybook's autodocs) and the automated test surface (visual regression, accessibility, interaction checks). `Configure.mdx` and `ThemeTest.stories.tsx` are Storybook-onboarding and theme-coverage artifacts rather than component docs. See [Testing Strategy](../quality/testing-strategy.md).

### `src/lib/`

Small utilities re-exported from the package under the `lib` namespace (`import { lib } from "@outoforbitdev/ood-react"`) — currently `classNames`, the standalone export of `combineClassNames`.

### `src/index.ts`

The single source of truth for the package's public API. Every component, type, and utility a consumer of `@outoforbitdev/ood-react` can import is exported here. If a component isn't exported from `index.ts`, it doesn't exist as far as the published package is concerned.

### `scripts/themes/`

The theme system's build-time machinery: `ramps.json`/`themes.json` define the source data, `ramps.ts`/`colors.ts`/`css.ts` generate CSS variables from it, `validate.ts` checks ramp/theme consistency (this is what `npm test` runs), and `types.ts`/`utils.ts` support the rest. See [Theme System Architecture](../architecture/theme-system.md) and [Adding a Theme](../workflows/adding-a-theme.md).

### `docs/internal/`

This documentation set. See [docs/internal/README.md](../README.md) for the full directory index (product, requirements, architecture, components, quality, workflows, onboarding).

## Key files

| File                                                          | Purpose                                                                                                                                                                                                      |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [`package.json`](../../../package.json)                       | Package metadata (`@outoforbitdev/ood-react`), dependencies, and npm scripts (`test`, `build`, `storybook`, `build-storybook`)                                                                               |
| [`tsconfig.json`](../../../tsconfig.json)                     | TypeScript compiler configuration — `strict: true`, JSX via `react-jsx`, ES module output                                                                                                                    |
| [`rollup.config.ts`](../../../rollup.config.ts)               | Build configuration: bundles `src/index.ts` to CJS and ESM (`dist/cjs`, `dist/esm`), inlines and minifies CSS, generates a rolled-up `.d.ts` file, and externalizes `react`/`react-dom` as peer dependencies |
| [`Justfile`](../../../Justfile)                               | The canonical entry point for every repo task — see [Commands](#commands) below                                                                                                                              |
| [`.pre-commit-config.yaml`](../../../.pre-commit-config.yaml) | Git hooks: conventional commit message enforcement, trailing-whitespace/EOF fixups, `npm test`, prettier check, `tsc --noEmit`                                                                               |
| `.storybook/main.ts`, `.storybook/preview.ts`                 | Storybook configuration                                                                                                                                                                                      |
| `src/Globals.d.ts`                                            | Ambient TypeScript declarations, notably typing for `*.module.css` imports                                                                                                                                   |

## Commands

Everything runs through `just` (defined in [Justfile](../../../Justfile)):

| Command           | What it does                                                                                                        |
| ----------------- | ------------------------------------------------------------------------------------------------------------------- |
| `just setup`      | `npm install` + `pre-commit install` — run this once after cloning                                                  |
| `just install`    | `npm install` only                                                                                                  |
| `just test`       | `npm test` (theme validation) + `npx tsc --noEmit`                                                                  |
| `just lint`       | `npx prettier --check .`                                                                                            |
| `just lint-write` | `npx prettier --write .` — auto-fixes formatting                                                                    |
| `just gate`       | `test` + `lint` + a second explicit `tsc --noEmit` — the full pre-merge check                                       |
| `just build`      | `npm run build` (theme validation, then Rollup bundling)                                                            |
| `just pack`       | Builds, packs a `.tgz`, and installs it into `library-galaxy-map` and `app-galaxy-map` for local cross-repo testing |

## Storybook

Storybook is the component workbench, live documentation, and automated test runner in one:

- **Location**: configuration in `.storybook/`, stories in `src/stories/`
- **Run it**: `npm run storybook` (dev server on port 6006) or `npm run build-storybook` (static build)
- **Purpose**: every shipped component has a story that doubles as its documentation page (via the `autodocs` tag) and as the surface Storybook's test runner exercises for visual regression, accessibility (axe), and interaction testing — see [Testing Strategy](../quality/testing-strategy.md)

## Testing setup

There is no separate unit-test framework in this repo. Correctness is enforced two ways:

1. **Theme validation** (`npm test` → `tsx scripts/themes/validate.ts`) — checks that the color ramp and theme definitions in `scripts/themes/` are internally consistent (every theme references a valid ramp step, no missing steps, etc.). This is also the first step of `npm run build`, so a broken theme definition fails the build, not just the test.
2. **Storybook tests** — visual regression, accessibility, and interaction checks run against the stories in `src/stories/`. Every component that ships needs a story; see [Testing Strategy](../quality/testing-strategy.md) for what's expected of it.

Type safety is enforced separately via `npx tsc --noEmit` (part of `just test` and `just gate`).

## Build process

`npm run build` runs `npm run validate-themes` (see above) and then `rollup -c --bundleConfigAsCjs`. Rollup, configured in [`rollup.config.ts`](../../../rollup.config.ts), produces two outputs from `src/index.ts`:

1. **JS + CSS bundle** — CJS (`dist/cjs`) and ESM (`dist/esm`) builds, with CSS inlined and minified, `react`/`react-dom` externalized as peer dependencies, and source maps generated.
2. **Type declarations** — a single rolled-up `dist/types.d.ts`, generated by `rollup-plugin-dts`.

`just pack` builds, packs the result as a `.tgz`, and installs it into sibling repos (`library-galaxy-map`, `app-galaxy-map`) for local integration testing before publishing.

## Where to go next

- [Quick Start](./quick-start.md) — build a real component end to end
- [Component Patterns](../architecture/component-patterns.md) — the base interfaces and helpers every component uses
- [Theme System Architecture](../architecture/theme-system.md) — how theming works under the hood
- [FAQ](./faq.md) — quick answers to common questions
