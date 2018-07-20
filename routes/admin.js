var express = require('express');
var router = express.Router();

// Admin Routes
router.get('/', (req, res) => {
  res.send('Admin Routes');
});

module.exports = router;