const express = require('express');
const router = express.Router()


router.get('/', (req, res) => {
  res.status(200).json({
    name: "Rich Dad, Poor Dad",
    email: "richdad@kadismile.com"
  })
})

module.exports = router;