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

## Repository Compliance

This repository follows the outoforbitdev [Repository Guidelines](../.github/docs/REPOSITORY_GUIDELINES.md).
