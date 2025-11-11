import React from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-4">Vista simplificada. Añade cartas desde la UI para probar persistencia.</p>
      <Link to="/card/1" className="underline mt-4 inline-block">Ver carta de prueba</Link>
    </main>
  );
}
