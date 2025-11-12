import React, { useState } from "react";
import { API_URL } from '../config';
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL.replace(/\/+$/,'')}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const txt = await res.text();
      if (!res.ok) {
        throw new Error(`${res.status}: ${txt}`);
      }

      const data = JSON.parse(txt);

      if (data.token) {
        try { localStorage.setItem("token", data.token); } catch (err) { console.warn("Could not store token", err); }
      }

      if (data.user) {
        try { localStorage.setItem("usuario", JSON.stringify(data.user)); } catch (err) { console.warn("Could not store usuario", err); }
      }

      navigate("/coleccion");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Error en login");
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: "24px auto", padding: 12 }}>
      <h2>Login</h2>
      {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: "block", marginBottom: 4 }}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: "100%", padding: 8 }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 4 }}>Contraseña</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: "100%", padding: 8 }} />
        </div>
        <button type="submit" disabled={loading} style={{ padding: "10px 16px" }}>
          {loading ? "Iniciando..." : "Login"}
        </button>
      </form>
      <p style={{ marginTop: 12, color: "#666" }}>
        Nota: el JWT se guardará en <code>localStorage.token</code> y se mantiene compatibilidad con <code>localStorage.usuario</code>.
      </p>
    </div>
  );
}




