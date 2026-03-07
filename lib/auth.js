export function saveToken(token) {
  if (typeof window !== "undefined") {
    localStorage.setItem("noc_token", token);
  }
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("noc_token");
}

export function removeToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("noc_token");
  }
}

export function isAuthenticated() {
  return !!getToken();
}
