const express = require("express");
const router = express.Router();

router.get('/:userId', async (req, res) => {
  res.json({ name: 'Obama', bio: 'I love coding.' });
});

module.exports = router;