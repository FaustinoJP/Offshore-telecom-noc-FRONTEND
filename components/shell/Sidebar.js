"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { removeToken } from "@/lib/auth";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/command-center", label: "Command Center" },
  { href: "/sites", label: "Sites" },
  { href: "/alarms", label: "Alarms" },
  { href: "/incidents", label: "Incidents" },
  { href: "/network-map", label: "Network Map" },
  { href: "/topology", label: "Topology" },
  
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    removeToken();
    router.push("/login");
  }

  return (
    <aside
      style={{
        width: 260,
        minHeight: "100vh",
        background: "#020617",
        color: "white",
        padding: 20,
        boxSizing: "border-box",
        borderRight: "1px solid #1f2937",
      }}
    >
      <h2 style={{ marginTop: 0 }}>Offshore NOC</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 24 }}>
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              color: pathname === item.href ? "#38bdf8" : "#cbd5e1",
              textDecoration: "none",
              padding: "10px 12px",
              borderRadius: 10,
              background: pathname === item.href ? "rgba(56,189,248,0.12)" : "transparent",
            }}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <button
        onClick={logout}
        style={{
          marginTop: 30,
          width: "100%",
          padding: 12,
          borderRadius: 10,
          border: "none",
          background: "#ef4444",
          color: "white",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </aside>
  );
}
