"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getDashboardSummary, getMapSites, getMapLinks, getTopologyNodes, getTopologyLinks, getAlarms, getIncidents } from "@/lib/api";
import { getSocket } from "@/lib/socket";

const NetworkMap = dynamic(() => import("@/components/maps/NetworkMap"), {
  ssr: false,
});

const TopologyView = dynamic(() => import("@/components/topology/TopologyView"), {
  ssr: false,
});

function kpiCard(title, value, accent = "#22c55e") {
  return (
    <div
      style={{
        background: "#081225",
        border: "1px solid #1f2937",
        borderRadius: 18,
        padding: 18,
        minHeight: 110,
        boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
      }}
    >
      <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 10 }}>{title}</div>
      <div style={{ color: "white", fontSize: 36, fontWeight: 800, lineHeight: 1 }}>
        {value}
      </div>
      <div
        style={{
          marginTop: 14,
          width: 42,
          height: 4,
          borderRadius: 999,
          background: accent,
        }}
      />
    </div>
  );
}

function severityStyle(severity) {
  if (severity === "Critical") return { bg: "#450a0a", color: "#f87171" };
  if (severity === "Major") return { bg: "#451a03", color: "#fbbf24" };
  if (severity === "Warning") return { bg: "#172554", color: "#60a5fa" };
  return { bg: "#1e293b", color: "#cbd5e1" };
}

