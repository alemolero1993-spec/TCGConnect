// client/src/pages/Home.jsx  (modo MOCK activo)
import React, { useEffect, useState } from 'react';

export default function HomePageMock(){
  const [cards, setCards] = useState([]);
  useEffect(() => {
    const MOCK = [
      { id: 'm1', name: 'Pikachu', set: 'S1', lang: 'EN', rarity: 'Common', value: 1.5, createdAt: new Date().toISOString() },
      { id: 'm2', name: 'Charizard', set: 'S1', lang: 'EN', rarity: 'Ultra Rare', value: 120.0, createdAt: new Date().toISOString() },
      { id: 'm3', name: 'Bulbasaur', set: 'S1', lang: 'EN', rarity: 'Rare', value: 3.5, createdAt: new Date().toISOString() }
    ];
    setTimeout(() => setCards(MOCK), 150);
  }, []);

  return (
    <main style={{ padding: 20, fontFamily: 'system-ui, sans-serif', maxWidth: 1000, margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h1 style={{ margin: 0 }}>Mi colección — TCGConnect (modo MOCK)</h1>
        <div><span>🔒 Desarrollo local</span></div>
      </header>
      <section style={{ marginTop: 20 }}>
        {cards.length === 0 ? <p>Cargando cartas de ejemplo...</p> : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {cards.map(c => (
              <li key={c.id} style={{ marginBottom: 12, border: '1px solid #ddd', borderRadius: 8, padding: 10 }}>
                <div><strong>{c.name}</strong> — {c.set} — {c.lang} — {c.rarity}</div>
                <div style={{ color: '#666' }}>Valor: €{c.value} · {new Date(c.createdAt).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
      <footer style={{ marginTop: 30, fontSize: 12, color: '#888' }}>
        © {new Date().getFullYear()} TCGConnect. Modo MOCK activo.
      </footer>
    </main>
  );
}
