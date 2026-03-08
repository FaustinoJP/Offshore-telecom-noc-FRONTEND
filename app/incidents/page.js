"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Sidebar from "@/components/shell/Sidebar";
import Topbar from "@/components/shell/Topbar";
import Panel from "@/components/shell/Panel";
import { getIncidents } from "@/lib/api";

function priorityStyle(priority) {
  if (priority === "High") return { background: "#450a0a", color: "#f87171" };
  if (priority === "Medium") return { background: "#451a03", color: "#fbbf24" };
  return { background: "#172554", color: "#60a5fa" };
}

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getIncidents()
      .then((res) => setIncidents(res.data || []))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <ProtectedRoute>
      <div style={{ display: "flex", background: "#0f172a", minHeight: "100vh" }}>
        <Sidebar />
        <main style={{ flex: 1, padding: 24 }}>
          <Topbar title="Incidents" subtitle="Operational incident tracking" />

          <Panel title="Incident List">
            {error ? (
              <p style={{ color: "#f87171" }}>{error}</p>
            ) : (
              <div style={{ display: "grid", gap: 16 }}>
                {incidents.map((incident) => (
                  <div
                    key={incident.id}
                    style={{
                      background: "#0b1220",
                      border: "1px solid #1f2937",
                      borderRadius: 14,
                      padding: 16,
                      color: "white",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                      <div style={{ fontWeight: 700 }}>{incident.title}</div>
                      <span
                        style={{
                          ...priorityStyle(incident.priority),
                          padding: "6px 10px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {incident.priority}
                      </span>
                    </div>

                    <div style={{ color: "#94a3b8", fontSize: 14 }}>
                      Site: {incident.siteId} • Owner: {incident.owner}
                    </div>
                    <div style={{ color: "#cbd5e1", marginTop: 8 }}>Status: {incident.status}</div>
                    <div style={{ color: "#64748b", fontSize: 13, marginTop: 8 }}>
                      Opened: {new Date(incident.openedAt).toLocaleString()}
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
