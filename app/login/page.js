"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { saveToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [now, setNow] = useState(new Date());
  const [email, setEmail] = useState("admin@nocsystem.local");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);

    function handleResize() {
      setIsMobile(window.innerWidth < 920);
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(timer);
    };
  }, []);

  const formattedDate = useMemo(
    () =>
      now.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    [now]
  );

  const formattedTime = useMemo(
    () =>
      now.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    [now]
  );

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

  if (!mounted) return null;

  return (
    <main
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(circle at top, #0c1c38 0%, #08111f 38%, #040914 100%)",
        padding: isMobile ? 16 : 24,
        display: "grid",
        placeItems: "center",
      }}
    >
      <BackgroundFX />

      <div
        style={{
          width: "100%",
          maxWidth: 1180,
          position: "relative",
          zIndex: 2,
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1.1fr 0.9fr",
          borderRadius: 30,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
          background: "rgba(6, 13, 25, 0.78)",
          backdropFilter: "blur(16px)",
        }}
      >
        <section
          style={{
            padding: isMobile ? "28px 22px" : "54px 50px",
            borderRight: isMobile ? "none" : "1px solid rgba(255,255,255,0.06)",
            borderBottom: isMobile ? "1px solid rgba(255,255,255,0.06)" : "none",
            background:
              "linear-gradient(180deg, rgba(8,18,36,0.88) 0%, rgba(4,10,22,0.92) 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 28,
            minHeight: isMobile ? "auto" : 700,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                flexWrap: "wrap",
                marginBottom: 26,
              }}
            >
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
                  fontWeight: 800,
                  letterSpacing: 0.4,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    background: "#22c55e",
                    boxShadow: "0 0 14px #22c55e",
                  }}
                />
                PLATFORM ONLINE
              </div>

              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  minWidth: isMobile ? "100%" : 220,
                }}
              >
                <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 4 }}>
                  System Time
                </div>
                <div style={{ color: "white", fontWeight: 800, fontSize: 18 }}>
                  {formattedTime}
                </div>
                <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 4 }}>
                  {formattedDate}
                </div>
              </div>
            </div>

            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 22,
                background: "linear-gradient(135deg, #0ea5e9, #2563eb)",
                display: "grid",
                placeItems: "center",
                color: "white",
                fontWeight: 900,
                fontSize: 28,
                boxShadow: "0 16px 40px rgba(37,99,235,0.32)",
                marginBottom: 24,
              }}
            >
              N
            </div>

            <h1
              style={{
                margin: 0,
                color: "white",
                fontSize: isMobile ? 30 : 46,
                lineHeight: 1.04,
                fontWeight: 900,
                maxWidth: 620,
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
                fontSize: isMobile ? 15 : 17,
                lineHeight: 1.75,
                maxWidth: 620,
              }}
            >
              Enterprise-grade visibility for offshore telecom infrastructure,
              transport links, incidents, alarms, topology intelligence, and live operational control.
            </p>
          </div>

          <div style={{ display: "grid", gap: 16 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
                gap: 14,
              }}
            >
              <InfoTile title="Live Alarms" value="Realtime" accent="#ef4444" />
              <InfoTile title="Network Map" value="Geospatial" accent="#22c55e" />
              <InfoTile title="Topology" value="Logical" accent="#f59e0b" />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1.15fr 0.85fr",
                gap: 14,
              }}
            >
              <CardBlock title="Operational Modules">
                Dashboard • Sites • Alarms • Incidents • Network Map • Topology • Command Center
              </CardBlock>

              <CardBlock title="Security Profile">
                JWT Auth • Protected Routes • Realtime Socket Session
              </CardBlock>
            </div>

            <div
              style={{
                padding: 18,
                borderRadius: 18,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              //<div style={{ color: "#e2e8f0", fontWeight: 800, marginBottom: 8 }}>
               // Recommended Demo Credentials
              
        </section>

        <section
          style={{
            padding: isMobile ? "28px 22px" : "54px 42px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(180deg, rgba(7,15,28,0.95) 0%, rgba(4,9,18,0.98) 100%)",
          }}
        >
          <div style={{ width: "100%", maxWidth: 430 }}>
            <div style={{ marginBottom: 28 }}>
              <div
                style={{
                  color: "#60a5fa",
                  fontSize: 13,
                  fontWeight: 800,
                  letterSpacing: 1.1,
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                Secure Access
              </div>

              <h2
                style={{
                  margin: 0,
                  color: "white",
                  fontSize: isMobile ? 28 : 32,
                  fontWeight: 900,
                }}
              >
                Sign in to continue
              </h2>

              <p
                style={{
                  margin: "10px 0 0 0",
                  color: "#94a3b8",
                  fontSize: 15,
                  lineHeight: 1.7,
                }}
              >
                Access the operations environment and manage alarms, incidents, map and topology in real time.
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
                  height: 58,
                  border: "none",
                  borderRadius: 16,
                  background: loading ? "#38bdf8aa" : "linear-gradient(135deg, #0ea5e9, #2563eb)",
                  color: "white",
                  fontSize: 17,
                  fontWeight: 900,
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: "0 16px 34px rgba(14,165,233,0.28)",
                }}
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>

            <div
              style={{
                marginTop: 18,
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
                color: "#64748b",
                fontSize: 13,
              }}
            >
              <span>Protected operational access</span>
              <span>Realtime monitoring enabled</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function BackgroundFX() {
  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "34px 34px",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.75), rgba(0,0,0,0.25))",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: -120,
          left: -80,
          width: 360,
          height: 360,
          borderRadius: 999,
          background: "radial-gradient(circle, rgba(14,165,233,0.22), transparent 70%)",
          filter: "blur(6px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: -120,
          right: -80,
          width: 420,
          height: 420,
          borderRadius: 999,
          background: "radial-gradient(circle, rgba(37,99,235,0.18), transparent 70%)",
          filter: "blur(8px)",
          pointerEvents: "none",
        }}
      />
    </>
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

function CardBlock({ title, children }) {
  return (
    <div
      style={{
        padding: 18,
        borderRadius: 18,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={{ color: "#e2e8f0", fontWeight: 800, marginBottom: 8 }}>{title}</div>
      <div style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.7 }}>{children}</div>
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
