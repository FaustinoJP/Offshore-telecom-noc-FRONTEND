"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Sidebar from "@/components/shell/Sidebar";
import Topbar from "@/components/shell/Topbar";
import Panel from "@/components/shell/Panel";
import { getMapSites, getMapLinks } from "@/lib/api";

export default function NetworkMapPage() {
  const [data, setData] = useState({ sites: [], links: [] });
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getMapSites(), getMapLinks()])
      .then(([sites, links]) => {
        setData({
          sites: sites.data || [],
          links: links.data || [],
        });
      })
      .catch((err) => setError(err.message));
  }, []);

  return (
    <ProtectedRoute>
      <div style={{ display: "flex", background: "#0f172a" }}>
        <Sidebar />
        <main style={{ flex: 1, padding: 24 }}>
          <Topbar title="Network Map" subtitle="Geographic view of the network" />
          <Panel title="Map Data">
            {error ? (
              <p style={{ color: "#f87171" }}>{error}</p>
            ) : (
              <pre style={{ color: "#cbd5e1", whiteSpace: "pre-wrap" }}>
                {JSON.stringify(data, null, 2)}
              </pre>
            )}
          </Panel>
        </main>
      </div>
    </ProtectedRoute>
  );
}
