# Validation

This document covers how validation works for form-like components in `@outoforbitdev/ood-react` — what the component itself is responsible for, what it hands off to the consumer, and how validation state is surfaced accessibly. It assumes you've read [Building Components](./building-components.md) for the base component anatomy; this document layers validation-specific concerns on top of that anatomy.

## Validation Responsibility

Validation in this library follows one rule: **the component validates and reports; the consumer decides what to do about it.**

- **The component's job** — Expose the browser's native validation constraints (`type`, `pattern`, `required`, `min`/`max`, etc.) on its underlying element, surface the _result_ of validation (valid/invalid, and an error message if invalid) through props the consumer already controls, and render that error state accessibly (`aria-invalid`, an associated error message).
- **The consumer's job** — Own the actual form state (the field's value, whether it's been touched, whether the form as a whole is submittable), decide when validation should run (on blur, on submit, on every keystroke), and decide what happens when a field is invalid (disable submit, show a summary, block navigation).

A component never manages its own submission blocking, its own "has this been touched yet" state, or its own retry logic for async validation — that's form-level state, and form-level state lives in the consuming application (see [Controlled vs. Uncontrolled](./form-patterns.md#controlled-vs-uncontrolled) in form-patterns.md). The component's scope stops at: given the current value, is it valid, and if not, why not.

This split keeps validation components simple and composable — a `TextField` doesn't need to know if it's part of a wizard, a modal, or a plain form, because it doesn't own any state about the form as a whole.

## HTML Validation

Prefer the browser's built-in constraint validation over hand-rolled JavaScript validation wherever it covers the case. It's free, works without JavaScript, and is already accessible.

```tsx
import { getDomProps, IChildlessComponentProps } from "./IComponent";
import styles from "../styles/text-field.module.css";

interface ITextFieldProps
  extends
    IChildlessComponentProps,
    Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      "className" | "id" | "style"
    > {
  label: string;
}

export function TextField(props: ITextFieldProps) {
  const { label, ...inputProps } = props;

  return (
    <div className={styles.field}>
      <label htmlFor={props.id} className={styles.label}>
        {label}
      </label>
      <input {...inputProps} {...getDomProps(props, styles.input)} />
    </div>
  );
}
```

Used with native constraints doing the validation work:

```tsx
<TextField id="email" label="Email" type="email" required />
<TextField
  id="zip"
  label="ZIP code"
  pattern="[0-9]{5}"
  title="Enter a 5-digit ZIP code"
/>
```

- `type="email"` gets email-shape validation, an appropriate mobile keyboard, and correct semantics for free.
- `pattern` covers shapes `type` doesn't (ZIP codes, phone numbers, custom IDs). Always pair `pattern` with a `title` — it's what many browsers show as the validation hint, and it's required for the constraint to be explainable to a screen reader user.
- `required`, `min`, `max`, `minLength`, `maxLength`, and `step` all work the same way: declare the constraint as an attribute, and the browser (and assistive technology) handles the rest.

Reach for JavaScript validation only when a constraint genuinely can't be expressed with native HTML attributes (cross-field validation — "confirm password" must match "password" — or a check that depends on data the browser doesn't have access to).

## Async Validation

Some validation can only happen server-side (username availability, an address that must be verified against an external service). The component's job here is still just to report a result — it doesn't own the network call.

The standard shape is a component that accepts an `error` prop the consumer sets after an async check completes, plus a way to hook a validation trigger (typically `onBlur`):

```tsx
interface IUsernameFieldProps extends ITextFieldProps {
  error?: string;
  validating?: boolean;
}

export function UsernameField(props: IUsernameFieldProps) {
  const { error, validating, ...fieldProps } = props;

  return (
    <div className={styles.field}>
      <TextField {...fieldProps} />
      {validating && (
        <span className={styles.hint}>Checking availability…</span>
      )}
      {error && (
        <span
          id={`${props.id}-error`}
          role="alert"
          className={classNames(styles.error, "ood-error")}
        >
          {error}
        </span>
      )}
    </div>
  );
}
```

The consumer owns the request, the debounce, and the loading state:

```tsx
function SignUpForm() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string>();
  const [validating, setValidating] = useState(false);

  const checkUsername = useDebouncedCallback(async (value: string) => {
    setValidating(true);
    const available = await api.checkUsernameAvailable(value);
    setValidating(false);
    setError(available ? undefined : "That username is taken.");
  }, 400);

  return (
    <UsernameField
      id="username"
      label="Username"
      value={username}
      error={error}
      validating={validating}
      onChange={(e) => {
        setUsername(e.target.value);
        checkUsername(e.target.value);
      }}
    />
  );
}
```

Keeping the debounce, the request, and the loading state in the consumer (rather than inside the component) means the component doesn't need to know anything about the API it's validating against — it stays reusable across every application that has a different backend for "is this username available."

## Error Display

An invalid field must be identifiable both visually and to assistive technology. Three things need to be true together:

1. **`aria-invalid={true}`** on the input, so a screen reader announces the field as invalid.
2. **`aria-describedby`** pointing at the id of the element containing the error message, so a screen reader reads the error text when the field is focused.
3. **A visible error message**, associated by that id, that doesn't rely on color alone to communicate the error (an icon or the word "Error"/"Invalid" alongside the theme's `ood-error` styling — never a red border as the only signal).

```tsx
import { classNames } from "../lib";

function FieldWithError(props: ITextFieldProps & { error?: string }) {
  const { error, id, ...rest } = props;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {props.label}
      </label>
      <input
        {...rest}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        className={classNames(styles.input, error && styles.inputError)}
      />
      {error && (
        <span
          id={errorId}
          role="alert"
          className={classNames(styles.error, "ood-error")}
        >
          {error}
        </span>
      )}
    </div>
  );
}
```

Notes on this pattern:

- `aria-invalid` is only set when there's an error (`undefined` otherwise), not toggled `true`/`false` — an absent attribute and `aria-invalid="false"` are treated differently by some assistive technology, so omitting it entirely when valid is the safer default.
- `role="alert"` on the error message means a screen reader announces it as soon as it appears, without the user needing to navigate to it — important for errors that show up after a blur or a failed submit, when focus may already have moved elsewhere.
- The error message's `id` must exist in the DOM before it's referenced by `aria-describedby` — conditionally rendering the error span (as above) means `aria-describedby` should also be conditional (`undefined` when there's no error), not pointing at an id that doesn't exist.
- Never rely on `styles.inputError`'s color alone. The `ood-error` utility class and any accompanying icon or text label together communicate the error state; color changes alone fail WCAG's "use of color" success criterion for users with color vision deficiencies.

## Validation Checklist

Before a form-input component is done, confirm:

- [ ] Native HTML validation attributes (`type`, `pattern`, `required`, `min`/`max`, etc.) are used wherever they cover the constraint, before reaching for custom JavaScript validation
- [ ] `pattern` is always paired with a `title` describing the expected format
- [ ] The component reports validation state through props (`error`, `validating`, etc.) rather than owning form-level state itself
- [ ] Async validation triggers, debouncing, and loading state are owned by the consumer, not the component
- [ ] `aria-invalid` is set (and only set) when the field is actually invalid
- [ ] `aria-describedby` points at an error message element that exists in the DOM whenever it's referenced
- [ ] The error message uses `role="alert"` so it's announced when it appears
- [ ] The invalid state is communicated by more than color alone
- [ ] The component's Storybook stories include an invalid/error state, and its automated a11y test covers that state
