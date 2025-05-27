const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const response = await axios.get('https://api.spotify.com/v1/me/tracks?limit=50', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const songs = response.data.items.map((item) => ({
      title: item.track.name,
      album: item.track.album.name,
      dateAdded: new Date(item.added_at).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      }),
      duration: formatDuration(item.track.duration_ms)
    }));

    res.json(songs);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Spotify API failed' });
  }
});

function formatDuration(ms) {
  const min = Math.floor(ms / 60000);
  const sec = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
  return `${min}:${sec}`;
}

module.exports = router;
