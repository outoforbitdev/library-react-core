# Theme System Architecture

This document describes how theming works in `@outoforbitdev/ood-react` at the implementation level: how CSS variables cascade, how color ramps are generated, and — most importantly — the structural constraint that makes ramp changes expensive. If you are about to add a theme or touch a color ramp, read section 3 before you start.

For the feature-level product requirements and technical design, see [Theme System](../features/theme-system/). This document focuses on the architectural implications for anyone extending or maintaining the system, and is the canonical reference for the ramp cascade constraint.

## 1. How Themes Work

A theme is selected by CSS, not JavaScript. There is no runtime theme engine — theme resolution happens entirely through CSS variable cascade and selector specificity, resolved by the browser.

### Selection mechanism

Three layers resolve, in increasing priority:

1. **`:root` defaults** — the default light theme's tokens, always present.
2. **`@media (prefers-color-scheme: dark)`**, scoped to `:root:not([data-theme])` — overrides the defaults with the default dark theme's tokens, but only when no explicit theme has been set on an ancestor.
3. **`[data-theme="<name>"]`** — an explicit override. Any element (not just `:root`) can carry a `data-theme` attribute, and its subtree adopts that theme's tokens regardless of system preference.

```css
:root {
  --ood-primary-text: var(--ood-gray-600);
  --ood-primary-background: var(--ood-gray-200);
  /* ... */
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    --ood-primary-text: var(--ood-gray-400);
    --ood-primary-background: var(--ood-gray-900);
    /* ... */
  }
}

[data-theme="dark"] {
  --ood-primary-text: var(--ood-gray-400);
  --ood-primary-background: var(--ood-gray-900);
  /* ... */
}
```

Because `data-theme` can be applied to any element, theming is **not** global-only — a `<div data-theme="dark">` inside an otherwise light-themed page will render dark, and nesting works the way you'd expect from normal CSS cascade.

### Applying a theme to a component

Components don't reference theme tokens directly for their base look. Instead, a container is given a **utility class** (`ood-primary`, `ood-secondary`, `ood-accent`, `ood-accent-block`, `ood-error`, `ood-error-block`, `ood-warning`, `ood-warning-block`, `ood-submission`, `ood-submission-block`, `ood-submit`, `ood-submit-block`), and everything inside inherits from a small set of local variables (`--ood-text`, `--ood-background`, `--ood-shade`, `--ood-link`, `--ood-link-visited`) that class sets:

```jsx
<div className="ood-primary">
  <Button>Primary Button</Button>
</div>
```

```css
.ood-primary {
  --ood-text: var(--ood-primary-text);
  --ood-background: var(--ood-primary-background);
  --ood-shade: var(--ood-primary-shade);
  --ood-link: var(--ood-primary-link);
  --ood-link-visited: var(--ood-primary-link-visited);
}
```

This indirection (utility class → local vars → semantic theme vars → swatch vars) is what lets a single CSS Module (e.g. `button.module.css`) work correctly under `.ood-primary`, `.ood-secondary`, or `.ood-error-block` without knowing which one it's inside.

### Storybook

Storybook does not currently have a global theme toolbar (no `globalTypes`/toolbar entry in `.storybook/preview.ts`). Theme switching is done per-story via a decorator that wraps the story in a `data-theme` div, as in `src/stories/ThemeTest.stories.tsx`:

```jsx
export const Dark: Story = {
  decorators: [(story) => <div data-theme="dark">{story()}</div>],
};
```

This means each new theme needs its own story (or story variant) to be visible in Storybook — there's no single control that cycles through all registered themes. See [Future Enhancements](#8-future-enhancements) for the toolbar-based alternative.

## 2. Color Ramps

There are two distinct layers of color data, and conflating them is the most common source of confusion when extending the system.

### Layer A — Swatch ramps (`scripts/themes/ramps.json`)

A **swatch ramp** is a raw, theme-agnostic color family. Each family is defined by a single vibrant "500" hex value; the rest of the 100–900 gradient is generated from it:

