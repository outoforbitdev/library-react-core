# Agent Context for library-react-core

## Repository Overview

**library-react-core** is a reusable React component library that builds the npm package `@outoforbitdev/ood-react`. This is a foundational library used by other applications in the outoforbitdev organization.

## Key Commands

- **`just setup`**: Initialize the repository with dependencies and git hooks
- **`just install`**: Install dependencies only
- **`just build`**: Build the library (validates themes + rollup bundling)
- **`just test`**: Run the test suite
- **`just lint`**: Run code style checks with prettier
- **`just lint-write`**: Auto-fix code style issues
- **`just gate`**: Run full verification (tests, linting, type checking)
- **`npm run storybook`**: Start Storybook for component development and documentation

## Development Guidelines

- This is a component library, not an application
- Components should be reusable and well-documented in Storybook
- Follow the monorepo structure: uses TypeScript, Rollup for bundling
- Git hooks enforce conventional commits via pre-commit framework
- All PRs require passing tests, linting, and type checking

## Contributor Documentation

**All contributors should read the internal documentation in `docs/internal/`:**

- **[Product Vision & Principles](docs/internal/product/) — Start here** to understand the library's goals and core principles (accessibility, consistency, minimal dependencies, performance, testing)
- **[Architecture](docs/internal/architecture/) — Technical foundation** covering theme system (critical: color ramp cascade constraint), component patterns, icon library
- **[Component Building Guide](docs/internal/components/)** — Step-by-step how to build components, with real examples
- **[Quality Standards](docs/internal/quality/)** — Coding standards, testing strategy, accessibility checklist, code review guidelines, definition of done
- **[Workflows](docs/internal/workflows/)** — Git workflow, how to safely add themes
- **[Onboarding](docs/internal/onboarding/)** — Quick-start for new contributors (30 minutes)

Key constraint: **Color ramp changes in the theme system cascade to all themes** — see `docs/internal/architecture/theme-system.md`

## Repository Compliance

This repository follows the outoforbitdev [Repository Guidelines](../.github/docs/REPOSITORY_GUIDELINES.md).
