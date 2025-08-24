const express = require('express');
const router = express.Router();

// Community routes placeholder
router.get('/', (req, res) => {
  res.json({ message: 'Community API endpoints', version: '1.0.0' });
});

module.exports = router;
