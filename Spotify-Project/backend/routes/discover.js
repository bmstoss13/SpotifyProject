const express = require("express");
const router = express.Router();

router.get('/discover', (req, res) => {
  res.json([{ id: '345asd', username: 'Obama' },
            { id: 'asd345', username: 'Michelle'}
  ])
});

module.exports = router;