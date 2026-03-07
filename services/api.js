const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1';

export function getToken() { return typeof window !== 'undefined' ? localStorage.getItem('noc_token') : null; }
export function setToken(token) { if (typeof window !== 'undefined') localStorage.setItem('noc_token', token); }
export function clearToken() { if (typeof window !== 'undefined') localStorage.removeItem('noc_token'); }

async function request(path, opts = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(opts.headers || {}) } });
  return res.json();
}

export const api = {
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  summary: () => request('/dashboard/summary'),
  sites: () => request('/sites'),
  links: () => request('/links/map'),
  alarms: () => request('/alarms'),
  incidents: () => request('/incidents'),
  events: () => request('/events/recent'),
  topologyNodes: () => request('/topology/nodes'),
  topologyLinks: () => request('/topology/links'),
};