```json
{
  "gray": { "500": "#6C6C6C" },
  "green": { "500": "#008200" },
  "royal-blue": { "500": "#0000C8" },
  "red": { "500": "#b40000" },
  "yellow": { "500": "#FFDC20" },
  "magenta": { "500": "#A000A0" },
  "teal": { "500": "#007373" },
  "orange": { "500": "#A55200" },
  "pink": { "500": "#B30059" },
  "blue": { "500": "#0064C8" },
  "purple": { "500": "#7700EF" },
  "cyan": { "500": "#00FAFA" }
}
```

`scripts/themes/colors.ts` generates the other eight steps from that one value:

```ts
const LIGHTEN_STEP_FACTOR = 0.6; // steps 400 → 100, moving toward white
const DARKEN_STEP_FACTOR = 0.3;  // steps 600 → 900, moving toward black
```

Each step moves the previous step's RGB value a fixed fraction of the remaining distance to white (light steps) or black (dark steps), compounding outward from 500. This is why the ramps look vibrant rather than washed out — light steps lighten aggressively (0.6) while dark steps darken more gradually (0.3), keeping saturation in the low-to-mid steps.

**Critically: swatch ramps are generated once, globally, and emitted into a single unscoped `:root` block** (`generateSwatchVariables` in `scripts/themes/css.ts`). `--ood-gray-100` through `--ood-gray-900`, `--ood-blue-100` through `--ood-blue-900`, and so on are the *same* values regardless of which theme (`light`, `dark`, or any future custom theme) is active. There is no per-theme override of a swatch ramp — themes only choose *which step* of a ramp to reference.

### Layer B — Semantic theme tokens (`scripts/themes/themes.json`)

A **theme** (`light`, `dark`, ...) is a mapping from semantic component slots to swatch references (`"<family>-<step>"`). The semantic slots are:

| Component | Properties | Purpose |
|---|---|---|
| `primary` | text, background, shade, link, link-visited | Default surface |
| `secondary` | text, background, shade, link, link-visited | Alternate surface |
| `accent` | text | Inline accent text (no background) |
| `accent-block` | text, background, shade, link, link-visited | Highlighted/callout surface |
| `error` | text, block-text, block-background, block-shade | Inline error text + error block surface |
| `warning` | text, block-text, block-background, block-shade | Inline warning text + warning block surface |
| `submission` (aliased as `submit`) | text, block-text, block-background, block-shade | Success/confirmation text + block surface — this is the library's "success" ramp |
| `stock` | one ref per named color (red, orange, yellow, green, teal, cyan, blue, indigo, purple, magenta, pink, gray) | Raw brand colors exposed as `--ood-color-<name>` for illustrative/data-viz use, not validated for contrast |

There is no separate "neutral" ramp — neutral tones are the `gray` swatch family, referenced throughout `primary`/`secondary`/block components for text and surfaces. `indigo` in `stock` is itself an alias onto the `royal-blue` swatch family.

```json
"primary": {
  "text": "gray-600",
  "background": "gray-200",
  "shade": "gray-100",
  "link": "purple-600",
  "link-visited": "blue-600"
}
```

At generation time (`scripts/themes/css.ts`), each theme's tokens are flattened and emitted as CSS custom properties that reference the swatch variables:

```css
:root {
  --ood-primary-text: var(--ood-gray-600);
  --ood-primary-background: var(--ood-gray-200);
  /* ... */
}
```

So a "ramp" in the everyday sense people mean when they say "the primary ramp" is really two things layered together: the swatch gradient (shared, global) and the theme's choice of which step to point at (per-theme).

## 3. THE RAMP CASCADE CONSTRAINT

**This is the single most important thing to understand before touching `ramps.json`, `colors.ts`, or any swatch-level color.**

Because swatch ramps (Layer A) are generated once and emitted into a single unscoped `:root` block shared by every theme, **any change to a swatch ramp's base 500 value, or to the lighten/darken factors that generate its 100–900 steps, changes that color family for every theme simultaneously** — `light`, `dark`, and any theme added since. Themes do not — and currently cannot — override a ramp's generated steps; they can only choose which step to reference.

Concretely:

