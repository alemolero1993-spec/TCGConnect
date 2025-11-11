const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fs = require('fs-extra')
const path = require('path')

const USERS_FILE = path.join(__dirname, '..', 'models', 'users.json')
const JWT_SECRET = process.env.JWT_SECRET || 'changeme'
const TOKEN_EXPIRES = '7d'

async function readUsers(){ try { return await fs.readJson(USERS_FILE) } catch(e){ return [] } }
async function writeUsers(u){ await fs.outputJson(USERS_FILE, u, { spaces: 2 }) }

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body
  if(!email || !password) return res.status(400).json({ error: 'Email y password requeridos' })
  const users = await readUsers()
  if(users.find(u => u.email === email)) return res.status(409).json({ error: 'Usuario ya existe' })
  const hash = await bcrypt.hash(password, 10)
  const user = { id: Date.now().toString(), email, name: name || '', password: hash }
  users.push(user)
  await writeUsers(users)
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES })
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if(!email || !password) return res.status(400).json({ error: 'Email y password requeridos' })
  const users = await readUsers()
  const user = users.find(u => u.email === email)
  if(!user) return res.status(401).json({ error: 'Credenciales invÃ¡lidas' })
  const ok = await bcrypt.compare(password, user.password)
  if(!ok) return res.status(401).json({ error: 'Credenciales invÃ¡lidas' })
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES })
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } })
})

module.exports = router

