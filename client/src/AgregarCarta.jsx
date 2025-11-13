import React, { useState, useEffect } from "react";
import { apiFetch } from "./utils/api/fetch";

export default function AgregarCarta() {

  const [collectionId, setCollectionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    name: "",
    set: "",
    lang: "",
    rarity: "",
    value: "",
  });

  // Obtener ID de la primera colección
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const userId = localStorage.getItem("usuario") ? JSON.parse(localStorage.getItem("usuario")).id : null;
      if (!userId) {
        setMsg("No se detectó usuario.");
        setLoading(false);
        return;
      }

      try {
        const resp = await apiFetch(`collection?userId=${encodeURIComponent(userId)}`);
        const col = resp.collections && resp.collections.length > 0 ? resp.collections[0] : null;
        if (!col) {
          setMsg("No tienes colecciones aún.");
        } else {
          setCollectionId(col.id);
        }
      } catch (err) {
        setMsg("Error cargando colección: " + err.message);
      }

      setLoading(false);
    };

    load();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitCard = async () => {
    if (!collectionId) {
      alert("No hay colección para agregar la carta.");
      return;
    }

    try {
    const payload = {
      collection_id: collectionId,
      ...form,
      id: form.id || `card-${Date.now()}`,
      value: form.value ? parseFloat(form.value) : null,
    };

      const resp = await apiFetch(`collection/${encodeURIComponent(collectionId)}/cards`, {
        method: "POST",
        body: JSON.stringify(payload)
      });

      console.log("Respuesta crear carta:", resp);
      setMsg("Carta creada correctamente.");

      setForm({
        name: "",
        set: "",
        lang: "",
        rarity: "",
        value: "",
      });

    } catch (err) {
      alert("Error creando carta: " + err.message);
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Cargando…</p>;

  return (
    <main style={{ padding: 20, fontFamily: "system-ui, sans-serif" }}>
      <h1>Agregar Carta — TCGConnect</h1>

      {msg && <p style={{ color: "green" }}>{msg}</p>}

      {!collectionId ? (
        <p>No hay colección disponible.</p>
      ) : (
        <div style={{ marginTop: 20 }}>
          <h3>Colección destino: {collectionId}</h3>

          <div style={{ marginTop: 20 }}>
            <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} style={{ padding: 8, margin: 4 }} />
            <input name="set" placeholder="Set" value={form.set} onChange={handleChange} style={{ padding: 8, margin: 4 }} />
            <input name="lang" placeholder="Idioma" value={form.lang} onChange={handleChange} style={{ padding: 8, margin: 4 }} />
            <input name="rarity" placeholder="Rareza" value={form.rarity} onChange={handleChange} style={{ padding: 8, margin: 4 }} />
            <input name="value" placeholder="Valor (€)" value={form.value} onChange={handleChange} style={{ padding: 8, margin: 4 }} />

            <button onClick={submitCard} style={{ padding: "8px 12px", margin: 4, cursor: "pointer" }}>
              Agregar carta
            </button>
          </div>
        </div>
      )}
    </main>
  );
}


