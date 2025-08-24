const express = require('express');
const router = express.Router();

// Business routes placeholder
router.get('/', (req, res) => {
  res.json({ message: 'Business API endpoints', version: '1.0.0' });
});

module.exports = router;
