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

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const result = await login(email, password);
      saveToken(result.data.token);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f172a",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: 380,
          background: "#111827",
          padding: 28,
          borderRadius: 16,
          border: "1px solid #1f2937",
          color: "white",
        }}
      >
        <h1 style={{ marginTop: 0 }}>Offshore Telecom NOC</h1>
        <p style={{ color: "#94a3b8" }}>Sign in to continue</p>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          style={{ width: "100%", padding: 12, marginBottom: 12, borderRadius: 10 }}
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={{ width: "100%", padding: 12, marginBottom: 12, borderRadius: 10 }}
        />

        {error ? <p style={{ color: "#f87171" }}>{error}</p> : null}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 10,
            border: "none",
            background: "#0ea5e9",
            color: "white",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </form>
    </main>
  );
}
