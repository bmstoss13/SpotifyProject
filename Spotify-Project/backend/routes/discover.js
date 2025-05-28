const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
  res.json([{ profileName: 'Obama' },
            { profileName: 'Michelle'},
            { profileName: 'spotify-user-54982933'},
            { profileName: 'michaeljacksonrules82'},
            { profileName: 'GrannySmithHerself'},
            { profileName: 'test-account6000'},
            { profileName: 'walterwhite1964'}
  ])
});

module.exports = router;