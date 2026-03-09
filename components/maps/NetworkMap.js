"use client";

import { MapContainer, TileLayer, CircleMarker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function getStatusColor(status) {
  if (status === "Healthy") return "#22c55e";
  if (status === "Degraded") return "#f59e0b";
  if (status === "Down") return "#ef4444";
  return "#94a3b8";
}

export default function NetworkMap({ sites = [], links = [] }) {
  const siteMap = Object.fromEntries(sites.map((site) => [site.id, site]));

  const center =
    sites.length > 0
      ? [sites[0].lat || -8.8383, sites[0].lng || 13.2344]
      : [-8.8383, 13.2344];

  return (
    <div
      style={{
        height: "700px",
        width: "100%",
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid #1f2937",
      }}
    >
      <MapContainer center={center} zoom={6} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {links.map((link) => {
          const fromSite = siteMap[link.from];
          const toSite = siteMap[link.to];

          if (!fromSite || !toSite) return null;
          if (fromSite.lat == null || fromSite.lng == null) return null;
          if (toSite.lat == null || toSite.lng == null) return null;

          return (
            <Polyline
              key={link.id}
              positions={[
                [fromSite.lat, fromSite.lng],
                [toSite.lat, toSite.lng],
              ]}
              pathOptions={{
                color: getStatusColor(link.status),
                weight: 4,
                opacity: 0.85,
              }}
            >
              <Popup>
                <div style={{ minWidth: 220 }}>
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>{link.name}</div>
                  <div><strong>Type:</strong> {link.type}</div>
                  <div><strong>Status:</strong> {link.status}</div>
                  <div><strong>Utilization:</strong> {link.utilization}%</div>
                  <div><strong>Latency:</strong> {link.latency} ms</div>
                  <div style={{ marginTop: 8 }}>
                    <strong>Path:</strong> {fromSite.name} → {toSite.name}
                  </div>
                </div>
              </Popup>
            </Polyline>
          );
        })}

        {sites.map((site) => {
          if (site.lat == null || site.lng == null) return null;

          return (
               <CircleMarker
                  key={site.id}
                  center={[site.lat, site.lng]}
                  radius={site.status === "Down" ? 16 : site.status === "Degraded" ? 14 : 12}
                  pathOptions={{
                    color: getStatusColor(site.status),
                    fillColor: getStatusColor(site.status),
                    fillOpacity: 0.9,
                    weight: site.status === "Down" ? 4 : 2,
                  }}
                >
              <Popup>
                <div style={{ minWidth: 220 }}>
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>{site.name}</div>
                  <div><strong>Region:</strong> {site.region}</div>
                  <div><strong>Technology:</strong> {site.technology}</div>
                  <div><strong>Status:</strong> {site.status}</div>
                  <div><strong>Availability:</strong> {site.availability}%</div>
                  <div><strong>Active Alarms:</strong> {site.activeAlarms}</div>
                  <div><strong>Last Seen:</strong> {new Date(site.lastSeen).toLocaleString()}</div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