- Changing `red-500` in `ramps.json` shifts `red-100` through `red-900`. Both `light.error.block-background` (`red-700`) and `dark.error.block-background` (`red-700`) shift together, along with every other reference to the `red` family across every theme — `stock.red` in both themes, any component that happens to reference a red step, and any future theme that also uses `red-*`.
- Changing `LIGHTEN_STEP_FACTOR` or `DARKEN_STEP_FACTOR` in `colors.ts` regenerates **all twelve** swatch families across **all** themes at once. This is the widest-blast-radius change the system permits.
- A single ramp edit can silently push multiple contrast pairs below their required ratio in themes you weren't even thinking about when you made the change. `npm run validate-themes` will catch the failures, but it reports *what* failed, not *why* — you have to trace the failure back to the ramp edit yourself.

**What does *not* cascade:**

- Adding a brand-new swatch family (e.g. a new `lime` ramp) is safe — it's inert until some theme references it.
- Changing which step a theme references (e.g. `primary.text` from `gray-600` to `gray-700` in the `light` theme only) is theme-scoped and does not affect other themes, because it only changes that theme's `[data-theme="light"]` block (or `:root` for the default theme).

**Practical rule of thumb:** if your change is inside `themes.json` and touches only one theme's block, it's isolated. If your change is inside `ramps.json` or `colors.ts`, assume it affects every theme until validation proves otherwise, and budget time to re-check every theme, not just the one you're working on. See [Modifying Existing Ramps](#6-modifying-existing-ramps) for the safe process.

