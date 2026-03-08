"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Sidebar from "@/components/shell/Sidebar";
import Topbar from "@/components/shell/Topbar";
import Panel from "@/components/shell/Panel";
import { getAlarms } from "@/lib/api";
import { getSocket } from "@/lib/socket";

function severityStyle(severity) {
  if (severity === "Critical") return { background: "#450a0a", color: "#f87171" };
  if (severity === "Major") return { background: "#451a03", color: "#fbbf24" };
  if (severity === "Warning") return { background: "#172554", color: "#60a5fa" };
  return { background: "#1e293b", color: "#cbd5e1" };
}

export default function AlarmsPage() {
  const [alarms, setAlarms] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getAlarms()
      .then((res) => setAlarms(res.data || []))
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    const socket = getSocket();

    socket.on("alarm.created", (alarm) => {
      setAlarms((current) => [alarm, ...current]);
    });

    socket.on("alarm.updated", (updatedAlarm) => {
      setAlarms((current) =>
        current.map((alarm) =>
          alarm.id === updatedAlarm.id ? updatedAlarm : alarm
        )
      );
    });

    return () => {
      socket.off("alarm.created");
      socket.off("alarm.updated");
    };
  }, []);

  return (
    <ProtectedRoute>
      <div style={{ display: "flex", background: "#0f172a", minHeight: "100vh" }}>
        <Sidebar />
        <main style={{ flex: 1, padding: 24 }}>
          <Topbar title="Alarms" subtitle="Alarm monitoring and severity tracking" />

          <Panel title="Alarm List">
            {error ? (
              <p style={{ color: "#f87171" }}>{error}</p>
            ) : (
              <div style={{ display: "grid", gap: 16 }}>
                {alarms.map((alarm) => (
                  <div
                    key={alarm.id}
                    style={{
                      background: "#0b1220",
                      border: "1px solid #1f2937",
                      borderRadius: 14,
                      padding: 16,
                      color: "white",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                      <span
                        style={{
                          ...severityStyle(alarm.severity),
                          padding: "6px 10px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {alarm.severity}
                      </span>
                      <span style={{ color: "#94a3b8", fontSize: 13 }}>{alarm.state}</span>
                    </div>

                    <div style={{ fontWeight: 700, marginBottom: 8 }}>{alarm.message}</div>
                    <div style={{ color: "#94a3b8", fontSize: 14 }}>
                      Site: {alarm.siteId} • Equipment: {alarm.equipment || "N/A"}
                    </div>
                    <div style={{ color: "#64748b", fontSize: 13, marginTop: 8 }}>
                      Started: {new Date(alarm.startedAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </main>
      </div>
    </ProtectedRoute>
  );
}
