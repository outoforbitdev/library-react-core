# Development Process

This document describes the day-to-day git workflow for `@outoforbitdev/ood-react`: branching, commit conventions, the pull request process, CI gates, and review approval. Follow it for any change to the library, including documentation-only changes.

## 1. Overview

Development is issue-driven. Every change starts from a GitHub issue and lands on `main` through a reviewed pull request. There is no direct push to `main` — CI and review both gate the merge.

```
issue → branch → commits (conventional) → PR → CI checks → review approval → merge → release
```

## 2. Branching

Branch from `main` for every change, including docs.

### Naming convention

```
<github-username>/<issue-number>-<short-slug>
```

Examples from this repo's history:

- `jaymirecki/28-repo-compliance`
- `jaymirecki/32-theme-script`
- `jaymirecki/35-add-scorecard-dispatch`

The issue number ties the branch back to the tracked work; the slug is a short, human-readable description (a few words, hyphenated). Dependabot branches are the one exception — they're created and named automatically (`dependabot/npm_and_yarn/...`).

### Keeping branches current

Rebase or merge `main` into your branch as needed to avoid a large, stale diff by the time you open a PR. Prefer small, focused branches — one issue, one branch, one PR — over long-lived branches that accumulate unrelated work.

## 3. Conventional Commits

Every commit message must follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>
```

**Types in use in this repo:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`.

```
feat(button): add loading state
fix(theme): correct contrast ratio for dark accent-block
docs(workflows): add development process guide
chore(deps): bump storybook to 10.1.4
```

### Enforcement

Commit messages are validated locally, not just in CI:

- `.pre-commit-config.yaml` runs `conventional-pre-commit` on the `commit-msg` hook.
- `.linters/config/commitlint.config.js` extends `@commitlint/config-conventional`.

Run `just setup` (or `pre-commit install --hook-type commit-msg`) once after cloning so the hook is active locally — a non-conforming commit message will be rejected before it's created, not caught later in review.

### Commit hygiene

Keep commits small and scoped to one logical change. A commit that mixes a ramp edit with an unrelated component fix makes both harder to review and to revert independently.

## 4. Local Verification Before Opening a PR

Run the same checks CI will run, locally, before pushing:

```bash
just gate       # test + type-check (also runs lint via the `test` recipe path — see justfile)
just lint       # npx prettier --check .
just test       # npm test (theme validation) + tsc --noEmit
```

`npm test` runs `npm run validate-themes`, which regenerates `src/styles/themes.css` and checks every theme's contrast pairs — see [Theme System Architecture](../architecture/theme-system.md) for what this validates and why it can fail even when your change looks unrelated to color.

## 5. Pull Request Process

1. **Open the PR against `main`** using the organization's [pull request template](https://github.com/outoforbitdev/.github/blob/main/.github/PULL_REQUEST_TEMPLATE.md), which requires:
   - A summary of the change.
   - A description of how it was tested.
   - At least one linked issue (`Closes #XXXX`).
2. **Assign yourself** to the PR.
3. **Label the PR** with:
   - `effort: *` — amount of effort required to review it.
   - `type: *` — type of change.
   - `work: *` — complexity of the change.
4. **Keep the PR focused.** One issue's worth of change per PR, matching the one-branch-per-issue convention above.

### PR description for cascading changes

If the PR touches a swatch ramp (`scripts/themes/ramps.json` or `scripts/themes/colors.ts`) rather than a single theme's token mapping, say so explicitly in the PR description and note which themes were re-checked. See [Adding a Theme](./adding-a-theme.md) and [Theme System Architecture § 3](../architecture/theme-system.md#3-the-ramp-cascade-constraint) — a ramp edit changes every theme at once, and reviewers need to know that was deliberate and verified, not an oversight scoped to one theme.

## 6. CI Gates

The `test` workflow (`.github/workflows/test.yml`) runs on every pull request and on push to `main`:

| Step       | Command                  | Checks                                        |
| ---------- | ------------------------ | --------------------------------------------- |
| Install    | `npm install`            | Dependencies resolve                          |
| Test       | `npm test`               | Theme contrast validation (`validate-themes`) |
| Lint       | `npx prettier --check .` | Formatting                                    |
| Type check | `npx tsc --noEmit`       | TypeScript compiles without emitting          |

All steps must pass before merge. There is no override for a failing check — fix the underlying issue (or, for a theme contrast failure, follow the process in [Adding a Theme](./adding-a-theme.md)) rather than working around it.

On merge to `main`, the release workflow (`.github/workflows/release.yml`) and `npm_publish.yml` handle building and publishing — see the [release workflow files](../../../.github/workflows/) for details; this document covers the pre-merge process only.

## 7. Review and Approval

- A pull request requires review and approval before merge; CI passing is necessary but not sufficient.
- Reviewers check correctness, adherence to [Definition of Done](../quality/definition-of-done.md) and [Review Guidelines](../quality/review-guidelines.md) where those exist, and — for any theme or ramp change — whether the cascade implications called out in the PR description actually match the diff (see [Adding a Theme § Code Review Checklist](./adding-a-theme.md#7-code-review-checklist)).
- Address review feedback with additional commits on the same branch rather than force-pushing over history mid-review, so reviewers can see what changed since their last pass.
- Once approved and CI is green, merge into `main`. Squash or merge per the repository's configured merge strategy.

## 8. Summary Checklist

- [ ] Branch from `main`: `<username>/<issue-number>-<slug>`
- [ ] Commits follow Conventional Commits (enforced by pre-commit + commitlint)
- [ ] `just gate` passes locally
- [ ] PR opened against `main` using the org template, self-assigned, labeled (`effort`, `type`, `work`), linked to an issue
- [ ] PR description calls out any ramp/cross-theme cascade explicitly
- [ ] CI (`test` workflow: test, lint, type-check) passes
- [ ] Review approved
- [ ] Merge to `main`
