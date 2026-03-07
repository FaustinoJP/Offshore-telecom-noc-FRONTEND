export default function Panel({ title, subtitle, children }) {
  return (
    <div
      style={{
        background: "#111827",
        border: "1px solid #1f2937",
        borderRadius: 16,
        padding: 20,
        color: "white",
      }}
    >
      <h3 style={{ margin: 0 }}>{title}</h3>
      {subtitle ? (
        <p style={{ color: "#94a3b8", marginTop: 6 }}>{subtitle}</p>
      ) : null}
      <div style={{ marginTop: 16 }}>{children}</div>
    </div>
  );
}
