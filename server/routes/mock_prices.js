const express = require('express')
const router = express.Router()
router.get('/prices', (req,res)=>{
  const sample = {
    cardId: req.query.id || null,
    results: [
      { marketplace: "Cardmarket", price: 399.00, condition: "NM", url: "https://www.cardmarket.com/example" },
      { marketplace: "Tiendax", price: 420.00, condition: "NM", url: "https://www.tiendax.example" }
    ],
    fetchedAt: new Date().toISOString()
  }
  res.json(sample)
})
module.exports = router

