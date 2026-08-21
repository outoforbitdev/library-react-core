export function IconVariations({
  Component,
}: {
  Component: React.ComponentType<any>;
}) {
  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      <div style={{ textAlign: "center" }}>
        <Component />
        <p>Default</p>
      </div>
      <div style={{ textAlign: "center" }}>
        <Component bordered />
        <p>Bordered</p>
      </div>
      <div
        style={{
          textAlign: "center",
          padding: "1rem",
          backgroundColor: "#f0f0f0",
        }}
      >
        <Component inverted />
        <p>Inverted</p>
      </div>
      <div
        style={{
          textAlign: "center",
          padding: "1rem",
          backgroundColor: "#f0f0f0",
        }}
      >
        <Component bordered inverted />
        <p>Bordered + Inverted</p>
      </div>
    </div>
  );
}
