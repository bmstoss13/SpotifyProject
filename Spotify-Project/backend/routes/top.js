const express = require('express');
const router = express.Router();
const axios = require('axios');

// GET /top-artists?access_token=...
router.get('/top-artists', async (req, res) => {
  const accessToken = req.query.access_token;

  if (!accessToken) {
    return res.status(400).json({ error: 'Access token is required' });
  }

  try {
    const response = await axios.get('https://api.spotify.com/v1/me/top/artists', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log('🎵 Top Artists:', response.data);
    res.json(response.data); // or just res.send(response.data)
  } catch (error) {
    console.error('❌ Error fetching top artists:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch top artists' });
  }
});

module.exports = router;
