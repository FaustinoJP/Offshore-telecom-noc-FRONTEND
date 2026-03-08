"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Sidebar from "@/components/shell/Sidebar";
import Topbar from "@/components/shell/Topbar";
import Panel from "@/components/shell/Panel";
import { getMapSites, getMapLinks } from "@/lib/api";
import { getSocket } from "@/lib/socket";

const NetworkMap = dynamic(() => import("@/components/maps/NetworkMap"), {
  ssr: false,
});

export default function NetworkMapPage() {
  const [sites, setSites] = useState([]);
  const [links, setLinks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getMapSites(), getMapLinks()])
      .then(([sitesRes, linksRes]) => {
        setSites(sitesRes.data || []);
        setLinks(linksRes.data || []);
      })
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    const socket = getSocket();

    socket.on("alarm.created", (alarm) => {
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
    });

    socket.on("alarm.updated", (updatedAlarm) => {
      setSites((current) =>
        current.map((site) =>
          site.id === updatedAlarm.siteId
            ? {
                ...site,
                lastSeen: updatedAlarm.startedAt || site.lastSeen,
              }
            : site
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
          <Topbar
            title="Network Map"
            subtitle="Geographic visibility of telecom sites and inter-site links"
          />

          <Panel title="Live Network Map" subtitle="Site health and transport links">
            {error ? (
              <p style={{ color: "#f87171" }}>{error}</p>
            ) : (
              <NetworkMap sites={sites} links={links} />
            )}
          </Panel>
        </main>
      </div>
    </ProtectedRoute>
  );
}
