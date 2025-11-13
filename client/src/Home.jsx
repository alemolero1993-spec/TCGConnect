import React, { useEffect, useState } from "react";
import { apiFetch } from "./utils/api/fetch";

export default function Home() {
  const [collections, setCollections] = useState([]);
  const [cards, setCards] = useState([]);
  const [userDisplay, setUserDisplay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getUserIdCandidate = () => {
    try {
      const raw = localStorage.getItem("usuario") || "";
      if (!raw) return "";
      try {
        const parsed = JSON.parse(raw);
        return parsed.id || parsed.email || parsed.name || "";
      } catch {
        return raw || "";
      }
    } catch {
      return "";
    }
  };

  useEffect(() => {
    let mounted = true;

    const fetchCollectionsAndCards = async () => {
      setLoading(true);
      setError("");

      const userId = getUserIdCandidate();

      try {
        const rawUser = localStorage.getItem("usuario");
        if (rawUser) {
          try {
            const parsed = JSON.parse(rawUser);
            setUserDisplay(parsed.name || parsed.username || parsed.email || parsed.id);
          } catch {
            setUserDisplay(rawUser);
          }
        }
      } catch {
        setUserDisplay(null);
      }

      if (!userId) {
        setCollections([]);
        setCards([]);
        setLoading(false);
        return;
      }

      try {
        const data = await apiFetch(`collection?user_id=${encodeURIComponent(userId)}`);
        const cols = data.collections || [];

        if (!mounted) return;
        setCollections(cols);

        if (cols.length > 0) {
          const first = cols[0];
          const cid = first.id;

          try {
            const cardsResp = await apiFetch(`collection/${encodeURIComponent(cid)}/cards`);
            const parsedCards = cardsResp.cards || [];
            if (mounted) setCards(parsedCards);
          } catch (e) {
            try {
              let raw = first.raw;
              try { raw = JSON.parse(raw); } catch {}
              try { raw = JSON.parse(raw); } catch {}
              const fallbackCards = (raw && raw.cards) ? raw.cards : [];
              if (mounted) setCards(fallbackCards);
            } catch {
              if (mounted) setCards([]);
            }
          }
        } else {
          setCards([]);
        }
      } catch (err) {
        setError(err.message || String(err));
        setCollections([]);
        setCards([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchCollectionsAndCards();
    return () => { mounted = false; };
  }, []);

  return (
    <main style={{ padding: 20, fontFamily: "system-ui, sans-serif" }}>
      <h1>Mi colección — TCGConnect</h1>
      {userDisplay && <h3 style={{ marginTop: -8, color: "#444" }}>Bienvenido, {userDisplay}</h3>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <section style={{ marginTop: 16 }}>
        <h4>Mis colecciones</h4>
        {loading ? (
          <p>Cargando colecciones…</p>
        ) : collections.length ? (
          <ul>
            {collections.map((c) => (
              <li key={c.id}>
                <strong>{c.name || "(sin nombre)"}</strong>
                {c.language ? ` — ${c.language}` : ""} {c.rarity ? ` — ${c.rarity}` : ""}
                <div style={{ fontSize: 12, color: "#666" }}>{c.id}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Sin colecciones registradas.</p>
        )}
      </section>

      <section style={{ marginTop: 24 }}>
        <h4>Cartas (primera colección)</h4>
        {loading ? (
          <p>Cargando cartas…</p>
        ) : cards && cards.length ? (
          <div style={{ overflowX: "auto" }}>
            <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 700 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #ddd" }}>
                  <th style={{ padding: "8px 12px" }}>ID</th>
                  <th style={{ padding: "8px 12px" }}>Nombre</th>
                  <th style={{ padding: "8px 12px" }}>Set</th>
                  <th style={{ padding: "8px 12px" }}>Idioma</th>
                  <th style={{ padding: "8px 12px" }}>Rareza</th>
                  <th style={{ padding: "8px 12px" }}>Valor</th>
                  <th style={{ padding: "8px 12px" }}>Fecha</th>
                </tr>
              </thead>

              <tbody>
                {cards.map((c) => (
                  <tr key={c.id || Math.random()} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "8px 12px" }}>{c.id || "-"}</td>
                    <td style={{ padding: "8px 12px" }}>{c.name || "-"}</td>
                    <td style={{ padding: "8px 12px" }}>{c.set || "-"}</td>
                    <td style={{ padding: "8px 12px" }}>{c.lang || "-"}</td>
                    <td style={{ padding: "8px 12px" }}>{c.rarity || "-"}</td>
                    <td style={{ padding: "8px 12px" }}>{c.value ?? "-"}</td>
                    <td style={{ padding: "8px 12px" }}>{c.createdAt || c.created_at || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No hay cartas en la primera colección.</p>
        )}
      </section>
    </main>
  );
}

