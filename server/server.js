require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')

const authRoutes = require('./routes/auth')
const collectionRoutes = require('./routes/collection')
const mockPrices = require('./routes/mock_prices')

const app = express()
process.on('uncaughtException', (err) => {
  console.error('=== UNCAUGHT EXCEPTION ===');
  console.error(err && err.stack ? err.stack : err);
});
process.on('unhandledRejection', (reason) => {
  console.error('=== UNHANDLED REJECTION ===');
  console.error(reason && reason.stack ? reason.stack : reason);
});
const PORT = 5000

app.use(express.json())
app.use(cors({ origin: process.env.CORS_ORIGIN || true }))

app.use('/api/auth', authRoutes)
app.use('/api/collection', collectionRoutes)
app.use('/collection', collectionRoutes)
app.use('/api/collections', collectionRoutes)
app.use('/collections', collectionRoutes)
app.use('/api/collections', collectionRoutes)
app.use('/collections', collectionRoutes)
app.use('/api/mock', mockPrices)

app.get('/api/health', (req, res) => res.json({ ok: true, ts: Date.now() }))

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))





