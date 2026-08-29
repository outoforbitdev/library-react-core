export function ThemePalette({
  Component,
}: {
  Component: React.ComponentType<any>;
}) {
  return (
    <div className="ood-primary" style={{ padding: "1rem 0rem" }}>
      <span style={{ padding: "0.5rem" }}>
        <Component className="ood-primary" />
      </span>
      <span style={{ padding: "0.5rem" }}>
        <Component className="ood-secondary" />
      </span>
      <span style={{ padding: "0.5rem" }}>
        <Component className="ood-accent" />
      </span>
      <span style={{ padding: "0.5rem" }}>
        <Component className="ood-accent-block" />
      </span>
      <span style={{ padding: "0.5rem" }}>
        <Component className="ood-submit" />
      </span>
      <span style={{ padding: "0.5rem" }}>
        <Component className="ood-submit-block" />
      </span>
      <span style={{ padding: "0.5rem" }}>
        <Component className="ood-warning" />
      </span>
      <span style={{ padding: "0.5rem" }}>
        <Component className="ood-warning-block" />
      </span>
      <span style={{ padding: "0.5rem" }}>
        <Component className="ood-error" />
      </span>
      <span style={{ padding: "0.5rem" }}>
        <Component className="ood-error-block" />
      </span>
    </div>
  );
}
