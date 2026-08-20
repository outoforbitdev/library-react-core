# Adding a Theme

This is the step-by-step process for adding a new theme, or modifying an existing one, in `@outoforbitdev/ood-react`. It's a workflow checklist — for the underlying mechanics (how CSS variables cascade, how swatch ramps generate, why the constraint below exists), see [Theme System Architecture](../architecture/theme-system.md), which is the canonical technical reference. This document exists to turn that architecture into a repeatable, checkable process.

## Read This First: Ramp Changes Cascade to Every Theme

**This is the single most important thing to understand before you start.**

Swatch ramps (`scripts/themes/ramps.json`, `scripts/themes/colors.ts`) are generated once and emitted into a single unscoped `:root` block shared by every theme. There is no per-theme override of a ramp's generated steps. This means:

- Editing a ramp's base color or the lighten/darken factors changes that color family for **every theme at once** — `light`, `dark`, and any custom theme — not just the one you're working on.
- A ramp edit can push contrast ratios below their required threshold in themes you weren't even thinking about when you made the change.
- `npm run validate-themes` will catch a contrast failure, but it reports *what* failed, not *why* — you have to trace it back to the ramp edit yourself.

**Adding a new theme almost never requires touching a ramp.** A new theme is a new *arrangement* of existing swatch steps (`themes.json`), not new colors. If you find yourself editing `ramps.json` or `colors.ts` while "just adding a theme," stop and re-read [Theme System Architecture § 3](../architecture/theme-system.md#3-the-ramp-cascade-constraint) — you are very likely about to make a global, cross-theme change disguised as a local one.

If the task genuinely requires a ramp edit (rebranding a color, fixing a swatch that's wrong everywhere), that's a different, higher-caution process — see [§ 6, When You Actually Need to Touch a Ramp](#6-when-you-actually-need-to-touch-a-ramp) below.

## 1. Two Cases This Process Covers

| Case | What changes | Blast radius |
|---|---|---|
| **Adding a new theme** | New block in `themes.json`, referencing existing swatch steps | Isolated to the new theme |
| **Modifying an existing theme's tokens** | Existing theme's block in `themes.json`, still referencing existing swatch steps | Isolated to that one theme |
| **Modifying a ramp** (`ramps.json` / `colors.ts`) | Shared swatch generation | **Every theme, simultaneously** — see § 6 |

Sections 2–5 below cover the first two (theme-scoped) cases, which should be the common path.

## 2. Copy the Template

Start from an existing theme block in `scripts/themes/themes.json` rather than writing one from scratch — it guarantees you don't miss a required property. `light` (the default, unnamed root block) or `dark` are good starting points.

```bash
# Inspect the existing structure to copy from
cat scripts/themes/themes.json
```

Duplicate a full theme block and rename it to your new theme's identifier (e.g. `ood-bright`). Set `"accessibility-level"` to `"AAA"` (7:1 text, 4.5:1 links) unless you have a specific reason to use `"AA"` (4.5:1 both) — every existing theme is `"AAA"`.

## 3. Adjust Colors — Reference, Don't Redefine

For each semantic slot (`primary`, `secondary`, `accent`, `accent-block`, `error`, `warning`, `submission`, `stock`), point at existing swatch steps (`"<family>-<step>"`, e.g. `"gray-700"`, `"royal-blue-600"`). Do not write a literal hex value anywhere in `themes.json` — the whole point of the swatch/theme split is that every theme resolves through the shared ramp.

Prefer reusing swatch families already used elsewhere before introducing a new one. If you genuinely need a color the existing 12 families don't provide, adding a **new** swatch family to `ramps.json` (e.g. `lime`) is safe and theme-scoped in effect — it's inert until a theme references it. This is different from editing an *existing* family, which is not safe (see § 6).

## 4. Ensure All Ramps/Slots Are Defined — Nothing Inherits a Default

There are no defaults. Every semantic slot for the theme must be explicitly filled in:

- `primary`: text, background, shade, link, link-visited
- `secondary`: text, background, shade, link, link-visited
- `accent`: text
- `accent-block`: text, background, shade, link, link-visited
- `error`: text, block-text, block-background, block-shade
- `warning`: text, block-text, block-background, block-shade
- `submission` (aliased as `submit`): text, block-text, block-background, block-shade
- `stock`: one reference per named color — red, orange, yellow, green, teal, cyan, blue, indigo, purple, magenta, pink, gray

A missing property is not a silent fallback to another theme's value — it's a gap. Diff your new block against the template you copied from to confirm nothing was dropped in the copy.

## 5. Generate, Validate, and Fix Contrast Failures

```bash
npm run validate-themes
```

This regenerates `src/styles/themes.css` from `themes.json` + `ramps.json`, and validates every theme's contrast pairs against its `accessibility-level`. Read `scripts/themes/validation-report.json` — not just the pass/fail summary — for the resolved hex values and computed ratios on every pair, including ones that passed.

If a pair fails: **move the reference to a different step in the existing ramp** (e.g. `gray-900` → `gray-800`), not the ramp itself. This keeps the fix isolated to your theme. Re-run `validate-themes` until it passes.

## 6. Add the Theme Class Selector / Storybook Coverage

Add a story so the theme is actually visible — there's no global theme toolbar in Storybook yet, so a theme only shows up if a story wraps content in its `data-theme` selector:

```jsx
export const OodBright: Story = {
  decorators: [(story) => <div data-theme="ood-bright">{story()}</div>],
};
```

Add this to `src/stories/ThemeTest.stories.tsx` (the table that exercises every utility class side by side) at minimum. If the theme is meant for general consumer use, consider whether individual component stories also need a themed variant.

## 7. Test in Storybook

Run Storybook and manually check the new theme, not just the automated contrast numbers — contrast validation catches numeric regressions, not visual coherence:

```bash
npm run storybook
```

- Open the `ThemeTest` story under the new theme. Confirm every utility class (`ood-primary`, `ood-secondary`, `ood-accent`, `ood-accent-block`, `ood-error`, `ood-error-block`, `ood-warning`, `ood-warning-block`, `ood-submission`/`ood-submit`, and block variants) renders legibly with the intended contrast.
- Spot-check a few individual components under the new theme, not just the generic table — component-specific layout/spacing can expose issues the table doesn't (e.g. small text on a `shade` hover state).

## 8. Verify Consistency Across Existing Themes

Before opening a PR, re-check that adding the new theme didn't change anything else:

- `git diff scripts/themes/ramps.json scripts/themes/colors.ts` should be empty (or contain only an intentional, called-out new swatch family — see § 3). If it isn't empty and you didn't mean to touch a ramp, stop and re-read the warning at the top of this document.
- `git diff scripts/themes/themes.json` should show only your new/modified theme block, not edits to `light`, `dark`, or any other existing theme.
- `validation-report.json` should show every existing theme still passing, unchanged from before your work.

## 9. Update Docs

- Add the new theme's name to the theme list in `docs/internal/features/theme-system/README.md` and `product-requirements.md`, if it's intended for general/external use.
- If the theme introduces a new swatch family, note that in the same places.
- In the PR description, note which components/consumers were manually checked in Storybook (§ 7).

## 10. Code Review Checklist — Ramp Consistency

Reviewers (and authors, before requesting review) should confirm:

- [ ] `themes.json` diff touches only the intended theme's block — no unrelated theme changed.
- [ ] Every required slot is present for the new/modified theme (§ 4) — no gaps.
- [ ] No literal hex values were introduced in `themes.json` — every value is a `"<family>-<step>"` reference.
- [ ] If `ramps.json` or `colors.ts` changed: **this is flagged explicitly in the PR description**, every existing theme's `validation-report.json` entry was re-checked (not just the one theme the author was targeting), and every theme was visually re-checked in Storybook — see [§ 6 below](#6-when-you-actually-need-to-touch-a-ramp) and [Theme System Architecture § 6](../architecture/theme-system.md#6-modifying-existing-ramps).
- [ ] `npm run validate-themes` was run and `validation-report.json` shows all themes passing, not just the new one.
- [ ] A Storybook story exists for the new theme, and the PR description or screenshots show it was visually checked.

If a PR touches a ramp without calling it out, treat that as a review blocker — the cost of an unflagged cascade (a subtle contrast regression in a theme nobody was looking at) is exactly what this checklist exists to prevent.

## 11. When You Actually Need to Touch a Ramp

If the task is genuinely "this color family should look different everywhere" (a rebrand, a swatch that turned out wrong at every step) — not "add a theme" — follow the heavier process instead:

1. Grep every reference to the ramp across every theme first, to know the real blast radius: `grep -n '"gray-' scripts/themes/themes.json`.
2. Make the edit in `ramps.json` or `colors.ts`.
3. Run `npm run validate-themes` and read the **full** `validation-report.json`, checking every theme's contrast pairs — not only the ones that failed.
4. Visually re-check **every** theme in Storybook, not just the one you were originally targeting.
5. Call out the cascade explicitly in the PR description — reviewers need to know it was a deliberate, checked, all-themes change.

Full detail: [Theme System Architecture § 3 and § 6](../architecture/theme-system.md#3-the-ramp-cascade-constraint).

## 12. Summary Checklist

- [ ] Copied an existing theme block as a template
- [ ] All colors reference existing (or one new, inert) swatch steps — no literal hex values
- [ ] Every required semantic slot is defined — nothing missing
- [ ] Added `data-theme="<name>"` story coverage in `ThemeTest.stories.tsx`
- [ ] `npm run validate-themes` passes for all themes, including pre-existing ones
- [ ] Manually verified the new theme in Storybook (utility classes + a few components)
- [ ] Confirmed no unintended diff in `ramps.json`, `colors.ts`, or other themes' blocks
- [ ] Updated theme lists in feature docs if the theme is for general use
- [ ] If a ramp was touched: called it out explicitly in the PR description, per § 11
