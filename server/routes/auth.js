const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Database = require('better-sqlite3');
const db = new Database('tcgconnect.db');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';
const JWT_EXPIRES = '7d';

const getUserByEmail = (email) => db.prepare('SELECT * FROM users WHERE email = ?').get(email);
const insertUser = (u) => db.prepare('INSERT OR IGNORE INTO users (id,email,name,password) VALUES (?,?,?,?)').run(u.id,u.email,u.name,u.password);

const router = express.Router();

/**
 * POST /api/auth/register
 * Body: { id, email, name, password }
 */
router.post('/register', async (req, res) => {
  try {
    const { id, email, name, password } = req.body;
    if (!id || !email || !name || !password) return res.status(400).json({ error: 'Faltan campos' });

    const existing = getUserByEmail(email);
    if (existing) return res.status(409).json({ error: 'Usuario ya existe' });

    const hashed = await bcrypt.hash(password, 10);
    const user = { id, email, name, password: hashed };
    insertUser(user);

    const { password: _pw, ...safe } = user;

    // generar token
    const token = jwt.sign({ id: safe.id, email: safe.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    return res.status(201).json({ ok: true, user: safe, token });
  } catch (err) {
    console.error('Error en /api/auth/register', err && err.stack ? err.stack : err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Faltan campos' });

    const user = getUserByEmail(email);
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });

    const { password: _pw, ...safe } = user;

    // generar token JWT
    const token = jwt.sign({ id: safe.id, email: safe.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    return res.json({ ok: true, user: safe, token });
  } catch (err) {
    console.error('Error en /api/auth/login', err && err.stack ? err.stack : err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