This constraint exists because the system optimizes for a small, cohesive palette shared across themes (so `blue` looks like the same "brand blue" everywhere) at the cost of per-theme color isolation. It is a known piece of technical debt — see [Future Enhancements](#8-future-enhancements) for the proposed fix (namespaced/per-theme ramps).

## 4. CSS Variables Strategy

The system uses three tiers of CSS custom properties, each with a distinct scope and purpose:

1. **Swatch variables** — `--ood-{family}-{step}` (e.g. `--ood-gray-700`, `--ood-blue-300`). Global, theme-agnostic, defined once in an unscoped `:root` block. These are raw color values; nothing in a theme is stored as a literal hex value — everything ultimately resolves through a swatch variable.

2. **Semantic theme variables** — `--ood-{component}-{property}` (e.g. `--ood-primary-text`, `--ood-error-block-background`). Theme-scoped: defined in `:root` (default light), inside the `prefers-color-scheme: dark` media query (default dark, when no explicit `data-theme`), and inside each `[data-theme="<name>"]` block (explicit override). Each one resolves via `var()` to a swatch variable — never a literal color.

3. **Local component variables** — `--ood-text`, `--ood-background`, `--ood-shade`, `--ood-link`, `--ood-link-visited`. Set by the utility classes (`.ood-primary`, `.ood-error-block`, ...) applied to a container, pointing at that container's semantic variables. Components and CSS Modules consume *only* these five names — never a semantic or swatch variable directly.

Components should never reference `--ood-primary-text` or `--ood-gray-700` directly in their CSS Modules. A `button.module.css` that does `color: var(--ood-text)` works correctly under any utility class, in any theme, without modification — that's the entire point of the indirection:

```css
/* button.module.css */
.button {
  color: var(--ood-text);
  background: var(--ood-background);
}
.button:hover {
  background: var(--ood-shade);
}
.button a {
  color: var(--ood-link);
}
.button a:visited {
  color: var(--ood-link-visited);
}
```

Because switching happens entirely via CSS variable resolution, theme changes are free at runtime — no re-render, no JS, no FOUC beyond normal CSS load — and changing `data-theme` on any ancestor re-themes its entire subtree instantly.

## 5. Adding a New Theme

For the step-by-step process and PR/review checklist, see [Adding a Theme](../workflows/adding-a-theme.md). This section is a worked example of the same steps: adding a theme named `ood-bright`, a high-contrast light variant.

### Step 1 — Decide accessibility level

Pick `"AAA"` (7:1 text, 4.5:1 links) or `"AA"` (4.5:1 both). This determines the `requiredRatio` validation will enforce for every pair in this theme. Use `"AAA"` unless you have a specific reason not to — every existing theme is `"AAA"`.

### Step 2 — Add the theme block to `scripts/themes/themes.json`

Prefer reusing existing swatch steps over adding new ramps — a new theme rarely needs new colors, just a new *arrangement* of existing ones. Every property must be filled in; there are no defaults.

```json
{
  "ood-bright": {
    "accessibility-level": "AAA",
    "primary": {
      "text": "gray-900",
      "background": "gray-100",
      "shade": "gray-200",
      "link": "royal-blue-700",
      "link-visited": "purple-700"
    },
    "secondary": {
      "text": "gray-900",
      "background": "gray-200",
      "shade": "gray-300",
      "link": "royal-blue-700",
      "link-visited": "purple-700"
    },
    "accent": {
      "text": "royal-blue-600"
    },
    "accent-block": {
      "text": "gray-900",
      "background": "yellow-100",
      "shade": "yellow-200",
      "link": "magenta-800",
      "link-visited": "pink-800"
    },
    "error": {
      "text": "red-700",
      "block-text": "gray-100",
      "block-background": "red-800",
      "block-shade": "red-900"
    },
    "warning": {
      "text": "yellow-900",
      "block-text": "gray-900",
      "block-background": "yellow-400",
      "block-shade": "yellow-300"
    },
    "submission": {
      "text": "green-800",
      "block-text": "gray-100",
      "block-background": "green-700",
      "block-shade": "green-800"
    },
    "stock": {
      "red": "red-500",
      "orange": "orange-500",
      "yellow": "yellow-600",
      "green": "green-500",
      "teal": "teal-500",
      "cyan": "cyan-600",
      "blue": "blue-500",
      "indigo": "royal-blue-500",
      "purple": "purple-500",
      "magenta": "magenta-500",
      "pink": "pink-400",
      "gray": "gray-500"
    }
  }
}
```

This adds `[data-theme="ood-bright"]` to the generated CSS. It does **not** become the default light or dark theme — it's opt-in via `data-theme="ood-bright"` — unless you also set `"default-light-theme": "ood-bright"` at the top level of `themes.json`, which is rarely what you want for an additional theme.

### Step 3 — Generate and validate

```bash
npm run validate-themes
```

This regenerates `src/styles/themes.css` and runs contrast validation on the new theme's pairs (primary/secondary text vs. background/shade, links, accent, error/warning/submission text against every surface, and all block pairs). Read `scripts/themes/validation-report.json` for the exact ratios if anything fails.

### Step 4 — Fix any contrast failures

If a pair fails, move the *reference* to a different step in the existing ramp (e.g. `gray-900` → `gray-800`) rather than editing the ramp itself — this keeps the change isolated to `ood-bright` (see [section 3](#3-the-ramp-cascade-constraint)). Re-run `npm run validate-themes` until the theme passes.

### Step 5 — Add Storybook coverage

Add a story (or extend `ThemeTest.stories.tsx`) so the theme is visible in Storybook:

```jsx
export const OodBright: Story = {
  decorators: [(story) => <div data-theme="ood-bright">{story()}</div>],
};
```

### Step 6 — Document it

Add `ood-bright` to the theme list in `docs/internal/features/theme-system/README.md` and `product-requirements.md` if it's intended for general use, and note in a PR description which components/consumers were manually checked.

## 6. Modifying Existing Ramps

Modifying a ramp (a swatch family in `ramps.json`, or the generation factors in `colors.ts`) is a **global, cross-theme change** — treat it with more caution than adding a theme. Follow this process:

1. **Find every reference to the ramp before touching it.** Grep `themes.json` for the family name (e.g. `grep -n '"gray-' scripts/themes/themes.json`) across *every* theme, not just the one you're thinking about. This tells you the actual blast radius.
2. **Prefer changing the reference, not the ramp**, when the goal is "this one theme should look different." Point the theme's token at a different existing step (`gray-700` instead of `gray-600`) or a different family entirely. This is theme-scoped and safe.
3. **Only edit `ramps.json` or `colors.ts` when the goal is genuinely "this color family should look different everywhere."** Examples: rebranding the primary blue, correcting a swatch that turned out too desaturated at every step.
4. **Make the edit**, then run `npm run validate-themes` and read the full `validation-report.json` — not just the pass/fail summary. Check every theme's `contrastPairs`, not only the ones that failed; a pair can still pass while dropping close to the threshold in a way worth noting.
5. **Visually check every theme in Storybook**, not just the theme you were targeting. Open `ThemeTest` (or equivalent) for `light`, `dark`, and any custom themes. A ramp edit that passes numeric contrast validation can still look wrong (e.g. an accent color that no longer reads as "the same blue" against a different background).
6. **Call out the cascade in the PR description.** Since a ramp edit touches every theme by construction, reviewers need to know it was a deliberate, checked, all-themes change — not an oversight scoped to one theme.
7. **If you only need a one-off variant of an existing color for a single theme**, consider adding a new swatch family instead of repurposing an existing one (see [section 3](#3-the-ramp-cascade-constraint), "what does not cascade"). A new family is inert everywhere until referenced, so it can't regress existing themes.

## 7. Testing Theme Coverage

### Automated: contrast validation

`npm run validate-themes` (aliased as `npm test`, and run as the first step of `npm run build`) is the primary automated check:

- Loads `themes.json`, generates ramps from `ramps.json` via `colors.ts`.
- Validates every theme's declared pairs against its `accessibility-level` (7:1 for AAA text, 4.5:1 for links; the block variants use the theme's ratio for both text and links).
- Writes `scripts/themes/validation-report.json` with every pair checked, its resolved hex values, computed ratio, and pass/fail — not just the failures.
- Exits non-zero (failing CI) if any required pair fails.

This check catches numeric contrast regressions but **cannot** catch visual coherence problems (a color that passes contrast but clashes, or a theme that looks broken in a way contrast math doesn't detect).

### Manual: cross-theme visual check

Because there is no automated visual regression suite yet, coverage today relies on manually reviewing Storybook:

- Open `Example/Themes` (`ThemeTest.stories.tsx`) for both `Light` and `Dark`, and any custom theme story added per [section 5](#5-adding-a-new-theme).
- Confirm every utility class (`ood-primary`, `ood-secondary`, `ood-accent`, `ood-accent-block`, `ood-error`, `ood-error-block`, `ood-warning`, `ood-warning-block`, `ood-submission`/`ood-submit`, and block variants) renders legibly and with intended contrast — the story table exists specifically to surface every combination side by side.
- Check every component's own stories under each theme, not just the theme-test page — a component's specific layout/spacing can expose contrast issues the generic table doesn't (e.g. small text on a `shade` hover state).
- Re-check after any ramp edit, per [section 6](#6-modifying-existing-ramps).

### What's missing today

There is no automated visual regression testing (pixel diffing across themes) and no automated a11y scan wired into CI beyond the numeric contrast check. Both are called out below as future work.

## 8. Future Enhancements

- **Storybook toolbar-based theme switcher** — replace per-story `data-theme` decorators with a global `globalTypes` toolbar control in `.storybook/preview.ts`, so any story can be viewed under any registered theme without a dedicated story variant. Currently only `ThemeTest.stories.tsx` demonstrates multiple themes explicitly.
- **Dynamic runtime theme switching in consuming apps** — document (and possibly provide a small helper for) toggling `data-theme` at runtime in `app-galaxy-map` and other consumers, including persisting the user's choice.
- **Theme builder tool** — an interactive tool (CLI or small web UI) that lets someone pick swatch references for a new theme and see live contrast ratios before committing to `themes.json`, removing the current edit → `npm run validate-themes` → re-edit loop.
- **Automated contrast checker in CI feedback** — surface `validation-report.json` results as PR comments/annotations rather than requiring a local run to see which pairs failed.
- **Visual regression testing per theme** — integrate a screenshot-diffing tool (e.g. Chromatic or Storybook's test runner with visual snapshots) so every theme is automatically checked for unintended visual drift on every PR, not just numeric contrast.
- **Per-theme ramp overrides** — the structural fix for the [ramp cascade constraint](#3-the-ramp-cascade-constraint): allow a theme to optionally override a swatch family's steps (e.g. a namespaced `ramps.<theme>.json` or an override block inside `themes.json`) so a theme-specific color change no longer requires touching the globally shared ramp. This is the highest-leverage change for reducing the risk of ramp edits as the number of themes grows.
