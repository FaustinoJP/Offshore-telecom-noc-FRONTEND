"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Sidebar from "@/components/shell/Sidebar";
import Topbar from "@/components/shell/Topbar";
import Panel from "@/components/shell/Panel";
import { getIncidents } from "@/lib/api";

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
      <div style={{ display: "flex", background: "#0f172a" }}>
        <Sidebar />
        <main style={{ flex: 1, padding: 24 }}>
          <Topbar title="Incidents" subtitle="Operational incident tracking" />
          <Panel title="Incident List">
            {error ? (
              <p style={{ color: "#f87171" }}>{error}</p>
            ) : (
              <pre style={{ color: "#cbd5e1", whiteSpace: "pre-wrap" }}>
                {JSON.stringify(incidents, null, 2)}
              </pre>
            )}
          </Panel>
        </main>
      </div>
    </ProtectedRoute>
  );
}
