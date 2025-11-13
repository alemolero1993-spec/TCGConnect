const express = require("express");
const router = express.Router();
const Database = require("better-sqlite3");
const db = new Database("tcgconnect.db");

// Helpers
const getCollectionsByUser = (userId) => db.prepare("SELECT * FROM collections WHERE user_id = ?").all(userId);
const getCollectionById = (id) => db.prepare("SELECT * FROM collections WHERE id = ?").get(id);
const insertCollection = (c) => db.prepare("INSERT OR REPLACE INTO collections (id,user_id,name,language,rarity,condition,value,created_at,raw) VALUES (?,?,?,?,?,?,?,?,?)").run(c.id,c.user_id,c.name,c.language,c.rarity,c.condition,c.value,c.created_at,c.raw);
const deleteCollectionById = (id) => db.prepare("DELETE FROM collections WHERE id = ?").run(id);

/**
 * GET /api/collection?userId=...
 */
router.get("/", (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: "Falta userId en query" });
    const rows = getCollectionsByUser(userId);
    return res.json({ ok: true, collections: rows });
  } catch (err) {
    console.error("Error GET /api/collection", err && err.stack ? err.stack : err);
    return res.status(500).json({ error: "Error interno" });
  }
});

/**
 * GET /api/collection/:id
 */
router.get("/:id", (req, res) => {
  try {
    const id = req.params.id;
    const row = getCollectionById(id);
    if (!row) return res.status(404).json({ error: "No encontrado" });
    return res.json({ ok: true, collection: row });
  } catch (err) {
    console.error("Error GET /api/collection/:id", err && err.stack ? err.stack : err);
    return res.status(500).json({ error: "Error interno" });
  }
});

/**
 * GET /api/collection/:id/cards
 */
router.get("/:id/cards", (req, res) => {
  try {
    const id = req.params.id;
    const row = getCollectionById(id);
    if (!row) return res.status(404).json({ error: "Colección no encontrada" });

    let raw = row.raw;
    try { raw = JSON.parse(raw); } catch {}
    try { raw = JSON.parse(raw); } catch {}

    const cards = Array.isArray(raw && raw.cards) ? raw.cards : [];
    return res.json({ ok: true, cards });
  } catch (err) {
    console.error("Error GET /api/collection/:id/cards", err && err.stack ? err.stack : err);
    return res.status(500).json({ error: "Error interno" });
  }
});

/**
 * POST /api/collection/:id/cards
 * Body: { id, name, set, lang, rarity, value }
 * Añade una carta a la colección (crea el array si no existe) y actualiza la fila.
 */
router.post("/:id/cards", (req, res) => {
  try {
    const id = req.params.id;
    const card = req.body;
    if (!card || !card.id || !card.name) return res.status(400).json({ error: "Faltan campos de la carta (id, name)" });

    const row = getCollectionById(id);
    if (!row) return res.status(404).json({ error: "Colección no encontrada" });

    // parsear raw (posible doble-encoded)
    let raw = row.raw;
    try { raw = JSON.parse(raw); } catch {}
    try { raw = JSON.parse(raw); } catch {}

    if (!raw || typeof raw !== "object") raw = { user_id: row.user_id, cards: [] };
    if (!Array.isArray(raw.cards)) raw.cards = [];

    // asegurar estructura de la carta
    const newCard = {
      id: card.id,
      name: card.name,
      set: card.set || card.setName || card.set_id || "",
      lang: card.lang || card.language || "EN",
      rarity: card.rarity || "",
      value: card.value !== undefined ? Number(card.value) : null,
      createdAt: card.createdAt || new Date().toISOString()
    };

    raw.cards.push(newCard);

    // preparar record para insertar/replace
    const record = {
      id: row.id,
      user_id: row.user_id,
      name: row.name || "",
      language: row.language || "",
      rarity: row.rarity || "",
      condition: row.condition || "",
      value: row.value !== undefined && row.value !== null ? parseFloat(row.value) : null,
      created_at: row.created_at || new Date().toISOString(),
      raw: JSON.stringify(raw)
    };

    insertCollection(record);

    return res.status(201).json({ ok: true, card: newCard });
  } catch (err) {
    console.error("Error POST /api/collection/:id/cards", err && err.stack ? err.stack : err);
    return res.status(500).json({ error: "Error interno" });
  }
});

/**
 * POST /api/collection
 */
router.post("/", (req, res) => {
  try {
    const body = req.body;
    if (!body || !body.user_id) return res.status(400).json({ error: "Faltan campos: user_id" });
    const id = body.id || (Date.now().toString());
    const record = {
      id,
      user_id: body.user_id,
      name: body.name || "",
      language: body.language || "",
      rarity: body.rarity || "",
      condition: body.condition || "",
      value: body.value !== undefined && body.value !== null ? parseFloat(body.value) : null,
      created_at: body.created_at || new Date().toISOString(),
      raw: body.raw ? JSON.stringify(body.raw) : JSON.stringify(body)
    };
    insertCollection(record);
    return res.status(201).json({ ok: true, id });
  } catch (err) {
    console.error("Error POST /api/collection", err && err.stack ? err.stack : err);
    return res.status(500).json({ error: "Error interno" });
  }
});

/**
 * DELETE /api/collection/:id
 */
router.delete("/:id", (req, res) => {
  try {
    const id = req.params.id;
    deleteCollectionById(id);
    return res.json({ ok: true });
  } catch (err) {
    console.error("Error DELETE /api/collection/:id", err && err.stack ? err.stack : err);
    return res.status(500).json({ error: "Error interno" });
  }
});

module.exports = router;
