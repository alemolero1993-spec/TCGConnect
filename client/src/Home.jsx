import React, { useEffect, useState } from "react";
import { apiFetch } from "./utils/api/fetch";

export default function Home() {

  // === NUEVA COLECCIÓN ===
  const [newCollectionName, setNewCollectionName] = useState("");

  const createCollection = async () => {
    try {
      const userId = getUserIdCandidate();
      if (!userId) {
        alert("No se detectó userId.");
        return;
      }

      if (!newCollectionName.trim()) {
        alert("El nombre no puede estar vacío.");
        return;
      }

      const resp = await apiFetch("collection", {
        method: "POST",
        body: JSON.stringify({
          user_id: userId,
          name: newCollectionName.trim()
        })
      });

      console.log("Creación de colección:", resp);

      setNewCollectionName("");
      window.location.reload();
    } catch (err) {
      alert("Error creando colección: " + err.message);
    }
  };
  const [collections, setCollections] = useState([]);
  const [cards, setCards] = useState([]);
  const [userDisplay, setUserDisplay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const deleteCollection = async (id) => {
  try {
    if (!window.confirm("¿Seguro que quieres eliminar esta colección? Esta acción no se puede deshacer.")) {
      return;
    }

    const resp = await apiFetch(`collection/${id}`, {
      method: "DELETE"
    });

    console.log("Colección eliminada:", resp);

    // Recargar la página
    window.location.reload();
  } catch (err) {
    alert("Error eliminando colección: " + err.message);
  }
};

  const getUserIdCandidate = () => {
  function normalizeUserId(id) {
    if (!id) return id;
    // Regla explícita y segura para el caso conocido
    if (id === "deploytest4") return "deploy-test-4";
    // Si ya contiene un guion, asumir correcto
    if (id.includes("-")) return id;
    // Fallback: devolver el id tal cual
    return id;
  }

  try {
    const stored = localStorage.getItem("usuario");
    if (stored) {
      try {
        const user = JSON.parse(stored);
        if (user && user.id) return normalizeUserId(user.id);
      } catch {
        // si stored es un string simple (p.e. "deploytest4")
        if (typeof stored === "string" && stored.length < 50) return normalizeUserId(stored);
      }
    }
  } catch (e) { /* ignore parse errors */ }

  try {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = token.split(".")[1];
      const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      const json = JSON.parse(decodeURIComponent(escape(window.atob(b64))));
      if (json && json.id) return normalizeUserId(json.id);
    }
  } catch (e) { /* ignore token errors */ }

  return null;
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
        const data = await apiFetch(`collection?userId=${encodeURIComponent(userId)}`);
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

        <div style={{ marginBottom: 12, marginTop: 12 }}>
          <input
            type="text"
            placeholder="Nombre nueva colección"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            style={{ padding: "8px", width: "220px", marginRight: "8px" }}
          />
          <button
            onClick={createCollection}
            style={{ padding: "8px 12px", cursor: "pointer" }}
          >
            Crear colección
          </button>
        </div>
                {loading ? (
          <p>Cargando colecciones…</p>
        ) : collections.length ? (
          <ul>
            {collections.map((c) => (
              <li key={c.id}>
                <strong>{c.name || "(sin nombre)"}</strong>
                {c.language ? ` — ${c.language}` : ""} {c.rarity ? ` — ${c.rarity}` : ""}
                <div style={{ fontSize: 12, color: "#666" }}>{c.id}</div>
                <div\ style=\{\{\ fontSize:\ 12,\ color:\ "\#666"\ }}>\{c\.id}</div>\n\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ <button\ onClick=\{\(\)\ =>\ \{\ const\ newName\ =\ window\.prompt\("Nuevo\ nombre\ de\ la\ colección:",\ c\.name\);\ if\(!newName\)\ return;\ renameCollection\(c\.id,\ newName\);\ }}\ style=\{\{\ padding:\ "4px\ 8px",\ marginTop:\ "6px",\ marginRight:\ "6px",\ background:\ "\#0078ff",\ color:\ "white",\ border:\ "none",\ borderRadius:\ "4px",\ cursor:\ "pointer",\ fontSize:\ "12px"\ }}>Renombrar</button>\n\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ <button\n\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ onClick=\{\(\)\ =>\ deleteCollection\(c\.id\)}\n\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ style=\{\{\n\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ padding:\ '4px\ 8px',\n\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ marginTop:\ '6px',\n\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ background:\ '\#cc0000',\n\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ color:\ 'white',\n\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ border:\ 'none',\n\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ borderRadius:\ '4px',\n\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ cursor:\ 'pointer',\n\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ fontSize:\ '12px'\n\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ }}\n\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ >\n\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ Eliminar\n\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ </button>
                  onClick={() => deleteCollection(c.id)} 
                  style={{
                    padding: '4px 8px',
                    marginTop: '6px',
                    background: '#cc0000',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Eliminar
                </button>
                <div style={{ marginTop: 4 }}>
                  <a 
                    href={"/coleccion/" + c.id} 
                    style={{
                      padding: "4px 8px",
                      background: "#0078ff",
                      color: "white",
                      borderRadius: "4px",
                      textDecoration: "none",
                      fontSize: "12px"
                    }}
                  >
                    Ver detalles
                  </a>
                </div>
                <button 
                  onClick={() => deleteCollection(c.id)} 
                  style={{
                    padding: '4px 8px',
                    marginTop: '6px',
                    background: '#cc0000',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Sin colecciones registradas.</p>
        )}
      </section>

      
    </main>
  );
}













