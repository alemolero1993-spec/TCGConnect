import React, { useEffect, useState } from "react";

const STORAGE_KEY = "tcg_cookies_consent";

export default function CookieBanner() {
  const [consent, setConsent] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setConsent(saved);
  }, []);

  function acceptAll() {
    localStorage.setItem(STORAGE_KEY, "all");
    setConsent("all");
  }

  function rejectNonEssential() {
    localStorage.setItem(STORAGE_KEY, "essential");
    setConsent("essential");
  }

  if (consent) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-white border rounded-lg p-4 shadow-lg max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <h4 className="font-semibold">Preferencias de cookies</h4>
          <p className="text-sm text-gray-600">
            Usamos cookies para mejorar tu experiencia y para analítica. Puedes aceptar todas o solo las esenciales.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={rejectNonEssential} className="px-3 py-2 rounded border">Rechazar no esenciales</button>
          <button onClick={acceptAll} className="px-3 py-2 rounded bg-indigo-600 text-white">Aceptar todas</button>
        </div>
      </div>
    </div>
  );
}
