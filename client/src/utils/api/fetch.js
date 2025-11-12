// client/src/utils/api/fetch.js
import { API_URL } from '../../config';

export async function apiFetch(endpoint, options = {}) {
  const storedToken = localStorage.getItem('token') || localStorage.getItem('usuario') || import.meta.env.VITE_DEV_TOKEN || '';
  const headers = {
    ...(options.headers || {}),
    'Content-Type': 'application/json',
    ...(storedToken ? { 'Authorization': Bearer  } : {})
  };
  const base = API_URL ? API_URL.replace(/\/+$/,'') : '';
  const url = \\/api/\\;
  const resp = await fetch(url, { ...options, headers });
  if (!resp.ok) throw new Error(\\: \\);
  return resp.json();
}
