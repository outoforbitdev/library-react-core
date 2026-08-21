# Form Patterns

This document covers how individual form components (built following [validation.md](./validation.md)) compose into whole forms: who owns the data, how form-level state is managed, how related fields are grouped, and how forms are laid out.

## Controlled vs. Uncontrolled

A **controlled** component's value is owned entirely by the consumer — the consumer holds the value in state and passes it in via a `value` prop, and every change flows through an `onChange` handler back up to that state. An **uncontrolled** component manages its own value internally (via the DOM, using `defaultValue`) and only reports changes out, without the consumer needing to hold the current value in state at all.

This library's form components default to **supporting controlled usage**, in keeping with [Validation Responsibility](./validation.md#validation-responsibility): the consumer owns form state, so the consumer needs to be able to read and set a field's value directly.

```tsx
// Controlled — the consumer owns `value` and updates it on every change.
function ControlledExample() {
  const [name, setName] = useState("");

  return (
    <TextField
      id="name"
      label="Name"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  );
}
```

```tsx
// Uncontrolled — the DOM owns the current value; the consumer only reads
// it when needed (e.g., at submit time), not on every keystroke.
function UncontrolledExample() {
  const nameRef = useRef<HTMLInputElement>(null);

  function handleSubmit() {
    console.log(nameRef.current?.value);
  }

  return <TextField id="name" label="Name" defaultValue="" ref={nameRef} />;
}
```

Uncontrolled usage is still supported (the component just forwards native `defaultValue`/`ref` like any input), but it's the exception, not the default recommendation — most consuming application forms need the value available in state anyway (for cross-field validation, conditional rendering, or submit-button enable/disable), so controlled usage is usually the right starting point. Reach for uncontrolled only when a field's value genuinely doesn't need to be read until submission and the form has enough fields that avoiding a render per keystroke matters.

Components should never assume one or the other — accepting both `value` and `defaultValue` as passthrough native props (and never overriding a consumer-supplied `value` internally) keeps both usages working without special-casing in the component itself.

## Simple Form State Management with React State

For most forms in consuming applications, plain `useState` per field (or a single state object for the whole form) is enough — this library does not ship or require a form-state library. Keep the state shape as simple as the form is:

```tsx
function SignUpForm() {
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  function handleChange(field: keyof typeof values) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors: typeof errors = {};
    if (!values.email) nextErrors.email = "Email is required.";
    if (values.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      submitSignUp(values);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        id="email"
        label="Email"
        type="email"
        value={values.email}
        error={errors.email}
        onChange={handleChange("email")}
      />
      <TextField
        id="password"
        label="Password"
        type="password"
        value={values.password}
        error={errors.password}
        onChange={handleChange("password")}
      />
      <Button type="submit" className="ood-primary ood-submit">
        Sign Up
      </Button>
    </form>
  );
}
```

Notes on this pattern:

- One state object per form (`values`) is usually clearer than one `useState` call per field once a form has more than two or three fields.
- Validation errors are computed and stored separately from the values themselves (`errors`), and re-derived on submit (or on blur, depending on the form's UX needs) — the component never computes its own error state, per [validation.md](./validation.md#validation-responsibility).
- The root element is a real `<form>` with a real `onSubmit` handler and a real `<button type="submit">` — this gets native Enter-to-submit behavior, and native validation reporting, for free.

## Form Field Groups

When several fields are logically related (a set of radio options, a billing address's street/city/state/ZIP), group them in a `<fieldset>` with a `<legend>` rather than relying on visual proximity alone. This gives the group an accessible name and structure that a screen reader announces, which visual grouping (a `<div>` with a border) does not.

```tsx
<fieldset className={styles.fieldGroup}>
  <legend>Billing Address</legend>
  <TextField
    id="street"
    label="Street"
    value={address.street}
    onChange={handleChange("street")}
  />
  <TextField
    id="city"
    label="City"
    value={address.city}
    onChange={handleChange("city")}
  />
  <TextField
    id="state"
    label="State"
    value={address.state}
    onChange={handleChange("state")}
  />
  <TextField
    id="zip"
    label="ZIP code"
    pattern="[0-9]{5}"
    value={address.zip}
    onChange={handleChange("zip")}
  />
</fieldset>
```

`<fieldset>`/`<legend>` is also the correct grouping element for a set of related radio buttons or checkboxes, where the group as a whole needs a label distinct from any individual option's label:

```tsx
<fieldset className={styles.fieldGroup}>
  <legend>Preferred contact method</legend>
  <RadioField name="contact" value="email" label="Email" checked={contact === "email"} onChange={...} />
  <RadioField name="contact" value="phone" label="Phone" checked={contact === "phone"} onChange={...} />
</fieldset>
```

The library's own `component-name.module.css` styling for a field group should handle spacing/border structure only, consistent with the [Styling Approach](../architecture/component-patterns.md#styling-approach-css-modules--utility-classes) — theming (border color, background) still comes from a consumer-applied utility class.

## Vertical and Horizontal Layouts

Field layout (stacked vertically vs. arranged in a row) is a structural, theme-independent concern, so it belongs in CSS Modules, applied via a layout prop or a layout-specific utility class — not computed in JavaScript.

```css
/* form.module.css */
.formVertical {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.formHorizontal {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: flex-start;
}
```

```tsx
<form className={classNames(styles.formVertical)} onSubmit={handleSubmit}>
  {/* stacked fields — the default for most forms */}
</form>

<form className={classNames(styles.formHorizontal)} onSubmit={handleSubmit}>
  {/* fields arranged in a row — a filter bar or a short search form */}
</form>
```

Default to a vertical layout unless there's a specific reason for horizontal (a compact filter/search bar with two or three fields). Vertical layouts are easier to scan, easier to make responsive without extra breakpoints, and match how most screen readers and browser autofill UIs expect a form to read top-to-bottom. Whichever layout is used, the visual order (CSS) and the DOM order must match — reordering fields visually with CSS while leaving the DOM order different breaks keyboard and screen-reader navigation, which follow DOM order, not visual order.

## Accessibility Checklist for Forms

Beyond the per-field checklist in [validation.md](./validation.md#validation-checklist), verify the form as a whole:

- [ ] Every field has a `<label>` associated with it via `htmlFor`/`id` — never a placeholder used as the only label
- [ ] The form uses a real `<form>` element with a real `onSubmit` handler, not a `<div>` with a manually wired button click
- [ ] Related fields (address parts, radio/checkbox groups) are grouped in `<fieldset>`/`<legend>`, not visual grouping alone
- [ ] Tab order follows DOM order, and DOM order matches the visual (left-to-right, top-to-bottom) reading order
- [ ] The submit control is a real `<button type="submit">` (or `<input type="submit">`), reachable and activatable by keyboard
- [ ] Validation errors are associated with their field via `aria-describedby` and announced via `role="alert"` (see [validation.md](./validation.md#error-display))
- [ ] Required fields are marked with the native `required` attribute, not only a visual asterisk
- [ ] The form remains fully operable with a keyboard alone, including submitting it without touching a pointing device
- [ ] Automated Storybook tests cover a full fill-out-and-submit interaction, including the invalid-submission path