export default function CommandCenterPage() {
  const [summary, setSummary] = useState(null);
  const [sites, setSites] = useState([]);
  const [links, setLinks] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [topologyLinks, setTopologyLinks] = useState([]);
  const [alarms, setAlarms] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      getDashboardSummary(),
      getMapSites(),
      getMapLinks(),
      getTopologyNodes(),
      getTopologyLinks(),
      getAlarms(),
      getIncidents(),
    ])
      .then(([summaryRes, sitesRes, linksRes, nodesRes, topologyLinksRes, alarmsRes, incidentsRes]) => {
        setSummary(summaryRes.data || null);
        setSites(sitesRes.data || []);
        setLinks(linksRes.data || []);
        setNodes(nodesRes.data || []);
        setTopologyLinks(topologyLinksRes.data || []);
        setAlarms(alarmsRes.data || []);
        setIncidents(incidentsRes.data || []);
      })
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    const socket = getSocket();

    socket.on("alarm.created", (alarm) => {
      setAlarms((current) => [alarm, ...current]);

      setSummary((current) => {
        if (!current) return current;
        return {
          ...current,
          criticalAlarms:
            alarm.severity === "Critical"
              ? (current.criticalAlarms || 0) + 1
              : current.criticalAlarms,
        };
      });

      setSites((current) =>
        current.map((site) =>
          site.id === alarm.siteId
            ? {
                ...site,
                status: "Down",
                activeAlarms: (site.activeAlarms || 0) + 1,
                lastSeen: alarm.startedAt || new Date().toISOString(),
              }
            : site
        )
      );

      setNodes((current) =>
        current.map((node) =>
          node.id === alarm.siteId
            ? {
                ...node,
                status: "Down",
                activeAlarms: (node.activeAlarms || 0) + 1,
              }
            : node
        )
      );
    });

    return () => {
      socket.off("alarm.created");
    };
  }, []);

  const recentAlarms = useMemo(() => alarms.slice(0, 6), [alarms]);
  const recentIncidents = useMemo(() => incidents.slice(0, 5), [incidents]);

  return (
    <ProtectedRoute>
      <main
        style={{
          minHeight: "100vh",
          background: "radial-gradient(circle at top, #0b1730 0%, #08111f 45%, #050b16 100%)",
          color: "white",
          padding: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 18,
          }}
        >
          <div>
            <div style={{ color: "#60a5fa", fontSize: 13, letterSpacing: 1.2 }}>
              OFFSHORE TELECOM NOC
            </div>
            <h1 style={{ margin: "8px 0 0 0", fontSize: 34 }}>Command Center</h1>
          </div>

          <div
            style={{
              padding: "10px 14px",
              borderRadius: 14,
              background: "#081225",
              border: "1px solid #1f2937",
              color: "#cbd5e1",
              fontSize: 14,
            }}
          >
            Live Monitoring Screen
          </div>
        </div>

        {error ? (
          <div
            style={{
              background: "#2a0f0f",
              color: "#fecaca",
              border: "1px solid #7f1d1d",
              padding: 16,
              borderRadius: 14,
            }}
          >
            {error}
          </div>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: 14,
                marginBottom: 18,
              }}
            >
              {kpiCard("Total Sites", summary?.totalSites ?? "-")}
              {kpiCard("Healthy", summary?.activeSites ?? "-", "#22c55e")}
              {kpiCard("Degraded", summary?.degradedSites ?? "-", "#f59e0b")}
              {kpiCard("Down", summary?.downSites ?? "-", "#ef4444")}
              {kpiCard("Critical Alarms", summary?.criticalAlarms ?? "-", "#dc2626")}
            </div>

            <div
              style={{
                background: "#081225",
                border: "1px solid #1f2937",
                borderRadius: 18,
                padding: "12px 14px",
                marginBottom: 18,
                overflow: "hidden",
              }}
            >
              <div style={{ display: "flex", gap: 16, whiteSpace: "nowrap", overflow: "hidden" }}>
                <strong style={{ color: "#f87171" }}>LIVE ALARMS</strong>
                <div
                  style={{
                    display: "inline-flex",
                    gap: 24,
                    minWidth: "100%",
                    animation: "ticker 30s linear infinite",
                  }}
                >
                  {recentAlarms.map((alarm) => (
                    <span key={alarm.id} style={{ color: "#e2e8f0" }}>
                      [{alarm.severity}] {alarm.message} ({alarm.siteId})
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.35fr 1fr",
                gap: 18,
                marginBottom: 18,
              }}
            >
              <section
                style={{
                  background: "#081225",
                  border: "1px solid #1f2937",
                  borderRadius: 18,
                  padding: 14,
                }}
              >
                <div style={{ marginBottom: 12, color: "#94a3b8" }}>Network Map</div>
                <NetworkMap sites={sites} links={links} />
              </section>

              <section
                style={{
                  background: "#081225",
                  border: "1px solid #1f2937",
                  borderRadius: 18,
                  padding: 14,
                }}
              >
                <div style={{ marginBottom: 12, color: "#94a3b8" }}>Active Incidents</div>
                <div style={{ display: "grid", gap: 12 }}>
                  {recentIncidents.map((incident) => (
                    <div
                      key={incident.id}
                      style={{
                        background: "#0b1220",
                        border: "1px solid #1f2937",
                        borderRadius: 14,
                        padding: 14,
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                        <strong>{incident.title}</strong>
                        <span style={{ color: "#94a3b8" }}>{incident.status}</span>
                      </div>
                      <div style={{ marginTop: 8, color: "#94a3b8", fontSize: 14 }}>
                        Site: {incident.siteId} • Owner: {incident.owner}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.4fr 0.9fr",
                gap: 18,
              }}
            >
              <section
                style={{
                  background: "#081225",
                  border: "1px solid #1f2937",
                  borderRadius: 18,
                  padding: 14,
                }}
              >
                <div style={{ marginBottom: 12, color: "#94a3b8" }}>Topology</div>
                <TopologyView nodes={nodes} links={topologyLinks} />
              </section>

              <section
                style={{
                  background: "#081225",
                  border: "1px solid #1f2937",
                  borderRadius: 18,
                  padding: 14,
                }}
              >
                <div style={{ marginBottom: 12, color: "#94a3b8" }}>Alarm Queue</div>
                <div style={{ display: "grid", gap: 12 }}>
                  {recentAlarms.map((alarm) => {
                    const sev = severityStyle(alarm.severity);
                    return (
                      <div
                        key={alarm.id}
                        style={{
                          background: "#0b1220",
                          border: "1px solid #1f2937",
                          borderRadius: 14,
                          padding: 14,
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                          <span
                            style={{
                              background: sev.bg,
                              color: sev.color,
                              borderRadius: 999,
                              padding: "6px 10px",
                              fontSize: 12,
                              fontWeight: 700,
                            }}
                          >
                            {alarm.severity}
                          </span>
                          <span style={{ color: "#94a3b8", fontSize: 13 }}>{alarm.state}</span>
                        </div>
                        <div style={{ marginTop: 10, fontWeight: 700 }}>{alarm.message}</div>
                        <div style={{ marginTop: 6, color: "#94a3b8", fontSize: 14 }}>
                          {alarm.siteId} • {alarm.equipment || "N/A"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          </>
        )}

        <style jsx global>{`
          @keyframes ticker {
            0% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `}</style>
      </main>
    </ProtectedRoute>
  );
}
