const express = require("express");
const router = express.Router();
const Database = require("better-sqlite3");
const db = new Database("tcgconnect.db");

// Helpers
const getCollectionsByUser = (userId) => db.prepare("SELECT * FROM collections WHERE user_id = ?").all(userId);
const getCollectionById = (id) => db.prepare("SELECT * FROM collections WHERE id = ?").get(id);
const insertCollection = (c) => db.prepare("INSERT OR REPLACE INTO collections (id,user_id,name,language,rarity,condition,value,created_at,raw) VALUES (?,?,?,?,?,?,?,?,?)").run(c.id,c.user_id,c.name,c.language,c.rarity,c.condition,c.value,c.created_at,c.raw);
const deleteCollectionById = (id) => db.prepare("DELETE FROM collections WHERE id = ?").run(id);

// GET /api/collection?userId=...
router.get("/", (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: "Falta userId en query" });
    const rows = getCollectionsByUser(userId);
    return res.json({ ok: true, collections: rows });
  } catch (err) {
    console.error("Error GET /api/collection", err);
    return res.status(500).json({ error: "Error interno" });
  }
});

// GET /api/collection/:id
router.get("/:id", (req, res) => {
  try {
    const id = req.params.id;
    const row = getCollectionById(id);
    if (!row) return res.status(404).json({ error: "No encontrado" });
    return res.json({ ok: true, collection: row });
  } catch (err) {
    console.error("Error GET /api/collection/:id", err);
    return res.status(500).json({ error: "Error interno" });
  }
});

// NEW: GET /api/collection/:id/cards
router.get("/:id/cards", (req, res) => {
  try {
    const id = req.params.id;
    const row = getCollectionById(id);
    if (!row) return res.status(404).json({ error: "Colección no encontrada" });

    // raw puede estar doble-encodeado: intentamos parsear varias veces
    let raw = row.raw;
    try { raw = JSON.parse(raw); } catch {}
    try { raw = JSON.parse(raw); } catch {}

    const cards = raw.cards || [];
    return res.json({ ok: true, cards });
  } catch (err) {
    console.error("Error GET /api/collection/:id/cards", err);
    return res.status(500).json({ error: "Error interno" });
  }
});

// POST /api/collection
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
    console.error("Error POST /api/collection", err);
    return res.status(500).json({ error: "Error interno" });
  }
});

// DELETE /api/collection/:id
router.delete("/:id", (req, res) => {
  try {
    const id = req.params.id;
    deleteCollectionById(id);
    return res.json({ ok: true });
  } catch (err) {
    console.error("Error DELETE /api/collection/:id", err);
    return res.status(500).json({ error: "Error interno" });
  }
});

module.exports = router;
