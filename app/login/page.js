"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { saveToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@nocsystem.local");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password);
      saveToken(result.data.token);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background:
          "radial-gradient(circle at top, #0b1730 0%, #08111f 42%, #050b16 100%)",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1100,
          display: "grid",
          gridTemplateColumns: "1.05fr 0.95fr",
          borderRadius: 28,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 25px 70px rgba(0,0,0,0.42)",
          background: "rgba(8, 17, 31, 0.88)",
          backdropFilter: "blur(10px)",
        }}
      >
        <section
          style={{
            padding: "56px 48px",
            background:
              "linear-gradient(180deg, rgba(10,20,40,0.95) 0%, rgba(5,12,24,0.92) 100%)",
            borderRight: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: 620,
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 14px",
                borderRadius: 999,
                background: "rgba(14,165,233,0.12)",
                border: "1px solid rgba(56,189,248,0.25)",
                color: "#7dd3fc",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 0.4,
                marginBottom: 26,
              }}
            >
              ● LIVE NETWORK OPERATIONS
            </div>

            <h1
              style={{
                margin: 0,
                color: "white",
                fontSize: 42,
                lineHeight: 1.08,
                fontWeight: 800,
                maxWidth: 520,
              }}
            >
              Offshore Telecom
              <br />
              Network Operations Center
            </h1>

            <p
              style={{
                marginTop: 18,
                color: "#94a3b8",
                fontSize: 17,
                lineHeight: 1.7,
                maxWidth: 560,
              }}
            >
              Centralized monitoring for offshore telecom infrastructure,
              transport links, alarms, incidents, topology, and real-time service visibility.
            </p>
          </div>

          <div style={{ display: "grid", gap: 14 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 14,
              }}
            >
              <InfoTile title="Live Alarms" value="Realtime" accent="#ef4444" />
              <InfoTile title="Network Map" value="Geospatial" accent="#22c55e" />
              <InfoTile title="Topology" value="Logical View" accent="#f59e0b" />
            </div>

            <div
              style={{
                padding: 18,
                borderRadius: 18,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div style={{ color: "#e2e8f0", fontWeight: 700, marginBottom: 8 }}>
                Operational Modules
              </div>
              <div
                style={{
                  color: "#94a3b8",
                  fontSize: 14,
                  lineHeight: 1.7,
                }}
              >
                Dashboard • Sites • Alarms • Incidents • Network Map • Topology • Command Center
              </div>
            </div>
          </div>
        </section>

        <section
          style={{
            padding: "56px 42px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(180deg, rgba(7,16,30,0.92) 0%, rgba(4,10,21,0.96) 100%)",
          }}
        >
          <div style={{ width: "100%", maxWidth: 420 }}>
            <div
              style={{
                marginBottom: 26,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 18,
                  background: "linear-gradient(135deg, #0ea5e9, #2563eb)",
                  display: "grid",
                  placeItems: "center",
                  color: "white",
                  fontWeight: 900,
                  fontSize: 22,
                  boxShadow: "0 14px 28px rgba(37,99,235,0.28)",
                  marginBottom: 18,
                }}
              >
                N
              </div>

              <h2
                style={{
                  margin: 0,
                  color: "white",
                  fontSize: 30,
                  fontWeight: 800,
                }}
              >
                Sign in
              </h2>

              <p
                style={{
                  margin: "10px 0 0 0",
                  color: "#94a3b8",
                  fontSize: 15,
                  lineHeight: 1.6,
                }}
              >
                Access the command environment and monitor the telecom estate in real time.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gap: 18 }}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  autoComplete="email"
                  style={inputStyle}
                />

                <FieldLabel htmlFor="password">Password</FieldLabel>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  autoComplete="current-password"
                  style={inputStyle}
                />
              </div>

              {error ? (
                <div
                  style={{
                    marginTop: 16,
                    padding: "12px 14px",
                    borderRadius: 14,
                    background: "rgba(127,29,29,0.2)",
                    border: "1px solid rgba(248,113,113,0.32)",
                    color: "#fca5a5",
                    fontSize: 14,
                  }}
                >
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: 22,
                  width: "100%",
                  height: 56,
                  border: "none",
                  borderRadius: 16,
                  background: loading ? "#38bdf8aa" : "linear-gradient(135deg, #0ea5e9, #2563eb)",
                  color: "white",
                  fontSize: 17,
                  fontWeight: 800,
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: "0 14px 30px rgba(14,165,233,0.25)",
                }}
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>

            <div
              style={{
                marginTop: 18,
                color: "#64748b",
                fontSize: 13,
                lineHeight: 1.6,
              }}
            >
              Secure access to offshore monitoring, service alarms, incident management,
              topology intelligence, and live operational views.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoTile({ title, value, accent }) {
  return (
    <div
      style={{
        padding: 16,
        borderRadius: 16,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 10 }}>{title}</div>
      <div style={{ color: "white", fontWeight: 800, fontSize: 18 }}>{value}</div>
      <div
        style={{
          marginTop: 10,
          width: 36,
          height: 4,
          borderRadius: 999,
          background: accent,
        }}
      />
    </div>
  );
}

function FieldLabel({ htmlFor, children }) {
  return (
    <label
      htmlFor={htmlFor}
      style={{
        display: "block",
        marginBottom: -6,
        fontSize: 13,
        fontWeight: 700,
        color: "#cbd5e1",
      }}
    >
      {children}
    </label>
  );
}

const inputStyle = {
  width: "100%",
  height: 56,
  borderRadius: 16,
  border: "1px solid #334155",
  background: "#f8fafc",
  color: "#0f172a",
  fontSize: 17,
  padding: "0 16px",
  outline: "none",
  boxSizing: "border-box",
};
