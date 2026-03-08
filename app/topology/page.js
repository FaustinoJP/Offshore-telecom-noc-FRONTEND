"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Sidebar from "@/components/shell/Sidebar";
import Topbar from "@/components/shell/Topbar";
import Panel from "@/components/shell/Panel";
import { getTopologyNodes, getTopologyLinks } from "@/lib/api";

const TopologyView = dynamic(() => import("@/components/topology/TopologyView"), {
  ssr: false,
});


export default function TopologyPage() {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getTopologyNodes(), getTopologyLinks()])
      .then(([nodesRes, linksRes]) => {
        setNodes(nodesRes.data || []);
        setLinks(linksRes.data || []);
      })
      .catch((err) => setError(err.message));
  }, []);

  return (
    <ProtectedRoute>
      <div style={{ display: "flex", background: "#0f172a", minHeight: "100vh" }}>
        <Sidebar />
        <main style={{ flex: 1, padding: 24 }}>
          <Topbar
            title="Topology"
            subtitle="Logical view of the network core, hubs, sites and transport links"
          />

          <Panel title="Topology Graph" subtitle="Visual network path and node health">
            {error ? (
              <p style={{ color: "#f87171" }}>{error}</p>
            ) : (
              <TopologyView nodes={nodes} links={links} />
            )}
          </Panel>
        </main>
      </div>
    </ProtectedRoute>
  );
}
