import { API_URL } from "../../config";

export async function apiFetch(endpoint, options = {}) {
  let storedToken = "";
  try {
    storedToken = localStorage.getItem("token") || "";
    if (!storedToken) {
      const usuarioRaw = localStorage.getItem("usuario") || "";
      if (usuarioRaw) {
        try {
          const parsed = JSON.parse(usuarioRaw);
          if (parsed && typeof parsed === "object" && parsed.token) {
            storedToken = parsed.token;
          } else {
            storedToken = "";
          }
        } catch (e) {
          storedToken = usuarioRaw;
        }
      }
    }
    if (!storedToken) storedToken = import.meta.env.VITE_DEV_TOKEN || "";
  } catch {
    storedToken = import.meta.env.VITE_DEV_TOKEN || "";
  }

  const headers = {
    ...(options.headers || {}),
    "Content-Type": "application/json",
    ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
  };

  const base = API_URL ? API_URL.replace(/\/+$/, "") : "";
  const url = `${base}/api/${endpoint.replace(/^\/+/, "")}`;

  const resp = await fetch(url, { ...options, headers });

  if (resp.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "/login";
    throw new Error("401: Token inválido o no autorizado");
  }

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`${resp.status}: ${text}`);
  }
  return resp.json();
}