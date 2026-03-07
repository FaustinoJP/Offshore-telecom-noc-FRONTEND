"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Sidebar from "@/components/shell/Sidebar";
import Topbar from "@/components/shell/Topbar";
import Panel from "@/components/shell/Panel";

export default function DashboardPage() {
  const cards = [
    ["Total Sites", "128"],
    ["Healthy", "119"],
    ["Degraded", "3"],
    ["Down", "6"],
    ["Critical Alarms", "14"],
  ];

  return (
    <ProtectedRoute>
      <div style={{ display: "flex", background: "#0f172a" }}>
        <Sidebar />
        <main style={{ flex: 1, padding: 24 }}>
          <Topbar title="Dashboard" subtitle="Operational overview of the telecom platform" />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
            {cards.map(([label, value]) => (
              <Panel key={label} title={label}>
                <div style={{ fontSize: 32, fontWeight: 700, color: "white" }}>{value}</div>
              </Panel>
            ))}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
