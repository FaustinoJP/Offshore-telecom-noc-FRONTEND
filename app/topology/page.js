"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Sidebar from "@/components/shell/Sidebar";
import Topbar from "@/components/shell/Topbar";
import Panel from "@/components/shell/Panel";
import { getTopologyNodes, getTopologyLinks } from "@/lib/api";

export default function TopologyPage() {
  const [data, setData] = useState({ nodes: [], links: [] });
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getTopologyNodes(), getTopologyLinks()])
      .then(([nodes, links]) => {
        setData({
          nodes: nodes.data || [],
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
          <Topbar title="Topology" subtitle="Logical view of the network" />
          <Panel title="Topology Data">
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
