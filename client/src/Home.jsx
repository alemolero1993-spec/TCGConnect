import React, { useEffect, useState } from "react";
import { apiFetch } from "./utils/api/fetch";

export default function Home() {
  const [collections, setCollections] = useState([]);
  const [cards, setCards] = useState([]);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [loadingCollections, setLoadingCollections] = useState(true);
  const [loadingCards, setLoadingCards] = useState(false);

  useEffect(() => {
    // cargar usuario de localStorage (si existe)
    try {
      const raw = localStorage.getItem("usuario");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          setUser(parsed.name || parsed.username || parsed.email || parsed.id || "Usuario");
        } catch {
          setUser(raw);
        }
      }
    } catch {}

    // helper para obtener userId desde localStorage.usuario (si está)
    const getUserIdFromLocal = () => {
      try {
        const raw = localStorage.getItem("usuario") || "";
        if (!raw) return "";
        const parsed = JSON.parse(raw);
        return parsed.id || parsed.email || parsed.name || "";
      } catch {
        return localStorage.getItem("usuario") || "";
      }
    };

    const userId = getUserIdFromLocal();
    if (!userId) {
      setError("Usuario no identificado en localStorage.");
      setLoadingCollections(false);
      return;
    }

    // 1) obtener colecciones del usuario
    setLoadingCollections(true);
    apiFetch(`collection?userId=${userId}`)
      .then((data) => {
        const list = data.collections || [];
        setCollections(list);
        setLoadingCollections(false);

        // 2) si hay al menos una colección, pedir sus cartas usando el nuevo endpoint
        if (list.length > 0) {
          const firstId = list[0].id;
          setLoadingCards(true);
          apiFetch(`collection/${firstId}/cards`)
            .then((cdata) => {
              setCards(cdata.cards || []);
              setLoadingCards(false);
            })
            .catch((e) => {
              setError("Error al cargar cartas: " + (e.message || e));
              setLoadingCards(false);
            });
        }
      })
      .catch((e) => {
        setError("Error al cargar colecciones: " + (e.message || e));
        setLoadingCollections(false);
      });
  }, []);

  return (
    <main style={{ padding: 20, fontFamily: "system-ui, sans-serif" }}>
      <h1>Mi colección — TCGConnect</h1>
      {user && <h3 style={{ marginTop: -8, color: "#444" }}>Bienvenido, {user}</h3>}
      {error && <p style={{ color: "crimson" }}>Error: {error}</p>}

      <section style={{ marginTop: 12 }}>
        <h4>Mis colecciones</h4>
        {loadingCollections ? (
          <p>Cargando colecciones...</p>
        ) : collections.length ? (
          <ul>
            {collections.map((col) => (
              <li key={col.id}>
                <strong>{col.name || "(sin nombre)"}</strong> — {col.language || "?"} — {col.rarity || ""}
              </li>
            ))}
          </ul>
        ) : (
          <p>Sin colecciones registradas.</p>
        )}
      </section>

      <section style={{ marginTop: 18 }}>
        <h4>Cartas (primera colección)</h4>
        {loadingCards ? (
          <p>Cargando cartas...</p>
        ) : cards.length ? (
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "6px 8px" }}>ID</th>
                <th style={{ textAlign: "left", padding: "6px 8px" }}>Nombre</th>
                <th style={{ textAlign: "left", padding: "6px 8px" }}>Set</th>
                <th style={{ textAlign: "left", padding: "6px 8px" }}>Idioma</th>
                <th style={{ textAlign: "right", padding: "6px 8px" }}>Valor</th>
              </tr>
            </thead>
            <tbody>
              {cards.map((card) => (
                <tr key={card.id}>
                  <td style={{ padding: "6px 8px" }}>{card.id}</td>
                  <td style={{ padding: "6px 8px" }}>{card.name}</td>
                  <td style={{ padding: "6px 8px" }}>{card.set}</td>
                  <td style={{ padding: "6px 8px" }}>{card.lang}</td>
                  <td style={{ padding: "6px 8px", textAlign: "right" }}>{card.value ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay cartas en la primera colección.</p>
        )}
      </section>
    </main>
  );
}
