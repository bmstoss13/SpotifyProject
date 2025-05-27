const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ name: 'Obama', bio: 'I love coding.' });
});

module.exports = router;