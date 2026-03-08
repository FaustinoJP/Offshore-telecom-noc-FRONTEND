"use client";

import React, { useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";

function getStatusColor(status) {
  if (status === "Healthy") return "#22c55e";
  if (status === "Degraded") return "#f59e0b";
  if (status === "Down") return "#ef4444";
  return "#94a3b8";
}

function buildNodePosition(type, index, groupIndex = 0) {
  if (type === "core") {
    return { x: 420, y: 40 };
  }

  if (type === "hub") {
    return { x: 420, y: 180 + groupIndex * 40 };
  }

  return {
    x: 140 + (index % 3) * 280,
    y: 360 + Math.floor(index / 3) * 170,
  };
}

export default function TopologyView({ nodes = [], links = [] }) {
  const flowNodes = useMemo(() => {
    let siteIndex = 0;
    let hubIndex = 0;

    return nodes.map((node) => {
      let position;

      if (node.type === "core") {
        position = buildNodePosition("core", 0, 0);
      } else if (node.type === "hub") {
        position = buildNodePosition("hub", 0, hubIndex++);
      } else {
        position = buildNodePosition("site", siteIndex++, 0);
      }

      return {
        id: String(node.id),
        position,
        data: {
          label: (
            <div
              style={{
                minWidth: 150,
                textAlign: "center",
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{node.name}</div>
              <div style={{ fontSize: 12, opacity: 0.85 }}>{node.technology}</div>
              <div
                style={{
                  marginTop: 8,
                  display: "inline-block",
                  padding: "4px 8px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 700,
                  background: "#0f172a",
                  color: getStatusColor(node.status),
                  border: `1px solid ${getStatusColor(node.status)}`,
                }}
              >
                {node.status}
              </div>
              {typeof node.activeAlarms !== "undefined" ? (
                <div style={{ marginTop: 6, fontSize: 12, color: "#cbd5e1" }}>
                  Alarms: {node.activeAlarms}
                </div>
              ) : null}
            </div>
          ),
        },
        style: {
          background: "#111827",
          color: "white",
          border: `2px solid ${getStatusColor(node.status)}`,
          borderRadius: 16,
          padding: 10,
          width: node.type === "core" ? 180 : 170,
          boxShadow: `0 0 0 1px rgba(255,255,255,0.03), 0 8px 24px rgba(0,0,0,0.35)`,
        },
        draggable: false,
        selectable: true,
      };
    });
  }, [nodes]);

  const flowEdges = useMemo(() => {
    return links.map((link) => ({
      id: String(link.id),
      source: String(link.source),
      target: String(link.target),
      label: `${link.name || link.type} • ${link.status}`,
      animated: link.status === "Degraded",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: getStatusColor(link.status),
      },
      style: {
        stroke: getStatusColor(link.status),
        strokeWidth: 3,
      },
      labelStyle: {
        fill: "#e2e8f0",
        fontWeight: 600,
        fontSize: 12,
      },
      labelBgStyle: {
        fill: "#0f172a",
        fillOpacity: 0.9,
      },
      labelBgPadding: [6, 4],
      labelBgBorderRadius: 6,
    }));
  }, [links]);

  return (
    <div
      style={{
        width: "100%",
        height: "760px",
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid #1f2937",
        background: "#020617",
      }}
    >
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable
        panOnDrag
        zoomOnScroll
      >
        <Background color="#1e293b" gap={24} />
        <Controls />
      </ReactFlow>
    </div>

  );
}
