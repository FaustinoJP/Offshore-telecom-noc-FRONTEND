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
          "radial-gradient(circle at top, #0b1730 0%, #08111f 45%, #050b16 100%)",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 460,
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            background: "rgba(9, 18, 37, 0.96)",
            border: "1px solid #1f2937",
            borderRadius: 24,
            padding: "40px 34px 32px",
            boxShadow: "0 18px 50px rgba(0,0,0,0.35)",
            color: "white",
            boxSizing: "border-box",
          }}
        >
          <div style={{ marginBottom: 28 }}>
            <h1
              style={{
                margin: 0,
                fontSize: 28,
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: 0.2,
              }}
            >
              Offshore Telecom NOC
            </h1>

            <p
              style={{
                margin: "12px 0 0 0",
                color: "#94a3b8",
                fontSize: 16,
                lineHeight: 1.5,
              }}
            >
              Sign in to continue
            </p>
          </div>

          <div style={{ display: "grid", gap: 16 }}>
            <div>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#cbd5e1",
                }}
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                autoComplete="email"
                style={{
                  width: "100%",
                  height: 54,
                  borderRadius: 14,
                  border: "1px solid #334155",
                  background: "#f8fafc",
                  color: "#0f172a",
                  fontSize: 17,
                  padding: "0 16px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#cbd5e1",
                }}
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="current-password"
                style={{
                  width: "100%",
                  height: 54,
                  borderRadius: 14,
                  border: "1px solid #334155",
                  background: "#f8fafc",
                  color: "#0f172a",
                  fontSize: 17,
                  padding: "0 16px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {error ? (
            <div
              style={{
                marginTop: 16,
                padding: "12px 14px",
                borderRadius: 12,
                background: "rgba(127, 29, 29, 0.22)",
                border: "1px solid rgba(248, 113, 113, 0.35)",
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
              height: 54,
              borderRadius: 14,
              border: "none",
              background: loading ? "#38bdf8aa" : "#0ea5e9",
              color: "white",
              fontSize: 18,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 8px 24px rgba(14,165,233,0.28)",
            }}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}
