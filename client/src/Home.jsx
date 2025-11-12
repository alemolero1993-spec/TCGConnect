// client/src/Home.jsx (con usuario y colección - mostrar name)
import React, { useEffect, useState } from 'react';
import { apiFetch } from './utils/api/fetch';

export default function Home() {
  const [cards, setCards] = useState([]);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Cargar usuario desde localStorage
    try {
      const raw = localStorage.getItem('usuario');
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          // priorizar name, luego username, luego email, luego id
          setUser(parsed.name || parsed.username || parsed.email || parsed.id || 'Usuario');
        } catch {
          setUser(raw);
        }
      }
    } catch {
      setUser(null);
    }

    // Cargar colección desde API (si token está presente, apiFetch añadirá Authorization)
    apiFetch('collection?userId=' + (localStorage.usuario ? (() => {
      try { const p = JSON.parse(localStorage.usuario); return p.id || p.email || p.name || ''; } catch { return localStorage.usuario || ''; }
    })() : ''))
      .then(data => {
        const list = data.collections || data.cards || [];
        setCards(list);
      })
      .catch(err => setError(err.message));
  }, []);

  return (
    <main style={{ padding: 20, fontFamily: 'system-ui, sans-serif' }}>
      <h1>Mi colección — TCGConnect</h1>
      {user && <h3 style={{ marginTop: -8, color: '#444' }}>Bienvenido, {user}</h3>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {cards.length ? (
        <ul>
          {cards.map((c, i) => (
            <li key={i}>{c.name || c.set || 'Carta sin nombre'}</li>
          ))}
        </ul>
      ) : (
        <p>{error ? 'No se pudieron cargar las cartas.' : 'Sin cartas registradas.'}</p>
      )}
    </main>
  );
}
