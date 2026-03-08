"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Sidebar from "@/components/shell/Sidebar";
import Topbar from "@/components/shell/Topbar";
import Panel from "@/components/shell/Panel";
import { getSites } from "@/lib/api";

function statusStyle(status) {
  if (status === "Healthy") return { background: "#052e16", color: "#4ade80" };
  if (status === "Degraded") return { background: "#451a03", color: "#fbbf24" };
  if (status === "Down") return { background: "#450a0a", color: "#f87171" };
  return { background: "#1e293b", color: "#cbd5e1" };
}

export default function SitesPage() {
  const [sites, setSites] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getSites()
      .then((res) => setSites(res.data || []))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <ProtectedRoute>
      <div style={{ display: "flex", background: "#0f172a", minHeight: "100vh" }}>
        <Sidebar />
        <main style={{ flex: 1, padding: 24 }}>
          <Topbar title="Sites" subtitle="Managed telecom sites" />

          <Panel title="Site Inventory">
            {error ? (
              <p style={{ color: "#f87171" }}>{error}</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", color: "white" }}>
                  <thead>
                    <tr style={{ textAlign: "left", borderBottom: "1px solid #1f2937" }}>
                      <th style={{ padding: 12 }}>Name</th>
                      <th style={{ padding: 12 }}>Region</th>
                      <th style={{ padding: 12 }}>Technology</th>
                      <th style={{ padding: 12 }}>Status</th>
                      <th style={{ padding: 12 }}>Availability</th>
                      <th style={{ padding: 12 }}>Active Alarms</th>
                      <th style={{ padding: 12 }}>Last Seen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sites.map((site) => (
                      <tr key={site.id} style={{ borderBottom: "1px solid #1f2937" }}>
                        <td style={{ padding: 12 }}>{site.name}</td>
                        <td style={{ padding: 12 }}>{site.region}</td>
                        <td style={{ padding: 12 }}>{site.technology}</td>
                        <td style={{ padding: 12 }}>
                          <span
                            style={{
                              ...statusStyle(site.status),
                              padding: "6px 10px",
                              borderRadius: 999,
                              fontSize: 12,
                              fontWeight: 600,
                            }}
                          >
                            {site.status}
                          </span>
                        </td>
                        <td style={{ padding: 12 }}>{site.availability}%</td>
                        <td style={{ padding: 12 }}>{site.activeAlarms}</td>
                        <td style={{ padding: 12 }}>
                          {new Date(site.lastSeen).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>
        </main>
      </div>
    </ProtectedRoute>
  );
}
