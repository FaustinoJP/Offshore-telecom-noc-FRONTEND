"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Sidebar from "@/components/shell/Sidebar";
import Topbar from "@/components/shell/Topbar";
import Panel from "@/components/shell/Panel";
import { getSites } from "@/lib/api";

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
      <div style={{ display: "flex", background: "#0f172a" }}>
        <Sidebar />
        <main style={{ flex: 1, padding: 24 }}>
          <Topbar title="Sites" subtitle="Managed telecom sites" />
          <Panel title="Site Inventory">
            {error ? (
              <p style={{ color: "#f87171" }}>{error}</p>
            ) : (
              <pre style={{ color: "#cbd5e1", whiteSpace: "pre-wrap" }}>
                {JSON.stringify(sites, null, 2)}
              </pre>
            )}
          </Panel>
        </main>
      </div>
    </ProtectedRoute>
  );
}
