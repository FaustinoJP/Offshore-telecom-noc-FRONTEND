"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Sidebar from "@/components/shell/Sidebar";
import Topbar from "@/components/shell/Topbar";
import Panel from "@/components/shell/Panel";
import { getDashboardSummary } from "@/lib/api";
import { getSocket } from "@/lib/socket";

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboardSummary()
      .then((res) => setSummary(res.data))
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    const socket = getSocket();

    socket.on("alarm.created", (alarm) => {
      setSummary((current) => {
        if (!current) return current;

        const next = { ...current };

        if (alarm.severity === "Critical") {
          next.criticalAlarms = (next.criticalAlarms || 0) + 1;
        }

        // como o simulador usa site-002 que está Down no seed,
        // mantemos a contagem coerente sem mexer à força aqui.
        return next;
      });
    });

    return () => {
      socket.off("alarm.created");
    };
  }, []);

  const cards = summary
    ? [
        ["Total Sites", summary.totalSites],
        ["Healthy", summary.activeSites],
        ["Degraded", summary.degradedSites],
        ["Down", summary.downSites],
        ["Critical Alarms", summary.criticalAlarms],
      ]
    : [];

  return (
    <ProtectedRoute>
      <div style={{ display: "flex", background: "#0f172a", minHeight: "100vh" }}>
        <Sidebar />
        <main style={{ flex: 1, padding: 24 }}>
          <Topbar title="Dashboard" subtitle="Operational overview of the telecom platform" />

          {error ? (
            <Panel title="Error">
              <p style={{ color: "#f87171" }}>{error}</p>
            </Panel>
          ) : !summary ? (
            <Panel title="Loading">
              <p style={{ color: "#cbd5e1" }}>Loading dashboard data...</p>
            </Panel>
          ) : (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: 16,
                  marginBottom: 24,
                }}
              >
                {cards.map(([label, value]) => (
                  <Panel key={label} title={label}>
                    <div style={{ fontSize: 32, fontWeight: 700, color: "white" }}>
                      {value}
                    </div>
                  </Panel>
                ))}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr",
                  gap: 16,
                }}
              >
                <Panel title="Network Availability">
                  <div style={{ fontSize: 42, fontWeight: 700, color: "#22c55e" }}>
                    {summary.availability24h}%
                  </div>
                  <p style={{ color: "#94a3b8", marginTop: 8 }}>
                    Rolling 24-hour service availability across monitored sites.
                  </p>
                </Panel>

                <Panel title="Operational Status">
                  <div style={{ display: "grid", gap: 12 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "12px 14px",
                        borderRadius: 12,
                        background: "#0b1220",
                        color: "white",
                      }}
                    >
                      <span>Healthy Sites</span>
                      <strong>{summary.activeSites}</strong>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "12px 14px",
                        borderRadius: 12,
                        background: "#0b1220",
                        color: "white",
                      }}
                    >
                      <span>Degraded Sites</span>
                      <strong>{summary.degradedSites}</strong>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "12px 14px",
                        borderRadius: 12,
                        background: "#0b1220",
                        color: "white",
                      }}
                    >
                      <span>Down Sites</span>
                      <strong>{summary.downSites}</strong>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "12px 14px",
                        borderRadius: 12,
                        background: "#0b1220",
                        color: "white",
                      }}
                    >
                      <span>Critical Alarms</span>
                      <strong>{summary.criticalAlarms}</strong>
                    </div>
                  </div>
                </Panel>
              </div>
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
