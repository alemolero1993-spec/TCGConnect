// client/src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { API_URL, DEV_TOKEN } from "../config";

/**
 * HomePage - Lista, crear, editar y borrar cartas
 * Usa el endpoint local: /api/collection
 */

const apiBase = () => API_URL.replace(/\/$/, "") + "/collection";

export default function HomePage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // formulario para crear nuevas cartas
  const [form, setForm] = useState({
    name: "",
    set: "",
    lang: "EN",
    rarity: "Common",
    value: "",
  });
  const [saving, setSaving] = useState(false);

  // edición inline
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const getTokenIfAny = () => (localStorage.getItem("token") || DEV_TOKEN || "").trim();

  const loadCards = async () => {
    setLoading(true);
    setError(null);
    try {
      const maybeToken = getTokenIfAny();
      const headers = { "Content-Type": "application/json" };
      if (maybeToken) headers.Authorization = `Bearer ${maybeToken}`;

      const res = await fetch(apiBase(), { method: "GET", headers });
      if (res.status === 401) throw new Error("401: Token inválido o no autorizado");
      if (res.status === 404) throw new Error("404: Endpoint no encontrado");
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`HTTP ${res.status} - ${txt}`);
      }

      const data = await res.json();
      // router devuelve { cards: [...] }
      const list = Array.isArray(data) ? data : data.cards || [];
      setCards(list);
    } catch (e) {
      console.error("Error fetching collection:", e);
      setError(String(e.message || e));
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.set) {
      alert("Completa al menos nombre y set");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const maybeToken = getTokenIfAny();
      const headers = { "Content-Type": "application/json" };
      if (maybeToken) headers.Authorization = `Bearer ${maybeToken}`;

      const res = await fetch(apiBase(), {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: form.name,
          set: form.set,
          lang: form.lang,
          rarity: form.rarity,
          value: Number(form.value) || 0,
          createdAt: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`HTTP ${res.status} - ${txt}`);
      }
      const { card, card: createdCard } = await res.json();
      // algunos endpoints devuelven { card } u objeto directo; manejar ambos
      const newCard = card || createdCard || (await res.json());
      setCards((c) => [card || createdCard || newCard, ...c]);
      setForm({ name: "", set: "", lang: "EN", rarity: "Common", value: "" });
    } catch (err) {
      console.error("Error creando carta:", err);
      setError(String(err.message || err));
      alert("Error al crear carta: " + (err.message || err));
    } finally {
      setSaving(false);
    }
  };

  // --- Editar ---
  const startEdit = (card) => {
    setEditingId(card.id);
    setEditForm({
      name: card.name,
      set: card.set,
      lang: card.lang || "EN",
      rarity: card.rarity || "Common",
      value: card.value || 0,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((f) => ({ ...f, [name]: value }));
  };

  const submitEdit = async (id) => {
    if (!editForm.name || !editForm.set) {
      alert("Completa al menos nombre y set");
      return;
    }
    try {
      const maybeToken = getTokenIfAny();
      const headers = { "Content-Type": "application/json" };
      if (maybeToken) headers.Authorization = `Bearer ${maybeToken}`;

      const res = await fetch(`${apiBase()}/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(editForm),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`HTTP ${res.status} - ${txt}`);
      }
      const { card: updated } = await res.json();
      setCards((prev) => prev.map((c) => (c.id === id ? (updated || { ...c, ...editForm }) : c)));
      cancelEdit();
    } catch (err) {
      console.error("Error editando carta:", err);
      setError(String(err.message || err));
      alert("Error al editar: " + (err.message || err));
    }
  };

  // --- Borrar ---
  const handleDelete = async (id) => {
    if (!confirm("¿Borrar esta carta? Esta acción no tiene deshacer.")) return;
    try {
      const maybeToken = getTokenIfAny();
      const headers = { "Content-Type": "application/json" };
      if (maybeToken) headers.Authorization = `Bearer ${maybeToken}`;

      const res = await fetch(`${apiBase()}/${id}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`HTTP ${res.status} - ${txt}`);
      }
      setCards((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error borrando carta:", err);
      setError(String(err.message || err));
      alert("Error al borrar: " + (err.message || err));
    }
  };

  return (
    <main style={{ padding: 20, fontFamily: "system-ui, sans-serif", maxWidth: 900, margin: "0 auto" }}>
      <h1>Mi colección — TCGConnect</h1>

      {loading && <p>Cargando cartas…</p>}

      {error && (
        <div style={{ background: "#fee", padding: 12, borderRadius: 8, marginBottom: 12 }}>
          <strong>Error:</strong> {String(error)}
        </div>
      )}

      {/* Formulario de nueva carta */}
      <section style={{ marginTop: 12, marginBottom: 20, border: "1px solid #eee", padding: 12, borderRadius: 8 }}>
        <h2 style={{ marginTop: 0 }}>Nueva carta</h2>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} required style={{ flex: 1 }} />
            <input name="set" placeholder="Set (ej. S1)" value={form.set} onChange={handleChange} required style={{ width: 120 }} />
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <select name="lang" value={form.lang} onChange={handleChange} style={{ width: 80 }}>
              <option value="EN">EN</option>
              <option value="ES">ES</option>
              <option value="FR">FR</option>
            </select>

            <select name="rarity" value={form.rarity} onChange={handleChange} style={{ width: 140 }}>
              <option>Common</option>
              <option>Rare</option>
              <option>Holo</option>
              <option>Reverse Holo</option>
              <option>Ultra Rare</option>
            </select>

            <input
              name="value"
              type="number"
              step="0.01"
              placeholder="Valor €"
              value={form.value}
              onChange={handleChange}
              style={{ width: 120 }}
            />

            <button type="submit" disabled={saving} style={{ marginLeft: "auto" }}>
              {saving ? "Guardando..." : "Crear carta"}
            </button>
          </div>
        </form>
      </section>

      {/* Lista de cartas */}
      <section>
        {!loading && cards.length === 0 && <p>No hay cartas en la colección.</p>}

        {!loading && cards.length > 0 && (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {cards.map((card) => (
              <li key={card.id || card._id} style={{ marginBottom: 12, padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
                {editingId === card.id ? (
                  <>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input name="name" value={editForm.name} onChange={handleEditChange} style={{ flex: 1 }} />
                      <input name="set" value={editForm.set} onChange={handleEditChange} style={{ width: 120 }} />
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center" }}>
                      <select name="lang" value={editForm.lang} onChange={handleEditChange} style={{ width: 80 }}>
                        <option value="EN">EN</option>
                        <option value="ES">ES</option>
                        <option value="FR">FR</option>
                      </select>

                      <select name="rarity" value={editForm.rarity} onChange={handleEditChange} style={{ width: 140 }}>
                        <option>Common</option>
                        <option>Rare</option>
                        <option>Holo</option>
                        <option>Reverse Holo</option>
                        <option>Ultra Rare</option>
                      </select>

                      <input name="value" type="number" step="0.01" value={editForm.value} onChange={handleEditChange} style={{ width: 120 }} />

                      <button onClick={() => submitEdit(card.id)}>Guardar</button>
                      <button onClick={cancelEdit}>Cancelar</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>{card.name}</div>
                        <div style={{ fontSize: 13, color: "#444" }}>
                          {card.set} — {card.lang} — {card.rarity}
                        </div>
                        <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>
                          Valor: €{Number(card.value || 0)}{" "}
                          <span style={{ marginLeft: 12 }}>{card.createdAt ? new Date(card.createdAt).toLocaleString() : ""}</span>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => startEdit(card)}>Editar</button>
                        <button onClick={() => handleDelete(card.id)}>Borrar</button>
                      </div>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer style={{ marginTop: 40, fontSize: 12, color: "#888" }}>
        © {new Date().getFullYear()} TCGConnect. Todos los derechos reservados.
      </footer>
    </main>
  );
}
