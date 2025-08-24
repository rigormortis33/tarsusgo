const express = require('express');
const router = express.Router();

// Emergency routes placeholder
router.get('/', (req, res) => {
  res.json({ message: 'Emergency API endpoints', version: '1.0.0' });
});

module.exports = router;
