import { getToken } from "./auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

export { SOCKET_URL };

async function request(path, options = {}) {
  const token = getToken();

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Request failed");
  }

  return data;
}

export async function login(email, password) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function getSites() {
  return request("/sites");
}

export async function getAlarms() {
  return request("/alarms");
}

export async function getIncidents() {
  return request("/incidents");
}

export async function getMapSites() {
  return request("/sites/map");
}

export async function getMapLinks() {
  return request("/links/map");
}

export async function getTopologyNodes() {
  return request("/topology/nodes");
}

export async function getTopologyLinks() {
  return request("/topology/links");
}
