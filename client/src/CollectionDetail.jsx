import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "./utils/api/fetch";

export default function CollectionDetail() {
  const { id } = useParams();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCards = async () => {
      try {
        const resp = await const resp = await apiFetch(`collection/${encodeURIComponent(id)}/cards`);
        setCards(resp.cards || []);
      } catch (err) {
        setError(err.message || "Error cargando cartas.");
      } finally {
        setLoading(false);
      }
    };

    loadCards();
  }, [id]);

  if (loading) return <p style={{ padding: 20 }}>Cargando cartas…</p>;
  if (error) return <p style={{ padding: 20, color: "red" }}>{error}</p>;

  return (
    <main style={{ padding: 20, fontFamily: "system-ui, sans-serif" }}>
      <h1>Cartas de la colección {id}</h1>

      {cards.length === 0 ? (
        <p>No hay cartas en esta colección.</p>
      ) : (
        <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 700 }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #ddd" }}>
              <th style={{ padding: "8px 12px" }}>ID</th>
              <th style={{ padding: "8px 12px" }}>Nombre</th>
              <th style={{ padding: "8px 12px" }}>Set</th>
              <th style={{ padding: "8px 12px" }}>Idioma</th>
              <th style={{ padding: "8px 12px" }}>Rareza</th>
              <th style={{ padding: "8px 12px" }}>Valor</th>
            </tr>
          </thead>
          <tbody>
            {cards.map((c) => (
              <tr key={c.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "8px 12px" }}>{c.id}</td>
                <td style={{ padding: "8px 12px" }}>{c.name}</td>
                <td style={{ padding: "8px 12px" }}>{c.set}</td>
                <td style={{ padding: "8px 12px" }}>{c.lang}</td>
                <td style={{ padding: "8px 12px" }}>{c.rarity}</td>
                <td style={{ padding: "8px 12px" }}>{c.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

