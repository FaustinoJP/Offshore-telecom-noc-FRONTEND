export default function Topbar({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <p style={{ color: "#94a3b8", margin: 0 }}>Network Operations Center</p>
      <h1 style={{ color: "white", margin: "8px 0 0 0" }}>{title}</h1>
      {subtitle ? <p style={{ color: "#94a3b8" }}>{subtitle}</p> : null}
    </div>
  );
}
